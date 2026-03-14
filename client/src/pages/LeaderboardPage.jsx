import { Award, Crown, Medal, Star, Trophy, TrendingUp, Clock, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const MOCK_LEADERS = [
  { _id: '1', name: 'Ananya Gupta', eventsJoined: 34, hoursContributed: 420, impactScore: 95, tasksCompleted: 78, location: 'Delhi', skill: 'Medical' },
  { _id: '2', name: 'Vikram Singh', eventsJoined: 28, hoursContributed: 380, impactScore: 88, tasksCompleted: 65, location: 'Mumbai', skill: 'Logistics' },
  { _id: '3', name: 'Meera Patel', eventsJoined: 25, hoursContributed: 340, impactScore: 82, tasksCompleted: 58, location: 'Bangalore', skill: 'Teaching' },
  { _id: '4', name: 'Rohit Sharma', eventsJoined: 22, hoursContributed: 290, impactScore: 76, tasksCompleted: 52, location: 'Chennai', skill: 'First Aid' },
  { _id: '5', name: 'Priya Nair', eventsJoined: 20, hoursContributed: 260, impactScore: 71, tasksCompleted: 48, location: 'Hyderabad', skill: 'Communication' },
  { _id: '6', name: 'Arjun Reddy', eventsJoined: 18, hoursContributed: 230, impactScore: 65, tasksCompleted: 42, location: 'Kolkata', skill: 'Counseling' },
  { _id: '7', name: 'Kavita Devi', eventsJoined: 16, hoursContributed: 200, impactScore: 60, tasksCompleted: 38, location: 'Jaipur', skill: 'Driving' },
  { _id: '8', name: 'Suresh Kumar', eventsJoined: 14, hoursContributed: 180, impactScore: 55, tasksCompleted: 34, location: 'Pune', skill: 'Cooking' },
];

const PODIUM_CONFIG = [
  { position: 2, badge: '🥈', label: 'Silver', gradient: 'from-slate-300 to-slate-400', ring: 'ring-slate-300/40', height: 'h-28', order: 'order-1' },
  { position: 1, badge: '🥇', label: 'Gold', gradient: 'from-amber-400 to-yellow-500', ring: 'ring-amber-400/50', height: 'h-36', order: 'order-2' },
  { position: 3, badge: '🥉', label: 'Bronze', gradient: 'from-orange-400 to-amber-600', ring: 'ring-orange-400/40', height: 'h-24', order: 'order-3' },
];

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/leaderboard')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setLeaders(data.length > 0 ? data : MOCK_LEADERS);
      })
      .catch(() => {
        setLeaders(MOCK_LEADERS);
      });
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <section className="space-y-6 pb-10">
      <PageHeader
        title="Leaderboard"
        subtitle="Gamified ranking by impact score, volunteer hours, and events attended"
      />
      {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl border border-[var(--border-muted)] p-6 md:p-8"
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="font-['Outfit'] text-xl font-bold">Top Volunteers</h3>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center gap-4 md:gap-8">
            {PODIUM_CONFIG.map((cfg) => {
              const volunteer = top3[cfg.position - 1];
              if (!volunteer) return null;
              return (
                <motion.div
                  key={cfg.position}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: cfg.position * 0.15, duration: 0.5 }}
                  className={`flex flex-col items-center ${cfg.order}`}
                >
                  {/* Crown for #1 */}
                  {cfg.position === 1 && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Crown className="mb-1 h-6 w-6 text-amber-400" />
                    </motion.div>
                  )}

                  {/* Avatar */}
                  <div className={`relative mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${cfg.gradient} ring-4 ${cfg.ring} md:h-20 md:w-20`}>
                    <span className="text-xl font-bold text-white md:text-2xl">
                      {volunteer.name?.charAt(0) || '?'}
                    </span>
                    <span className="absolute -bottom-1 -right-1 text-xl">{cfg.badge}</span>
                  </div>

                  {/* Name */}
                  <p className="mt-1 text-center text-sm font-semibold text-[var(--text-primary)] md:text-base">
                    {volunteer.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{volunteer.location || volunteer.skill}</p>

                  {/* Podium Block */}
                  <div className={`mt-3 ${cfg.height} w-20 rounded-t-xl bg-gradient-to-b ${cfg.gradient} flex items-center justify-center shadow-lg md:w-28`}>
                    <span className="text-lg font-bold text-white">#{cfg.position}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Top 3 Stats */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {top3.map((v, i) => (
              <motion.div
                key={v._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{v.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-[var(--text-secondary)]">
                  <div>
                    <Clock className="mx-auto mb-0.5 h-3 w-3 text-emerald-400" />
                    <p className="font-bold text-[var(--text-primary)]">{v.hoursContributed}h</p>
                    <p>Hours</p>
                  </div>
                  <div>
                    <CalendarCheck className="mx-auto mb-0.5 h-3 w-3 text-blue-400" />
                    <p className="font-bold text-[var(--text-primary)]">{v.eventsJoined}</p>
                    <p>Events</p>
                  </div>
                  <div>
                    <Star className="mx-auto mb-0.5 h-3 w-3 text-amber-400" />
                    <p className="font-bold text-[var(--text-primary)]">{v.tasksCompleted || v.impactScore}</p>
                    <p>Tasks</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full Rankings */}
      <div className="glass overflow-hidden rounded-xl border border-[var(--border-muted)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-muted)] bg-[var(--card-elevated)]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Rank</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Volunteer</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Events</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Hours</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Impact Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((v, i) => (
                <motion.tr
                  key={v._id || v.volunteerId}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[var(--border-muted)]/50 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <td className="px-4 py-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? 'bg-amber-500/15 text-amber-400' :
                      i === 1 ? 'bg-slate-400/15 text-slate-300' :
                      i === 2 ? 'bg-orange-500/15 text-orange-400' :
                      'text-[var(--text-muted)]'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/80 to-cyan-500/80 text-xs font-bold text-white">
                        {(v.name || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{v.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{v.location || v.skill || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{v.eventsJoined}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{v.hoursContributed}h</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-28 rounded-full bg-[var(--border-muted)]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${v.impactScore}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: i * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{v.impactScore}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPage;
