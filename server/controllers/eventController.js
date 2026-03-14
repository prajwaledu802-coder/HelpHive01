import { TABLES } from '../models/tableNames.js';
import { deleteRow, getById, insertRow, listRows, updateRow } from '../services/dataService.js';
import { emitRealtime } from '../services/realtimeService.js';

export const getEvents = async (req, res) => {
  const events = await listRows(TABLES.events);
  const { status } = req.query;

  if (!status) {
    return res.json(events);
  }

  return res.json(events.filter((item) => String(item.status || '').toLowerCase() === String(status).toLowerCase()));
};

export const createEvent = async (req, res) => {
  const event = await insertRow(TABLES.events, {
    ...req.body,
    assignedVolunteers: req.body.assignedVolunteers || [],
    status: req.body.status || 'planned',
  });

  await insertRow(TABLES.activityLogs, {
    action: 'Admin created event',
    actorId: req.user?.id || null,
    details: `Created ${event.title || event.name || 'event'}`,
    metadata: {
      eventId: event.id,
    },
    timestamp: new Date().toISOString(),
  });

  emitRealtime('event:new', event);
  return res.status(201).json(event);
};

export const deleteEvent = async (req, res) => {
  await deleteRow(TABLES.events, req.params.id);
  emitRealtime('event:deleted', { id: req.params.id });
  return res.status(204).send();
};

const resolveVolunteerId = (req) => req.user?.id || req.body.userId || req.body.volunteerId;

export const joinEvent = async (req, res) => {
  const event = await getById(TABLES.events, req.params.id || req.body.eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const volunteerId = resolveVolunteerId(req);
  const assigned = new Set(event.assignedVolunteers || []);
  if (volunteerId) assigned.add(volunteerId);

  const updated = await updateRow(TABLES.events, event.id, {
    assignedVolunteers: Array.from(assigned),
  });

  await insertRow(TABLES.activityLogs, {
    action: 'Volunteer joined event',
    actorId: volunteerId || null,
    details: `Joined ${event.title || event.name || 'event'}`,
    metadata: {
      eventId: event.id,
      volunteerId,
    },
    timestamp: new Date().toISOString(),
  });

  emitRealtime('event:volunteer-joined', {
    eventId: event.id,
    volunteerId,
  });

  return res.json(updated);
};

export const assignVolunteers = async (req, res) => {
  const event = await getById(TABLES.events, req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const assigned = new Set(event.assignedVolunteers || []);
  (req.body.volunteerIds || []).forEach((id) => assigned.add(id));

  const updated = await updateRow(TABLES.events, event.id, {
    assignedVolunteers: Array.from(assigned),
  });

  return res.json(updated);
};
