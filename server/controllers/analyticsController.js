import { TABLES } from '../models/tableNames.js';
import { listRows } from '../services/dataService.js';

const groupByMonth = (rows, dateField = 'created_at') => {
  const grouped = rows.reduce((acc, row) => {
    const key = new Date(row[dateField] || row.timestamp || Date.now()).toLocaleString('en-US', {
      month: 'short',
    });
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

export const getResourceUsage = async (_req, res) => {
  const resources = await listRows(TABLES.resources);
  return res.json(
    resources.map((item) => ({
      _id: item.id,
      resourceName: item.resourceName || item.name,
      currentStock: Number(item.quantity || 0),
      status: item.status || 'available',
    }))
  );
};

export const getEventParticipation = async (_req, res) => {
  const events = await listRows(TABLES.events);
  return res.json({
    events: events.map((event) => ({
      _id: event.id,
      title: event.title || event.name,
      assignedCount: (event.assignedVolunteers || []).length,
    })),
  });
};

export const getLeaderboard = async (_req, res) => {
  const volunteers = await listRows(TABLES.volunteers);
  const leaderboard = [...volunteers]
    .sort((a, b) => Number(b.impactScore || 0) - Number(a.impactScore || 0))
    .map((row, index) => ({
      _id: row.id,
      volunteerId: row.id,
      name: row.name,
      rank: index + 1,
      points: Number(row.impactScore || 0),
      hoursWorked: Number(row.hoursWorked || 0),
    }));

  return res.json(leaderboard);
};

export const getAnalyticsSummary = async (_req, res) => {
  const [volunteers, events, resources, disasters, activity] = await Promise.all([
    listRows(TABLES.volunteers),
    listRows(TABLES.events),
    listRows(TABLES.resources),
    listRows(TABLES.disasters),
    listRows(TABLES.volunteerActivity),
  ]);

  const metrics = {
    totalVolunteers: volunteers.length,
    activeEvents: events.filter((event) => String(event.status || '').toLowerCase() !== 'completed').length,
    availableResources: resources.reduce((sum, row) => sum + Number(row.quantity || 0), 0),
    disasterAlerts: disasters.length,
  };

  const volunteerGrowth = groupByMonth(volunteers);
  const eventParticipation = events.map((event) => ({
    name: event.title || event.name || 'Event',
    attended: (event.assignedVolunteers || []).length,
    required: Number(event.volunteersRequired || 0),
  }));
  const resourceDistribution = resources.map((resource) => ({
    name: resource.resourceName || resource.name || 'Resource',
    quantity: Number(resource.quantity || 0),
  }));

  const leaderboard = [...volunteers]
    .sort((a, b) => Number(b.impactScore || 0) - Number(a.impactScore || 0))
    .map((row, index) => ({
      id: row.id,
      rank: index + 1,
      name: row.name,
      eventsJoined: Number(row.eventsJoined || 0),
      hoursWorked: Number(row.hoursWorked || 0),
      impactScore: Number(row.impactScore || 0),
    }));

  return res.json({
    metrics,
    charts: {
      volunteerGrowth,
      eventParticipation,
      resourceDistribution,
      monthlyActivity: groupByMonth(activity, 'timestamp'),
    },
    leaderboard,
  });
};
