import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CalendarPlus,
  Package,
  Shield,
  UserPlus,
  Zap,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const LOG_TYPES = {
  volunteer_joined: { icon: UserPlus, color: 'from-emerald-500 to-teal-500', label: 'Volunteer', dot: 'bg-emerald-400' },
  event_created: { icon: CalendarPlus, color: 'from-blue-500 to-indigo-500', label: 'Event', dot: 'bg-blue-400' },
  resource_updated: { icon: Package, color: 'from-amber-500 to-orange-500', label: 'Resource', dot: 'bg-amber-400' },
  emergency_alert: { icon: AlertTriangle, color: 'from-rose-500 to-red-500', label: 'Emergency', dot: 'bg-rose-400' },
  system: { icon: Shield, color: 'from-purple-500 to-violet-500', label: 'System', dot: 'bg-purple-400' },
};

const MOCK_LOGS = [
  { id: 1, type: 'emergency_alert', title: 'Emergency alert triggered — Assam Floods', desc: 'Severity: Critical. 50+ volunteers dispatched to Guwahati region.', time: '2 min ago', date: 'Today' },
  { id: 2, type: 'volunteer_joined', title: 'Priya Sharma joined the platform', desc: 'Skills: Medical, First Aid. Location: Delhi NCR. Verified via Aadhaar.', time: '15 min ago', date: 'Today' },
  { id: 3, type: 'event_created', title: 'Admin created "Chennai Food Drive 2026"', desc: 'Date: March 20-22. Required: 80 volunteers. Location: T. Nagar, Chennai.', time: '1 hour ago', date: 'Today' },
  { id: 4, type: 'resource_updated', title: 'Medical kits restocked at Delhi DC', desc: '500 medical kits added. New total: 1,240 units. Status: Sufficient.', time: '2 hours ago', date: 'Today' },
  { id: 5, type: 'volunteer_joined', title: 'Rahul Verma joined the platform', desc: 'Skills: Logistics, Driving. Location: Mumbai. Available weekends.', time: '3 hours ago', date: 'Today' },
  { id: 6, type: 'event_created', title: 'Admin created "Bangalore Tech for Good"', desc: 'Date: March 25. Required: 40 volunteers. Theme: Digital literacy workshops.', time: '5 hours ago', date: 'Today' },
  { id: 7, type: 'system', title: 'Weekly analytics report generated', desc: 'Volunteer hours up 23% vs last week. Top region: Karnataka.', time: '6 hours ago', date: 'Today' },
  { id: 8, type: 'resource_updated', title: 'Water supply low at Kolkata center', desc: 'Water bottles: 120 remaining (threshold: 200). Auto-alert sent to coordinators.', time: '8 hours ago', date: 'Today' },
  { id: 9, type: 'emergency_alert', title: 'Heatwave warning — Rajasthan', desc: 'Temperature exceeding 45°C. Water distribution teams activated in Jaipur.', time: '12 hours ago', date: 'Yesterday' },
  { id: 10, type: 'volunteer_joined', title: '12 new volunteers from AIESEC partnership', desc: 'Batch registration from university outreach. Skills: Teaching, Counseling.', time: '1 day ago', date: 'Yesterday' },
  { id: 11, type: 'event_created', title: 'Admin created "Hyderabad Clean City Drive"', desc: 'Date: March 28. Required: 100 volunteers. Partner: GHMC.', time: '1 day ago', date: 'Yesterday' },
  { id: 12, type: 'resource_updated', title: 'Tents inventory updated — Maharashtra', desc: '200 disaster relief tents allocated to Pune warehouse. Distribution ready.', time: '2 days ago', date: '2 days ago' },
];

const ActivityLogPage = () => {
  const grouped = {};
  MOCK_LOGS.forEach((log) => {
    if (!grouped[log.date]) grouped[log.date] = [];
    grouped[log.date].push(log);
  });

  return (
    <section className="space-y-5 pb-10">
      <PageHeader title="Activity Log" subtitle="Timeline of all platform events and actions" />

      {/* Stats Bar */}
      <div className="glass grid grid-cols-2 gap-3 rounded-xl border border-[var(--border-muted)] p-4 md:grid-cols-4">
        {Object.entries(LOG_TYPES).slice(0, 4).map(([key, config]) => {
          const count = MOCK_LOGS.filter((l) => l.type === key).length;
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-3 rounded-xl bg-[var(--card-elevated)] p-3">
              <div className={`rounded-xl bg-gradient-to-br ${config.color} p-2`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--text-primary)]">{count}</p>
                <p className="text-xs text-[var(--text-muted)]">{config.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500/30 via-blue-500/20 to-transparent md:left-[23px]" />

        {Object.entries(grouped).map(([date, logs]) => (
          <div key={date} className="mb-8">
            {/* Date Header */}
            <div className="relative mb-4 flex items-center gap-3 pl-12 md:pl-14">
              <span className="absolute left-[11px] h-[18px] w-[18px] rounded-full border-2 border-[var(--border-muted)] bg-[var(--bg-elevated)] md:left-[15px]" />
              <h3 className="font-['Outfit'] text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">{date}</h3>
            </div>

            {/* Log Items */}
            <div className="space-y-3">
              {logs.map((log, i) => {
                const config = LOG_TYPES[log.type] || LOG_TYPES.system;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
                    className="relative pl-12 md:pl-14"
                  >
                    {/* Timeline dot */}
                    <span className={`absolute left-[14px] top-4 h-[12px] w-[12px] rounded-full ${config.dot} shadow-[0_0_8px_rgba(16,185,129,0.3)] md:left-[18px]`} />

                    <motion.div
                      whileHover={{ y: -2 }}
                      className="glass cursor-pointer rounded-xl border border-[var(--border-muted)] p-4 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`shrink-0 rounded-xl bg-gradient-to-br ${config.color} p-2.5 shadow-lg`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[var(--text-primary)]">{log.title}</h4>
                            {log.type === 'emergency_alert' && (
                              <Zap className="h-3.5 w-3.5 text-rose-400" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">{log.desc}</p>
                          <p className="mt-2 text-xs text-[var(--text-muted)]">{log.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivityLogPage;
