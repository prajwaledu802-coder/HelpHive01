import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  Info,
  MessageSquare,
  Send,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const MESSAGE_TYPES = [
  { value: 'normal', label: 'Normal', color: 'from-emerald-500 to-teal-600', icon: Info, badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/25' },
  { value: 'important', label: 'Important', color: 'from-amber-500 to-orange-600', icon: Bell, badge: 'bg-amber-500/15 text-amber-400 border-amber-400/25' },
  { value: 'emergency', label: 'Emergency', color: 'from-rose-500 to-red-600', icon: AlertTriangle, badge: 'bg-rose-500/15 text-rose-400 border-rose-400/25' },
];

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ type: 'normal', title: '', body: '', recipients: 'all' });
  const [error, setError] = useState('');

  const loadMessages = () => {
    api
      .get('/messages')
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setMessages(
          rows.map((row) => ({
            id: row.id,
            type: row.priority || 'normal',
            title: row.title,
            body: row.body,
            time: new Date(row.created_at || Date.now()).toLocaleString(),
            read: false,
          }))
        );
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load messages.'));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.type === filter);

  const handleSend = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    api
      .post('/messages', {
        title: form.title,
        body: form.body,
        priority: form.type,
        sendTo: form.recipients,
      })
      .then(() => {
        setForm({ type: 'normal', title: '', body: '', recipients: 'all' });
        setComposeOpen(false);
        loadMessages();
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to send message.'));
  };

  const handleDelete = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const getTypeConfig = (type) => MESSAGE_TYPES.find((t) => t.value === type) || MESSAGE_TYPES[0];

  return (
    <section className="space-y-5 pb-10">
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Messages" subtitle="Send notifications and alerts to volunteers" />
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setComposeOpen(!composeOpen)}
          className="flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #3a916d, #1a6b42)', boxShadow: '0 4px 16px -4px rgba(58,145,109,0.45)' }}
        >
          <MessageSquare className="h-4 w-4" />
          {composeOpen ? 'Cancel' : 'Compose Message'}
        </motion.button>
      </div>

      {/* Compose Panel */}
      <AnimatePresence>
        {composeOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl border border-[var(--border-muted)] p-5">
              <h3 className="mb-4 font-['Outfit'] text-lg font-semibold">New Message</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Message Type</label>
                  <div className="flex gap-2">
                    {MESSAGE_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setForm({ ...form, type: t.value })}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 ${
                          form.type === t.value
                            ? `${t.badge} border-current`
                            : 'border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <t.icon className="mr-1 inline h-3 w-3" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Recipients</label>
                  <select
                    value={form.recipients}
                    onChange={(e) => setForm({ ...form, recipients: e.target.value })}
                    className="w-full cursor-pointer rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                  >
                    <option value="all">All Volunteers</option>
                    <option value="active">Active Volunteers Only</option>
                    <option value="nearby">Nearby Volunteers</option>
                    <option value="coordinators">Team Coordinators</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Subject</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Message subject..."
                  className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>
              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Message Body</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Users className="h-3 w-3" />
                  Sending to: {form.recipients === 'all' ? '1,247 volunteers' : form.recipients}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSend}
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #3a916d, #1a6b42)' }}
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Message
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {[{ value: 'all', label: 'All' }, ...MESSAGE_TYPES].map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`cursor-pointer whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              filter === t.value
                ? 'border-[var(--active-outline)] bg-[var(--active-bg)] text-[var(--active-text)]'
                : 'border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.label} {t.value !== 'all' && `(${messages.filter((m) => m.type === t.value).length})`}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((msg, i) => {
            const config = getTypeConfig(msg.type);
            const TypeIcon = config.icon;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className={`glass group cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  msg.read ? 'border-[var(--border-muted)]' : 'border-l-2'
                }`}
                style={!msg.read ? { borderLeftColor: msg.type === 'emergency' ? '#ef4444' : msg.type === 'important' ? '#f59e0b' : '#10b981' } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-xl bg-gradient-to-br ${config.color} p-2.5 shadow-lg`}>
                    <TypeIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate font-semibold text-[var(--text-primary)]">{msg.title}</h4>
                      {!msg.read && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />}
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{msg.body}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>{config.label}</span>
                      <span className="text-xs text-[var(--text-muted)]">{msg.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                    className="cursor-pointer rounded-lg p-1.5 text-[var(--text-muted)] opacity-0 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!filtered.length && (
          <div className="py-12 text-center">
            <Shield className="mx-auto mb-3 h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">No messages found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MessagesPage;
