import { TABLES } from '../models/tableNames.js';
import { supabase } from './supabaseClient.js';
import { randomUUID } from 'crypto';

const fallbackStore = new Map();

const getFallbackRows = (table) => {
  if (!fallbackStore.has(table)) {
    fallbackStore.set(table, []);
  }
  return fallbackStore.get(table);
};

const isSchemaMismatchError = (error) => {
  if (!error) return false;

  const message = String(error.message || '');
  const code = String(error.code || '');

  return (
    /Could not find the table|relation .* does not exist|column .* does not exist|schema cache/i.test(message) ||
    ['42P01', '42703', 'PGRST204', 'PGRST205'].includes(code)
  );
};

const normalizeId = (row) => {
  if (!row) return row;
  return {
    ...row,
    _id: row._id || row.id,
  };
};

const withError = (error, fallback) => {
  if (!error) return fallback;
  throw new Error(error.message || 'Database operation failed');
};

export const listRows = async (table, { filters = {}, orderBy = 'created_at', ascending = false } = {}) => {
  let query = supabase.from(table).select('*');

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query = query.eq(key, value);
  });

  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }

  const { data, error } = await query;
  if (error && !isSchemaMismatchError(error)) {
    withError(error);
  }

  if (error && isSchemaMismatchError(error)) {
    const rows = [...getFallbackRows(table)];
    const filtered = rows.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true;
        return row[key] === value;
      })
    );

    if (orderBy) {
      filtered.sort((a, b) => {
        const av = a[orderBy] || '';
        const bv = b[orderBy] || '';
        if (av === bv) return 0;
        return ascending ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
    }

    return filtered.map(normalizeId);
  }

  return (data || []).map(normalizeId);
};

export const getById = async (table, id) => {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error && isSchemaMismatchError(error)) {
    const row = getFallbackRows(table).find((item) => item.id === id);
    return row ? normalizeId(row) : null;
  }
  if (error) return null;
  return normalizeId(data);
};

export const insertRow = async (table, payload) => {
  const { data, error } = await supabase.from(table).insert(payload).select('*').single();
  if (error && isSchemaMismatchError(error)) {
    const rows = getFallbackRows(table);
    const row = {
      id: payload.id || randomUUID(),
      created_at: new Date().toISOString(),
      ...payload,
    };
    rows.push(row);
    return normalizeId(row);
  }
  withError(error);
  return normalizeId(data);
};

export const updateRow = async (table, id, payload) => {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select('*').single();
  if (error && isSchemaMismatchError(error)) {
    const rows = getFallbackRows(table);
    const idx = rows.findIndex((item) => item.id === id);
    if (idx === -1) {
      throw new Error('Record not found');
    }
    rows[idx] = {
      ...rows[idx],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    return normalizeId(rows[idx]);
  }
  withError(error);
  return normalizeId(data);
};

export const deleteRow = async (table, id) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error && isSchemaMismatchError(error)) {
    const rows = getFallbackRows(table);
    const next = rows.filter((item) => item.id !== id);
    fallbackStore.set(table, next);
    return;
  }
  withError(error);
};

export const clearRows = async (table) => {
  const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error && isSchemaMismatchError(error)) {
    fallbackStore.set(table, []);
    return;
  }
  withError(error);
};

export const insertRows = async (table, payloads = []) => {
  if (!Array.isArray(payloads) || !payloads.length) return [];

  const { data, error } = await supabase.from(table).insert(payloads).select('*');
  if (error && isSchemaMismatchError(error)) {
    const rows = getFallbackRows(table);
    const created = payloads.map((payload) => {
      const row = {
        id: payload.id || randomUUID(),
        created_at: new Date().toISOString(),
        ...payload,
      };
      rows.push(row);
      return row;
    });
    return created.map(normalizeId);
  }

  withError(error);
  return (data || []).map(normalizeId);
};

export const upsertVolunteerProfile = async (user) => {
  const existing = await getById(TABLES.volunteers, user.id);

  if (existing) {
    return updateRow(TABLES.volunteers, user.id, {
      name: user.fullName || existing.name,
      email: user.email,
      role: user.role,
    });
  }

  return insertRow(TABLES.volunteers, {
    id: user.id,
    name: user.fullName,
    email: user.email,
    role: user.role,
    status: 'approved',
    skills: user.skills || [],
    eventsJoined: 0,
    hoursWorked: 0,
    impactScore: 0,
  });
};
