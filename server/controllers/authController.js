import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'crypto';
import { TABLES } from '../models/tableNames.js';
import { getById, insertRow, listRows, upsertVolunteerProfile } from '../services/dataService.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyWithTokenInfo = async (idToken) => {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  if (!response.ok) {
    throw new Error('Google tokeninfo verification failed');
  }

  const payload = await response.json();
  const issuer = String(payload.iss || '').toLowerCase();
  if (!issuer.includes('accounts.google.com')) {
    throw new Error('Invalid Google token issuer');
  }

  if (process.env.GOOGLE_CLIENT_ID) {
    const allowedAudiences = String(process.env.GOOGLE_CLIENT_ID)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (allowedAudiences.length && !allowedAudiences.includes(String(payload.aud || '').trim())) {
      throw new Error('Google token audience mismatch');
    }
  }

  return {
    email: String(payload.email || '').toLowerCase(),
    name: payload.name || payload.given_name || 'Google User',
    sub: payload.sub,
  };
};

const verifyGoogleCredential = async (idToken) => {
  if (process.env.GOOGLE_CLIENT_ID) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: String(process.env.GOOGLE_CLIENT_ID)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });

    const payload = ticket.getPayload();
    return {
      email: String(payload?.email || '').toLowerCase(),
      name: payload?.name || 'Google User',
      sub: payload?.sub,
    };
  }

  // Fallback path for environments where GOOGLE_CLIENT_ID was not set yet.
  return verifyWithTokenInfo(idToken);
};

const getField = (row, ...keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }
  return undefined;
};

const normalizeUser = (user) => ({
  id: getField(user, 'id', '_id'),
  fullName: getField(user, 'fullName', 'fullname', 'name') || 'User',
  email: getField(user, 'email') || '',
  role: getField(user, 'role') || 'volunteer',
  phone: getField(user, 'phone') || '',
  location: getField(user, 'location') || '',
  skills: getField(user, 'skills') || [],
  passwordHash: getField(user, 'passwordHash', 'passwordhash') || '',
});

const sanitizeUser = (user) => {
  const normalized = normalizeUser(user);
  return {
    id: normalized.id,
    _id: normalized.id,
    fullName: normalized.fullName,
    name: normalized.fullName,
    email: normalized.email,
    role: normalized.role,
    phone: normalized.phone,
    location: normalized.location,
    skills: normalized.skills,
  };
};

export const register = async (req, res) => {
  const { fullName, email, password, role = 'volunteer', phone, location, skills = [] } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '');
  const normalizedName = String(fullName || '').trim();

  if (!normalizedName || !normalizedEmail || !normalizedPassword) {
    return res.status(400).json({ message: 'fullName, email and password are required' });
  }

  const users = await listRows(TABLES.users, { filters: { email: normalizedEmail } });
  if (users.length) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(normalizedPassword, 10);
  const user = await insertRow(TABLES.users, {
    fullname: normalizedName,
    email: normalizedEmail,
    passwordhash: passwordHash,
    role,
    phone,
    location,
    skills,
  });

  const normalizedUser = normalizeUser(user);

  if (role === 'volunteer') {
    try {
      await upsertVolunteerProfile(normalizedUser);
    } catch (error) {
      // Keep auth functional even when volunteer profile schema is not initialized yet.
      console.warn('Volunteer profile sync skipped:', error.message);
    }
  }

  return res.status(201).json({ token: signToken(normalizedUser.id), user: sanitizeUser(normalizedUser) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '');

  const users = await listRows(TABLES.users, { filters: { email: normalizedEmail } });
  const user = users[0] ? normalizeUser(users[0]) : null;

  if (!user || !(await bcrypt.compare(normalizedPassword, user.passwordHash || ''))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({ token: signToken(user.id), user: sanitizeUser(user) });
};

export const googleAuth = async (req, res) => {
  const credential = req.body?.credential;
  const requestedRole = req.body?.role;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  const payload = await verifyGoogleCredential(credential);
  const email = String(payload?.email || '').toLowerCase();
  const fullName = payload?.name || 'Google User';

  if (!email) {
    return res.status(400).json({ message: 'Google account email not available' });
  }

  const users = await listRows(TABLES.users, { filters: { email } });
  let user = users[0];

  if (!user) {
    const role = requestedRole === 'admin' ? 'admin' : 'volunteer';
    const generatedHash = await bcrypt.hash(payload?.sub || randomUUID(), 10);
    user = await insertRow(TABLES.users, {
      fullname: fullName,
      email,
      passwordhash: generatedHash,
      role,
      phone: '',
      location: '',
      skills: [],
      authProvider: 'google',
      googleSub: payload?.sub || null,
    });

    const normalizedUser = normalizeUser(user);

    if (role === 'volunteer') {
      try {
        await upsertVolunteerProfile(normalizedUser);
      } catch (error) {
        console.warn('Volunteer profile sync skipped:', error.message);
      }
    }

    user = normalizedUser;
  }

  return res.json({ token: signToken(user.id), user: sanitizeUser(user) });
};

export const me = async (req, res) => {
  const user = await getById(TABLES.users, req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(sanitizeUser(user));
};
