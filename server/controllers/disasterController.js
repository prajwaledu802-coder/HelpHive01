import { randomUUID } from 'crypto';
import { TABLES } from '../models/tableNames.js';
import { insertRow, listRows } from '../services/dataService.js';
import { emitRealtime } from '../services/realtimeService.js';

export const getDisasters = async (_req, res) => {
  const rows = await listRows(TABLES.disasters);
  return res.json(rows);
};

export const createDisaster = async (req, res) => {
  const payload = {
    id: randomUUID(),
    type: req.body?.type || 'Emergency Pin',
    location: req.body?.location || 'Pinned location',
    severity: req.body?.severity || 'high',
    status: req.body?.status || 'active',
    coordinates: req.body?.coordinates || null,
    createdBy: req.user?.id || null,
    created_at: new Date().toISOString(),
  };

  const created = await insertRow(TABLES.disasters, payload);

  emitRealtime('disaster:alert', {
    id: created.id,
    type: created.type,
    location: created.location,
    severity: created.severity,
    coordinates: created.coordinates,
  });

  return res.status(201).json(created);
};
