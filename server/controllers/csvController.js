import { randomUUID } from 'crypto';
import Papa from 'papaparse';
import { TABLES } from '../models/tableNames.js';
import { clearRows, insertRow, insertRows, listRows } from '../services/dataService.js';
import { emitRealtime } from '../services/realtimeService.js';

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCoordinates = (row) => {
  const lat = parseNumber(row.lat ?? row.latitude, null);
  const lng = parseNumber(row.lng ?? row.longitude ?? row.lon, null);
  if (lat === null || lng === null) return null;
  return { lat, lng };
};

const normalizeRow = (row) => {
  const normalized = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    normalized[String(key || '').trim().toLowerCase()] = String(value ?? '').trim();
  });
  return normalized;
};

const inferType = (row) => {
  const explicit = row.type || row.row_type || row.entity || row.category;
  if (explicit) {
    const value = explicit.toLowerCase();
    if (['volunteer', 'event', 'resource', 'disaster'].includes(value)) return value;
  }

  if (row.skills || row.email || row.hoursworked || row.impactscore || row.onduty) return 'volunteer';
  if (row.volunteersrequired || row.eventdate || row.event || row.eventname) return 'event';
  if (row.resourcename || row.quantity || row.stock) return 'resource';
  if (row.severity || row.alert || row.disastertype) return 'disaster';
  return 'unknown';
};

const buildVolunteer = (row) => ({
  id: row.id || randomUUID(),
  name: row.name || row.volunteername || 'Volunteer',
  email: row.email || null,
  role: 'volunteer',
  status: row.status || 'approved',
  skills: (row.skills || '').split('|').filter(Boolean),
  eventsJoined: parseNumber(row.eventsjoined, 0),
  hoursWorked: parseNumber(row.hoursworked || row.hours, 0),
  impactScore: parseNumber(row.impactscore, 0),
  location: row.location || null,
  coordinates: parseCoordinates(row),
  onDuty: String(row.onduty || '').toLowerCase() === 'true',
  available: true,
});

const buildEvent = (row) => ({
  id: row.id || randomUUID(),
  title: row.title || row.event || row.eventname || 'Event',
  name: row.name || null,
  description: row.description || null,
  location: row.location || null,
  date: row.date || row.eventdate || new Date().toISOString(),
  status: row.status || 'planned',
  volunteersRequired: parseNumber(row.volunteersrequired, 0),
  assignedVolunteers: [],
  coordinates: parseCoordinates(row),
});

const buildResource = (row) => ({
  id: row.id || randomUUID(),
  resourceName: row.resourcename || row.name || 'Resource',
  name: row.name || row.resourcename || 'Resource',
  quantity: parseNumber(row.quantity || row.stock, 0),
  status: row.status || 'available',
  location: row.location || null,
  coordinates: parseCoordinates(row),
});

const buildDisaster = (row) => ({
  id: row.id || randomUUID(),
  type: row.type || row.disastertype || row.alert || 'Disaster Alert',
  location: row.location || 'Unknown',
  severity: row.severity || 'high',
  status: row.status || 'active',
  coordinates: parseCoordinates(row),
});

const computeAnalytics = async () => {
  const [volunteers, events, resources, disasters] = await Promise.all([
    listRows(TABLES.volunteers),
    listRows(TABLES.events),
    listRows(TABLES.resources),
    listRows(TABLES.disasters),
  ]);

  return {
    totalVolunteers: volunteers.length,
    activeEvents: events.filter((item) => String(item.status || '').toLowerCase() !== 'completed').length,
    availableResources: resources.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    disasterAlerts: disasters.length,
  };
};

export const uploadCsv = async (req, res) => {
  const csvText = req.file?.buffer?.toString('utf-8') || req.body?.csv || '';
  if (!csvText.trim()) {
    return res.status(400).json({ message: 'CSV content is required' });
  }

  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    return res.status(400).json({ message: parsed.errors[0].message || 'CSV parsing failed' });
  }

  const rows = (parsed.data || []).map(normalizeRow);
  const volunteers = [];
  const events = [];
  const resources = [];
  const disasters = [];

  rows.forEach((row) => {
    const type = inferType(row);
    if (type === 'volunteer') volunteers.push(buildVolunteer(row));
    if (type === 'event') events.push(buildEvent(row));
    if (type === 'resource') resources.push(buildResource(row));
    if (type === 'disaster') disasters.push(buildDisaster(row));
  });

  await Promise.all([
    clearRows(TABLES.volunteers),
    clearRows(TABLES.events),
    clearRows(TABLES.resources),
    clearRows(TABLES.disasters),
  ]);

  await Promise.all([
    insertRows(TABLES.volunteers, volunteers),
    insertRows(TABLES.events, events),
    insertRows(TABLES.resources, resources),
    insertRows(TABLES.disasters, disasters),
  ]);

  const analytics = await computeAnalytics();
  await insertRow(TABLES.analytics, {
    id: randomUUID(),
    source: 'csv',
    uploadedBy: req.user?.id || null,
    uploadedAt: new Date().toISOString(),
    metrics: analytics,
    counts: {
      volunteers: volunteers.length,
      events: events.length,
      resources: resources.length,
      disasters: disasters.length,
    },
  });

  await insertRow(TABLES.activityLogs, {
    id: randomUUID(),
    action: 'CSV upload',
    actorId: req.user?.id || null,
    details: `Uploaded ${rows.length} rows`,
    metadata: {
      volunteers: volunteers.length,
      events: events.length,
      resources: resources.length,
      disasters: disasters.length,
    },
    timestamp: new Date().toISOString(),
  });

  emitRealtime('csv:uploaded', {
    counts: {
      volunteers: volunteers.length,
      events: events.length,
      resources: resources.length,
      disasters: disasters.length,
    },
    metrics: analytics,
  });

  return res.status(201).json({
    message: 'CSV uploaded successfully',
    counts: {
      volunteers: volunteers.length,
      events: events.length,
      resources: resources.length,
      disasters: disasters.length,
      totalRows: rows.length,
    },
    metrics: analytics,
  });
};
