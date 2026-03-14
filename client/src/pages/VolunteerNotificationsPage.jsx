import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Award,
  Bell,
  Calendar,
  Check,
  Mail,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const NOTIF_TYPES = {
  event: { icon: Calendar, color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-500/15 text-blue-400' },
  emergency: { icon: AlertTriangle, color: 'from-rose-500 to-red-600', badge: 'bg-rose-500/15 text-rose-400' },
  admin: { icon: Mail, color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500/15 text-emerald-400' },
  leaderboard: { icon: Award, color: 'from-amber-500 to-orange-600', badge: 'bg-amber-500/15 text-amber-400' },
};

const VolunteerNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([api.get('/notifications'), api.get('/messages')])
      .then(([notifRes, msgRes]) => {
        const notifRows = Array.isArray(notifRes.data) ? notifRes.data : [];
        const msgRows = Array.isArray(msgRes.data) ? msgRes.data : [];

        const mappedNotifications = notifRows.map((row) => ({
          id: row.id,
          type: row.type || 'admin',
          title: row.title || 'Notification',
          body: row.message || '',
          time: new Date(row.created_at || Date.now()).toLocaleString(),
          read: Boolean(row.read),
        }));

        const mappedMessages = msgRows.map((row) => ({
          id: `msg-${row.id}`,
          type: row.priority === 'emergency' ? 'emergency' : 'admin',
          title: row.title,
          body: row.body,
          time: new Date(row.created_at || Date.now()).toLocaleString(),
          read: false,
        }));

        setNotifications([...mappedMessages, ...mappedNotifications]);
      })
      .catch(() => {
        setNotifications([]);
      });
  }, []);

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const dismiss = (id) => setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <section className="space-y-5 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Notifications" subtitle="Stay updated with events, alerts, and messages" />
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={markAllRead}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--border-muted)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Check className="h-3.5 w-3.5" /> Mark all read ({unreadCount})
          </motion.button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {[{ value: 'all', label: 'All' }, ...Object.entries(NOTIF_TYPES).map(([k, v]) => ({ value: k, label: k.charAt(0).toUpperCase() + k.slice(1) }))].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`cursor-pointer whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              filter === tab.value
                ? 'border-[var(--active-outline)] bg-[var(--active-bg)] text-[var(--active-text)]'
                : 'border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((notif, i) => {
            const config = NOTIF_TYPES[notif.type] || NOTIF_TYPES.admin;
            const Icon = config.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className={`glass group cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  notif.read ? 'border-[var(--border-muted)]' : 'border-l-2'
                }`}
                style={!notif.read ? { borderLeftColor: notif.type === 'emergency' ? '#ef4444' : '#10b981' } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 rounded-xl bg-gradient-to-br ${config.color} p-2.5 shadow-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[var(--text-primary)]">{notif.title}</h4>
                      {!notif.read && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />}
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{notif.body}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>{notif.type}</span>
                      <span className="text-xs text-[var(--text-muted)]">{notif.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                    className="cursor-pointer rounded-lg p-1.5 text-[var(--text-muted)] opacity-0 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!filtered.length && (
          <div className="py-12 text-center">
            <Bell className="mx-auto mb-3 h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">No notifications.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VolunteerNotificationsPage;
