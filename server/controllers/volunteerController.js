import { TABLES } from '../models/tableNames.js';
import { deleteRow, getById, insertRow, listRows, updateRow } from '../services/dataService.js';
import { emitRealtime } from '../services/realtimeService.js';

export const getVolunteers = async (req, res) => {
  const volunteers = await listRows(TABLES.volunteers);
  const { status, search, availability } = req.query;

  let filtered = volunteers;

  if (status) {
    filtered = filtered.filter((item) => String(item.status || '').toLowerCase() === String(status).toLowerCase());
  }

  if (availability !== undefined) {
    const available = availability === 'true';
    filtered = filtered.filter((item) => Boolean(item.available ?? true) === available);
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter((item) =>
      [item.name, item.location, ...(item.skills || [])].join(' ').toLowerCase().includes(q)
    );
  }

  return res.json(filtered);
};

export const createVolunteer = async (req, res) => {
  const volunteer = await insertRow(TABLES.volunteers, {
    ...req.body,
    status: req.body.status || 'pending',
    skills: req.body.skills || [],
    eventsJoined: 0,
    hoursWorked: 0,
    impactScore: 0,
  });

  return res.status(201).json(volunteer);
};

export const getVolunteerById = async (req, res) => {
  const volunteer = await getById(TABLES.volunteers, req.params.id);
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }

  return res.json(volunteer);
};

export const updateVolunteer = async (req, res) => {
  const volunteer = await updateRow(TABLES.volunteers, req.params.id, req.body);
  return res.json(volunteer);
};

export const approveVolunteer = async (req, res) => {
  const volunteer = await updateRow(TABLES.volunteers, req.params.id, { status: 'approved' });
  return res.json(volunteer);
};

export const deleteVolunteer = async (req, res) => {
  await deleteRow(TABLES.volunteers, req.params.id);
  return res.status(204).send();
};

export const updateDutyStatus = async (req, res) => {
  const volunteerId = req.params.id || req.user?.id;
  const volunteer = await getById(TABLES.volunteers, volunteerId);
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }

  const onDuty = Boolean(req.body?.onDuty);
  const updated = await updateRow(TABLES.volunteers, volunteerId, {
    onDuty,
    available: onDuty,
    coordinates: req.body?.coordinates || volunteer.coordinates || null,
    location: req.body?.location || volunteer.location || null,
  });

  emitRealtime('volunteer:duty-updated', {
    volunteerId,
    status: onDuty ? 'ON DUTY' : 'OFF DUTY',
    coordinates: updated.coordinates,
  });

  return res.json(updated);
};
