import { randomUUID } from 'crypto';
import { TABLES } from '../models/tableNames.js';
import { insertRow, insertRows, listRows } from '../services/dataService.js';
import { emitRealtime } from '../services/realtimeService.js';

const normalizePriority = (value) => {
  const raw = String(value || 'normal').toLowerCase();
  if (raw === 'important' || raw === 'emergency') return raw;
  return 'normal';
};

export const getMessages = async (req, res) => {
  const rows = await listRows(TABLES.messages);
  const userId = req.user?.id;
  const role = req.user?.role;

  if (role === 'admin') {
    return res.json(rows);
  }

  const visible = rows.filter((item) => {
    if (item.recipientScope === 'all') return true;
    if (!userId) return false;
    return item.recipientUserId === userId;
  });

  return res.json(visible);
};

export const createMessage = async (req, res) => {
  const payload = {
    id: randomUUID(),
    senderId: req.user?.id || null,
    senderRole: req.user?.role || 'admin',
    senderName: req.user?.fullName || req.user?.name || 'Admin',
    title: req.body?.title || 'Admin Message',
    body: req.body?.body || req.body?.message || '',
    priority: normalizePriority(req.body?.priority),
    recipientScope: req.body?.recipientScope || req.body?.sendTo || 'all',
    recipientUserId: req.body?.recipientUserId || null,
    created_at: new Date().toISOString(),
  };

  const created = await insertRow(TABLES.messages, payload);

  const volunteers = await listRows(TABLES.volunteers);
  const notificationRows = volunteers.map((volunteer) => ({
    id: randomUUID(),
    userId: volunteer.id,
    title: created.title,
    message: created.body,
    type: created.priority,
    read: false,
    created_at: new Date().toISOString(),
  }));

  await insertRows(TABLES.notifications, notificationRows);

  emitRealtime('message:new', {
    id: created.id,
    title: created.title,
    priority: created.priority,
    recipientScope: created.recipientScope,
  });

  emitRealtime('notification:new', {
    message: created.title,
    priority: created.priority,
  });

  return res.status(201).json(created);
};
