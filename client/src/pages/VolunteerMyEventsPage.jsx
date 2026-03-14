import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const MOCK_MY_EVENTS = [
  { id: 1, name: 'Flood Relief Camp — Assam', role: 'Medical Volunteer', date: 'March 15-18, 2026', location: 'Guwahati, Assam', status: 'active', volunteers: 48 },
  { id: 2, name: 'Chennai Food Drive 2026', role: 'Logistics Coordinator', date: 'March 20-22, 2026', location: 'T. Nagar, Chennai', status: 'active', volunteers: 120 },
  { id: 3, name: 'Delhi Clean Air Initiative', role: 'Field Volunteer', date: 'Feb 28 — Mar 2, 2026', location: 'Connaught Place, Delhi', status: 'completed', volunteers: 65 },
  { id: 4, name: 'Mumbai Blood Donation Drive', role: 'Registration Desk', date: 'Feb 14, 2026', location: 'Dadar, Mumbai', status: 'completed', volunteers: 35 },
  { id: 5, name: 'Bangalore Tech for Good', role: 'Workshop Facilitator', date: 'March 25, 2026', location: 'Koramangala, Bangalore', status: 'pending', volunteers: 40 },
  { id: 6, name: 'Rajasthan Water Distribution', role: 'Distribution Team Lead', date: 'April 1-3, 2026', location: 'Jaipur, Rajasthan', status: 'pending', volunteers: 55 },
];

const STATUS_CONFIG = {
  active: { label: 'Active', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/25' },
  completed: { label: 'Completed', className: 'bg-blue-500/15 text-blue-400 border-blue-400/25' },
  pending: { label: 'Pending', className: 'bg-amber-500/15 text-amber-400 border-amber-400/25' },
};

const VolunteerMyEventsPage = () => {
  const grouped = {
    active: MOCK_MY_EVENTS.filter((e) => e.status === 'active'),
    pending: MOCK_MY_EVENTS.filter((e) => e.status === 'pending'),
    completed: MOCK_MY_EVENTS.filter((e) => e.status === 'completed'),
  };

  return (
    <section className="space-y-6 pb-10">
      <PageHeader title="My Events" subtitle="Events you've joined and their current status" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="glass rounded-xl border border-[var(--border-muted)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{grouped[key]?.length || 0}</p>
            <p className="text-xs text-[var(--text-muted)]">{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* Event Groups */}
      {Object.entries(grouped).map(([status, events]) => (
        events.length > 0 && (
          <div key={status}>
            <h3 className="mb-3 font-['Outfit'] text-base font-semibold capitalize text-[var(--text-primary)]">
              {STATUS_CONFIG[status].label} Events
            </h3>
            <div className="space-y-3">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                  className="glass cursor-pointer rounded-xl border border-[var(--border-muted)] p-4 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)]">{event.name}</h4>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.role}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {event.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{event.volunteers} volunteers</p>
                    </div>
                    <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium ${STATUS_CONFIG[status].className}`}>
                      {STATUS_CONFIG[status].label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      ))}
    </section>
  );
};

export default VolunteerMyEventsPage;
