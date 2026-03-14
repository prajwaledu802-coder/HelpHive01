import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
} from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-400/25' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-400/25' },
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-400/25' },
};

const MOCK_TASKS = [
  { id: 1, name: 'Set up medical tent at base camp', event: 'Flood Relief Camp — Assam', deadline: 'March 15, 2026', priority: 'high', completed: false },
  { id: 2, name: 'Distribute water bottles — Zone A', event: 'Flood Relief Camp — Assam', deadline: 'March 16, 2026', priority: 'high', completed: false },
  { id: 3, name: 'Prepare food kits for distribution', event: 'Chennai Food Drive 2026', deadline: 'March 20, 2026', priority: 'medium', completed: false },
  { id: 4, name: 'Register new volunteers at venue', event: 'Chennai Food Drive 2026', deadline: 'March 20, 2026', priority: 'medium', completed: false },
  { id: 5, name: 'Complete first aid training module', event: 'General Training', deadline: 'March 18, 2026', priority: 'low', completed: true },
  { id: 6, name: 'Submit incident report for Zone B', event: 'Delhi Clean Air Initiative', deadline: 'March 3, 2026', priority: 'medium', completed: true },
  { id: 7, name: 'Upload volunteer attendance sheet', event: 'Mumbai Blood Donation Drive', deadline: 'Feb 15, 2026', priority: 'low', completed: true },
];

const VolunteerTasksPage = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState('all');

  const toggleComplete = (id) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filtered = filter === 'all' ? tasks :
    filter === 'pending' ? tasks.filter((t) => !t.completed) :
    tasks.filter((t) => t.completed);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <section className="space-y-5 pb-10">
      <PageHeader title="Assigned Tasks" subtitle="Track and complete your assigned volunteer tasks" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl border border-[var(--border-muted)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--text-primary)]">{tasks.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Total Tasks</p>
        </div>
        <div className="glass rounded-xl border border-[var(--border-muted)] p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
          <p className="text-xs text-[var(--text-muted)]">Pending</p>
        </div>
        <div className="glass rounded-xl border border-[var(--border-muted)] p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
          <p className="text-xs text-[var(--text-muted)]">Completed</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[{ value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' }].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              filter === tab.value
                ? 'border-[var(--active-outline)] bg-[var(--active-bg)] text-[var(--active-text)]'
                : 'border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((task, i) => {
            const prio = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className={`glass cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  task.completed ? 'border-[var(--border-muted)] opacity-60' : 'border-[var(--border-muted)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="mt-0.5 shrink-0 cursor-pointer"
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-[var(--text-muted)] transition-colors hover:text-emerald-400" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-semibold ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                      {task.name}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {task.event}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.deadline}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${prio.bg} ${prio.color}`}>
                    <Flag className="mr-0.5 inline h-2.5 w-2.5" />
                    {prio.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!filtered.length && (
          <div className="py-12 text-center">
            <Check className="mx-auto mb-3 h-12 w-12 text-emerald-400/50" />
            <p className="text-sm text-[var(--text-secondary)]">All tasks done! Great work.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VolunteerTasksPage;
