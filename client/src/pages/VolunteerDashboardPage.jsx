import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  Lightbulb,
  MapPinned,
  Medal,
  MessageSquare,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  Upload,
  User,
} from 'lucide-react';
import Papa from 'papaparse';
import MapContainer from '../components/MapContainer';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const DEFAULT_EVENTS = [
  {
    id: 'ev1',
    title: 'Flood Relief Camp',
    location: 'Guwahati',
    date: '2026-03-18',
    requiredVolunteers: 24,
    role: 'Medical Support',
    status: 'Active',
    coordinates: { lat: 26.1445, lng: 91.7362 },
  },
  {
    id: 'ev2',
    title: 'Food Distribution Drive',
    location: 'Patna',
    date: '2026-03-25',
    requiredVolunteers: 18,
    role: 'Logistics',
    status: 'Pending',
    coordinates: { lat: 25.5941, lng: 85.1376 },
  },
  {
    id: 'ev3',
    title: 'Community Health Checkup',
    location: 'Bhopal',
    date: '2026-04-03',
    requiredVolunteers: 16,
    role: 'Registration',
    status: 'Completed',
    coordinates: { lat: 23.2599, lng: 77.4126 },
  },
];

const DEFAULT_TASKS = [
  { id: 't1', name: 'Volunteer Check-in Desk', event: 'Flood Relief Camp', deadline: '2026-03-17', priority: 'High', done: false },
  { id: 't2', name: 'Inventory Count', event: 'Food Distribution Drive', deadline: '2026-03-23', priority: 'Medium', done: false },
  { id: 't3', name: 'Medical Kit Packing', event: 'Community Health Checkup', deadline: '2026-04-01', priority: 'Low', done: true },
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'n1', type: 'New event assigned', text: 'You were assigned to Flood Relief Camp.', time: '2 min ago' },
  { id: 'n2', type: 'Emergency alert', text: 'Disaster alert raised near Silchar zone.', time: '14 min ago' },
  { id: 'n3', type: 'Admin message', text: 'Please update your availability for weekend drives.', time: '1 hr ago' },
  { id: 'n4', type: 'Leaderboard update', text: 'You moved up to rank #4 this week.', time: '3 hrs ago' },
];

const DEFAULT_TIMELINE = [
  { id: 'tl1', title: 'Volunteer joined event', detail: 'Joined Flood Relief Camp', timestamp: 'Today, 09:40 AM' },
  { id: 'tl2', title: 'Task completed', detail: 'Completed Medical Kit Packing', timestamp: 'Today, 08:20 AM' },
  { id: 'tl3', title: 'Message received', detail: 'Admin sent roster update', timestamp: 'Yesterday, 07:30 PM' },
  { id: 'tl4', title: 'Event created', detail: 'Food Distribution Drive added', timestamp: 'Yesterday, 04:10 PM' },
];

const DEFAULT_CHAT = [
  { id: 'c1', sender: 'Admin', text: 'Can you confirm availability for flood response tomorrow?', time: '09:28' },
  { id: 'c2', sender: 'Volunteer', text: 'Yes, I can report by 8 AM with medical kit support.', time: '09:30' },
  { id: 'c3', sender: 'Admin', text: 'Great. I have marked your role as Medical Support.', time: '09:31' },
];

const HOURS_DATA = [
  { month: 'Jan', hours: 24 },
  { month: 'Feb', hours: 36 },
  { month: 'Mar', hours: 52 },
  { month: 'Apr', hours: 48 },
  { month: 'May', hours: 61 },
  { month: 'Jun', hours: 74 },
];

const PARTICIPATION_DATA = [
  { month: 'Jan', attended: 3, total: 5 },
  { month: 'Feb', attended: 4, total: 6 },
  { month: 'Mar', attended: 5, total: 7 },
  { month: 'Apr', attended: 6, total: 8 },
  { month: 'May', attended: 7, total: 9 },
  { month: 'Jun', attended: 8, total: 10 },
];

