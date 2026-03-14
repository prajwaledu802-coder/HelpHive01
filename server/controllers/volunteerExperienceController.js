import { TABLES } from '../models/tableNames.js';
import { getById, insertRow, listRows, updateRow } from '../services/dataService.js';

export const getActivity = async (_req, res) => {
  const [activity, logs] = await Promise.all([
    listRows(TABLES.volunteerActivity),
    listRows(TABLES.activityLogs),
  ]);

  const normalizedLogs = logs.map((item) => ({
    _id: item.id,
    timestamp: item.timestamp || item.created_at,
    title: item.action,
    details: item.details,
    metadata: item.metadata,
    type: 'log',
  }));

  return res.json([...activity, ...normalizedLogs]);
};

export const getHelpRequests = async (req, res) => {
  const requests = await listRows(TABLES.helpRequests);
  const { status } = req.query;
  if (!status) {
    return res.json(requests);
  }

  return res.json(requests.filter((item) => String(item.status || '').toLowerCase() === String(status).toLowerCase()));
};

export const respondToHelpRequest = async (req, res) => {
  const request = await getById(TABLES.helpRequests, req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Help request not found' });
  }

  const responders = new Set(request.assignedVolunteers || []);
  const userId = req.user?.id || req.body.userId;
  if (userId) responders.add(userId);

  const updated = await updateRow(TABLES.helpRequests, request.id, {
    assignedVolunteers: Array.from(responders),
    status: 'in-progress',
  });

  return res.json(updated);
};

export const getNotifications = async (req, res) => {
  const list = await listRows(TABLES.notifications);
  const filtered = req.user?.id ? list.filter((item) => item.userId === req.user.id) : list;
  return res.json(filtered);
};

export const getMapData = async (_req, res) => {
  const [events, volunteers, resources, helpRequests] = await Promise.all([
    listRows(TABLES.events),
    listRows(TABLES.volunteers),
    listRows(TABLES.resources),
    listRows(TABLES.helpRequests),
  ]);

  return res.json({
    events,
    volunteers,
    resources,
    helpRequests,
  });
};

export const getImpact = async (req, res) => {
  const volunteers = await listRows(TABLES.volunteers);
  const userId = req.query.userId || req.user?.id;
  const volunteer = volunteers.find((item) => item.id === userId) || volunteers[0] || {};

  return res.json({
    score: Number(volunteer.impactScore || 0),
    hoursWorked: Number(volunteer.hoursWorked || 0),
    eventsJoined: Number(volunteer.eventsJoined || 0),
  });
};

export const getProfile = async (req, res) => {
  const volunteer = await getById(TABLES.volunteers, req.params.userId);
  if (!volunteer) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  return res.json(volunteer);
};

export const updateProfile = async (req, res) => {
  const volunteer = await updateRow(TABLES.volunteers, req.params.userId, req.body);
  return res.json(volunteer);
};

export const getCertificate = async (req, res) => {
  const volunteer = await getById(TABLES.volunteers, req.params.userId);
  return res.json({
    volunteerId: req.params.userId,
    name: volunteer?.name || 'Volunteer',
    certificateId: `HH-${String(req.params.userId).slice(0, 8).toUpperCase()}`,
    issuedAt: new Date().toISOString(),
    organization: 'HelpHive',
  });
};

export const getDisasters = async (_req, res) => {
  const rows = await listRows(TABLES.disasters);
  return res.json(rows);
};

export const getTasks = async (_req, res) => {
  const rows = await listRows(TABLES.tasks);
  return res.json(rows);
};

export const createVolunteerRegistration = async (req, res) => {
  const volunteer = await insertRow(TABLES.volunteers, {
    ...req.body,
    status: 'pending',
    skills: req.body.skills || [],
  });

  return res.status(201).json(volunteer);
};