const ACTIVITY_DATA = [
  { month: 'Jan', impact: 52 },
  { month: 'Feb', impact: 66 },
  { month: 'Mar', impact: 78 },
  { month: 'Apr', impact: 83 },
  { month: 'May', impact: 88 },
  { month: 'Jun', impact: 93 },
];

const LEADERBOARD_DATA = [
  { id: 'l1', name: 'Aarav Sharma', events: 14, hours: 96, tasks: 41, rank: 1, badge: 'Community Hero' },
  { id: 'l2', name: 'Meera Iyer', events: 13, hours: 90, tasks: 39, rank: 2, badge: 'Active Responder' },
  { id: 'l3', name: 'Vikram Patel', events: 12, hours: 82, tasks: 35, rank: 3, badge: 'Volunteer Champion' },
  { id: 'l4', name: 'Nisha Gupta', events: 10, hours: 70, tasks: 28, rank: 4, badge: 'Rising Contributor' },
];

const aiCards = [
  {
    id: 'ai1',
    title: 'Volunteer Demand Prediction',
    description: 'Expected volunteer demand may rise 18% over the next 7 days in flood response zones.',
    icon: Sparkles,
  },
  {
    id: 'ai2',
    title: 'Resource Shortage Alert',
    description: 'Medical consumables likely to run low in two active camps within 48 hours.',
    icon: ShieldAlert,
  },
  {
    id: 'ai3',
    title: 'Event Participation Trend',
    description: 'Weekend participation trend is up by 12% compared to last month.',
    icon: Flame,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const CountUp = ({ value, duration = 1.2, suffix = '' }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const endValue = Number(value) || 0;

    const step = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(endValue * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span>{display}{suffix}</span>;
};

const statusClass = (status) => {
  if (status === 'Active') return 'bg-emerald-500/15 text-emerald-200';
  if (status === 'Completed') return 'bg-indigo-500/15 text-indigo-200';
  return 'bg-amber-500/15 text-amber-200';
};

const priorityClass = (priority) => {
  if (priority === 'High') return 'bg-rose-500/15 text-rose-200';
  if (priority === 'Medium') return 'bg-amber-500/15 text-amber-200';
  return 'bg-emerald-500/15 text-emerald-200';
};

const VolunteerDashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [csvRows, setCsvRows] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hoursData, setHoursData] = useState([]);
  const [participationData, setParticipationData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [onDuty, setOnDuty] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/volunteer/dashboard'),
      api.get('/analytics'),
      api.get('/messages'),
      api.get('/notifications'),
      api.get('/resources'),
      api.get('/disasters'),
    ])
      .then(([dashboardRes, analyticsRes, messagesRes, notificationsRes, resourcesRes, disastersRes]) => {
        const dashboard = dashboardRes.data || {};
        const analytics = analyticsRes.data || {};

        const mappedEvents = (dashboard.nearbyEvents || []).map((event) => ({
          id: event._id || event.id,
          title: event.title || event.name || 'Event',
          location: event.location || 'Unknown',
          date: event.date || new Date().toISOString(),
          requiredVolunteers: event.volunteersRequired || 0,
          role: 'Volunteer',
          status: event.status || 'Pending',
          coordinates: event.coordinates,
        }));

        const mappedMyEvents = (dashboard.joinedEvents || []).map((event) => ({
          id: event._id || event.id,
          title: event.title || event.name || 'Event',
          location: event.location || 'Unknown',
          date: event.date || new Date().toISOString(),
          role: 'Volunteer',
          status: event.status || 'Active',
        }));

        const mappedTasks = (dashboard.tasks || []).map((task) => ({
          id: task._id || task.id,
          name: task.title || 'Task',
          event: task.eventId?.title || 'General',
          deadline: task.deadline || task.created_at || new Date().toISOString(),
          priority: task.priority || 'Medium',
          done: String(task.status || '').toLowerCase() === 'completed',
        }));

        const mappedTimeline = (dashboard.activity || []).map((item, index) => ({
          id: item._id || item.id || `tl-${index}`,
          title: item.eventId?.title ? 'Volunteer joined event' : 'Activity update',
          detail: item.eventId?.title || `Logged ${item.hoursContributed || 0} hours`,
          timestamp: new Date(item.timestamp || item.created_at || Date.now()).toLocaleString(),
        }));

        const mappedChat = (messagesRes.data || []).map((msg) => ({
          id: msg.id,
          sender: msg.senderRole === 'volunteer' ? 'Volunteer' : 'Admin',
          text: msg.body,
          time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        const mappedNotifications = [
          ...(notificationsRes.data || []).map((item) => ({
            id: item.id,
            type: item.title || 'Notification',
            text: item.message || '',
            time: new Date(item.created_at || Date.now()).toLocaleString(),
          })),
          ...(messagesRes.data || []).map((item) => ({
            id: `msg-${item.id}`,
            type: 'Admin message',
            text: item.title,
            time: new Date(item.created_at || Date.now()).toLocaleString(),
          })),
        ];

        const volunteerProfile = dashboard.profile || {};
        setOnDuty(Boolean(volunteerProfile.onDuty));
        setEvents(mappedEvents);
        setMyEvents(mappedMyEvents);
        setTasks(mappedTasks);
        setTimeline(mappedTimeline);
        setChatMessages(mappedChat);
        setNotifications(mappedNotifications);
        setLeaderboard((analytics.leaderboard || []).map((item) => ({
          id: item.id,
          rank: item.rank,
          name: item.name,
          events: item.eventsJoined,
          hours: item.hoursWorked,
          tasks: 0,
          badge: item.rank === 1 ? 'Community Hero' : item.rank === 2 ? 'Active Responder' : item.rank === 3 ? 'Volunteer Champion' : 'Volunteer',
        })));
        setHoursData((analytics.charts?.volunteerGrowth || []).map((row) => ({ month: row.name, hours: row.value })));
        setParticipationData((analytics.charts?.eventParticipation || []).map((row) => ({ month: row.name, attended: row.attended, total: row.required })));
        setActivityData((analytics.charts?.monthlyActivity || []).map((row) => ({ month: row.name, impact: row.value })));

        const mapPreview = [
          ...(volunteerProfile.coordinates ? [{
            type: 'volunteer',
            name: volunteerProfile.name || 'You',
            label: `Volunteer | ${volunteerProfile.location || 'Unknown'}`,
            lat: volunteerProfile.coordinates?.lat,
            lng: volunteerProfile.coordinates?.lng,
          }] : []),
          ...mappedEvents.map((event) => ({
            type: 'event',
            name: event.title,
            label: `Event | ${event.location}`,
            lat: event.coordinates?.lat,
            lng: event.coordinates?.lng,
          })),
          ...((resourcesRes.data || []).map((resource) => ({
            type: 'resource',
            name: resource.resourceName || resource.name,
            label: `Resource | ${resource.location || 'Unknown'}`,
            lat: resource.coordinates?.lat,
            lng: resource.coordinates?.lng,
          }))),
          ...((disastersRes.data || []).map((disaster) => ({
            type: 'disaster',
            name: disaster.type || 'Disaster',
            label: `Disaster | ${disaster.location || 'Unknown'}`,
            lat: disaster.coordinates?.lat,
            lng: disaster.coordinates?.lng,
          }))),
        ].filter((point) => point.lat && point.lng);
        setMapPoints(mapPreview);
      })
      .catch(() => {
        setEvents([]);
        setMyEvents([]);
        setTasks([]);
        setTimeline([]);
        setChatMessages([]);
        setNotifications([]);
        setLeaderboard([]);
      });
  }, []);

  const updateDutyStatus = (nextValue) => {
    if (!user?.id && !user?._id) return;

    const volunteerId = user?.id || user?._id;
    const fallbackCoordinates = mapPoints.find((point) => point.type === 'volunteer');

    api
      .put(`/volunteers/${volunteerId}/duty`, {
        onDuty: nextValue,
        coordinates: fallbackCoordinates
          ? { lat: fallbackCoordinates.lat, lng: fallbackCoordinates.lng }
          : undefined,
      })
      .then((res) => {
        const updated = Boolean(res.data?.onDuty);
        setOnDuty(updated);
      })
      .catch(() => {
        setOnDuty((prev) => !prev);
      });
  };

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.done).length;
    return [
      { title: 'Events Joined', value: myEvents.length, icon: CalendarDays },
      { title: 'Volunteer Hours', value: hoursData.reduce((sum, row) => sum + row.hours, 0), icon: Clock3 },
      { title: 'Impact Score', value: 920 + completedTasks * 12, icon: Target },
      { title: 'Upcoming Events', value: events.filter((event) => event.status !== 'Completed').length, icon: Star },
      { title: 'Available Events', value: events.length, icon: Lightbulb },
    ];
  }, [myEvents.length, tasks, events, hoursData]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task
      )
    );
  };

  const sendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    api
      .post('/messages', {
        title: 'Volunteer reply',
        body: trimmed,
        priority: 'normal',
        sendTo: 'all',
      })
      .then((res) => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: res.data?.id || `c-${Date.now()}`,
            sender: 'Volunteer',
            text: trimmed,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setChatInput('');
      })
      .catch(() => {
        setChatInput('');
      });
  };

  const parseCsv = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = Array.isArray(result.data) ? result.data.slice(0, 20) : [];
        setCsvRows(rows);
      },
    });
  };

  const importCsvData = () => {
    if (!csvRows.length) return;
    const csvText = [
      Object.keys(csvRows[0]).join(','),
      ...csvRows.map((row) =>
        Object.keys(csvRows[0])
          .map((key) => String(row[key] ?? '').replaceAll(',', ' '))
          .join(',')
      ),
    ].join('\n');

    const formData = new FormData();
    formData.append('csv', csvText);

    api
      .post('/upload/csv', formData)
      .then(() => {
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            type: 'CSV import',
            text: `Imported ${csvRows.length} rows and synced dashboard data.`,
            time: 'Just now',
          },
          ...prev,
        ]);
      })
      .catch(() => {
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            type: 'CSV import failed',
            text: 'CSV import failed. Please retry from admin upload panel.',
            time: 'Just now',
          },
          ...prev,
        ]);
      });
  };

  return (
    <section className="space-y-6 pb-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="particle-bg overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/70 p-5 shadow-[0_25px_60px_-40px_color-mix(in_srgb,var(--primary)_60%,transparent)] backdrop-blur-xl md:p-6"
      >
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">HelpHive AI for Volunteers</p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">Welcome, {user?.name || 'Volunteer'}.</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              Coordinate faster, respond smarter, and track every impact point with one premium volunteer command center.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-4 py-3 text-right">
            <p className="text-xs text-[var(--text-muted)]">Current Mission Focus</p>
            <p className="font-semibold text-[var(--text-primary)]">Flood Response and Resource Routing</p>
            <button
              type="button"
              onClick={() => {
                const next = !onDuty;
                setOnDuty(next);
                updateDutyStatus(next);
              }}
              className={`mt-3 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                onDuty
                  ? 'bg-emerald-500/20 text-emerald-200'
                  : 'bg-slate-500/20 text-slate-200'
              }`}
            >
              {onDuty ? 'ON DUTY' : 'OFF DUTY'}
            </button>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.07 }}
            className="group rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/75 p-4 backdrop-blur-xl"
            whileHover={{ y: -6, scale: 1.01 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <item.icon className="h-5 w-5 text-[var(--text-secondary)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
              <span className="text-xs text-[var(--text-muted)]">Live</span>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.title}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
              <CountUp value={item.value} duration={1.25 + index * 0.08} />
              {item.title === 'Volunteer Hours' ? 'h' : ''}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4 xl:col-span-2"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Clock3 className="h-5 w-5" />Volunteer Hours Chart</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hoursData}>
                <defs>
                  <linearGradient id="vhFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border-muted)', backgroundColor: 'var(--bg-elevated)' }} />
                <Area type="monotone" dataKey="hours" stroke="#34d399" strokeWidth={2.4} fill="url(#vhFill)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Target className="h-5 w-5" />Monthly Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border-muted)', backgroundColor: 'var(--bg-elevated)' }} />
                <Line type="monotone" dataKey="impact" stroke="#818cf8" strokeWidth={2.8} dot={{ r: 3 }} animationDuration={1100} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4 xl:col-span-3"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><CalendarDays className="h-5 w-5" />Events Participation Graph</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border-muted)', backgroundColor: 'var(--bg-elevated)' }} />
                <Bar dataKey="attended" fill="#f59e0b" radius={[8, 8, 0, 0]} animationDuration={900} />
                <Bar dataKey="total" fill="#6366f1" fillOpacity={0.35} radius={[8, 8, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><CalendarDays className="h-5 w-5" />Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -3, scale: 1.01 }}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{event.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{event.location} | {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-xs text-[var(--text-muted)]">Required volunteers: {event.requiredVolunteers}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200">Join Event</button>
                    <button type="button" className="rounded-lg border border-[var(--border-muted)] px-3 py-1.5 text-xs font-semibold">View Details</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><MapPinned className="h-5 w-5" />Map Preview</h2>
          <MapContainer points={mapPoints} heightClass="h-80" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)] sm:grid-cols-4">
            <p className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-2 py-1">Blue: Volunteer</p>
            <p className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-2 py-1">Orange: Event</p>
            <p className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-2 py-1">Red: Disaster</p>
            <p className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-2 py-1">Green: Resource</p>
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Crown className="h-5 w-5" />Leaderboard</h2>
          <div className="space-y-2">
            {leaderboard.map((row) => (
              <motion.div
                key={row.id}
                whileHover={{ x: 3 }}
                className="grid grid-cols-[auto,1fr,auto] items-center gap-3 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)]">
                  {row.rank === 1 ? <Crown className="h-4 w-4" /> : <Medal className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">#{row.rank} {row.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{row.badge} | {row.events} events | {row.hours}h | {row.tasks} tasks</p>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Top {row.rank}</span>
              </motion.div>
            ))}
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Sparkles className="h-5 w-5" />AI Insights Panel</h2>
          <div className="space-y-3">
            {aiCards.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ y: -2, boxShadow: '0 0 0 1px var(--active-outline), 0 0 24px var(--active-glow)' }}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3"
              >
                <div className="mb-1 flex items-center gap-2">
                  <card.icon className="h-4 w-4" />
                  <p className="text-sm font-semibold">{card.title}</p>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><CalendarDays className="h-5 w-5" />My Events</h2>
          <div className="space-y-2">
            {myEvents.map((event) => (
              <div key={event.id} className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-[var(--text-muted)]">Role: {event.role} | {new Date(event.date).toLocaleDateString()}</p>
                <span className={`mt-2 inline-flex rounded-lg px-2 py-1 text-xs ${statusClass(event.status)}`}>{event.status}</span>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><CheckCircle2 className="h-5 w-5" />Assigned Tasks</h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{task.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{task.event} | Due {new Date(task.deadline).toLocaleDateString()}</p>
                    <span className={`mt-2 inline-flex rounded-lg px-2 py-1 text-xs ${priorityClass(task.priority)}`}>{task.priority}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`rounded-lg px-2 py-1 text-xs font-medium ${task.done ? 'bg-emerald-500/20 text-emerald-200' : 'bg-indigo-500/20 text-indigo-200'}`}
                  >
                    {task.done ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Clock3 className="h-5 w-5" />Activity Timeline</h2>
          <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
            {timeline.map((item) => (
              <div key={item.id} className="relative pl-6 before:absolute before:left-[10px] before:top-5 before:h-[calc(100%-14px)] before:w-[2px] before:bg-[var(--border-muted)] last:before:hidden">
                <span className="timeline-dot-pulse absolute left-0 top-1 inline-block h-5 w-5 rounded-full bg-emerald-500" />
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{item.detail}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.timestamp}</p>
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><MessageSquare className="h-5 w-5" />Messages (Chatbot)</h2>
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl px-3 py-2 text-sm ${msg.sender === 'Admin' ? 'bg-indigo-500/20 text-indigo-50' : 'bg-emerald-500/20 text-emerald-50'}`}
                >
                  <p className="mb-1 text-xs font-semibold">{msg.sender}</p>
                  <p>{msg.text}</p>
                  <p className="mt-1 text-[10px] opacity-80">{msg.time}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message"
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none"
              />
              <button type="button" onClick={sendMessage} className="rounded-lg bg-indigo-500/20 px-3 py-2 text-indigo-100">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Bell className="h-5 w-5" />Notifications</h2>
          <div className="space-y-2">
            {notifications.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3"
              >
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">{note.type}</p>
                <p className="text-sm">{note.text}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{note.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Upload className="h-5 w-5" />CSV Upload</h2>
          <div className="rounded-xl border border-dashed border-[var(--border-muted)] bg-[var(--card-elevated)] p-4">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] px-3 py-2 text-sm">
              <Upload className="h-4 w-4" />
              Upload CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) parseCsv(file);
                }}
              />
            </label>

            {csvRows.length ? (
              <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--border-muted)]">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-[var(--surface-soft)]/80">
                    <tr>
                      {Object.keys(csvRows[0]).slice(0, 5).map((header) => (
                        <th key={header} className="px-2 py-1.5 font-semibold">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.slice(0, 6).map((row, idx) => (
                      <tr key={`row-${idx}`} className="border-t border-[var(--border-muted)]">
                        {Object.keys(csvRows[0]).slice(0, 5).map((header) => (
                          <td key={`${header}-${idx}`} className="px-2 py-1.5">{String(row[header] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <button
              type="button"
              onClick={importCsvData}
              className="mt-3 rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-100"
            >
              Import and Update Dashboard
            </button>
          </div>
        </motion.article>

        <motion.article
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><User className="h-5 w-5" />Profile</h2>
          <div className="space-y-3 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
            <p className="text-sm"><span className="font-semibold">Name:</span> {user?.name || 'Volunteer User'}</p>
            <p className="text-sm"><span className="font-semibold">Skills:</span> Medical support, logistics, coordination</p>
            <p className="text-sm"><span className="font-semibold">Events joined:</span> {myEvents.length}</p>
            <p className="text-sm"><span className="font-semibold">Volunteer hours:</span> {hoursData.reduce((sum, row) => sum + row.hours, 0)}h</p>
            <p className="text-sm"><span className="font-semibold">Impact score:</span> {900 + tasks.filter((t) => t.done).length * 15}</p>
          </div>
          <div className="mt-3 h-36 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ACTIVITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Line type="monotone" dataKey="impact" stroke="#34d399" strokeWidth={2} dot={false} animationDuration={900} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      </section>

      <motion.section
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-4"
      >
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Bot className="h-5 w-5" />Settings</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
            <p className="text-sm font-semibold">Profile update</p>
            <p className="text-xs text-[var(--text-secondary)]">Edit contact details, bio, and volunteer specialties.</p>
          </div>
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
            <p className="text-sm font-semibold">Notification preferences</p>
            <p className="text-xs text-[var(--text-secondary)]">Choose which alerts should trigger push and email updates.</p>
          </div>
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
            <p className="text-sm font-semibold">Theme selection</p>
            <p className="text-xs text-[var(--text-secondary)]">Switch visual modes based on mission conditions and time.</p>
          </div>
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3">
            <p className="text-sm font-semibold">Privacy settings</p>
            <p className="text-xs text-[var(--text-secondary)]">Control profile visibility, location sharing, and data retention.</p>
          </div>
        </div>
      </motion.section>
    </section>
  );
};

export default VolunteerDashboardPage;
