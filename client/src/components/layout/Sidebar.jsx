import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Compass,
  FileUp,
  Gauge,
  History,
  Lightbulb,
  LogOut,
  Medal,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedLogo from '../common/AnimatedLogo';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: Gauge },
  { to: '/volunteers', label: 'Volunteers', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/resources', label: 'Resources', icon: Package },
  { to: '/map-tracking', label: 'Map Tracking', icon: Compass },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/csv-upload', label: 'CSV Upload', icon: FileUp },
  { to: '/activity-log', label: 'Activity Log', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const volunteerLinks = [
  { to: '/volunteer', label: 'Dashboard', icon: Gauge },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/my-events', label: 'My Events', icon: CalendarDays },
  { to: '/assigned-tasks', label: 'Assigned Tasks', icon: Lightbulb },
  { to: '/map-tracking', label: 'Map Tracking', icon: Compass },
  { to: '/leaderboard', label: 'Leaderboard', icon: Medal },
  { to: '/ai', label: 'AI Insights', icon: Lightbulb },
  { to: '/volunteer-notifications', label: 'Notifications', icon: MessageSquare },
  { to: '/chatbot', label: 'Messages', icon: MessageSquare },
  { to: '/volunteer-csv', label: 'CSV Upload', icon: FileUp },
  { to: '/volunteer-activity', label: 'Activity Log', icon: History },
  { to: '/profile', label: 'Profile', icon: CircleUserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 88 },
};

const SidebarContent = ({ collapsed, onToggleCollapse, onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : volunteerLinks;

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <AnimatedLogo className="h-9 w-9" />
          {!collapsed && <p className="font-['Sora'] text-lg font-semibold tracking-tight">Help<span style={{ background: 'linear-gradient(135deg, #3a916d, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hive</span></p>}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden cursor-pointer rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] p-1.5 text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] lg:block"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--active-bg)] text-[var(--active-text)] shadow-[0_0_0_1px_var(--active-outline),0_0_28px_var(--active-glow)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="shrink-0"
            >
              <item.icon className="h-4 w-4" />
            </motion.div>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-4 border-t border-[var(--border-muted)] pt-3">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-400/80 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400"
        >
          <motion.div
            whileHover={{ scale: 1.15, x: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </motion.div>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Mission Pulse Card */}
      <div className="mt-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-3 text-xs text-[var(--text-secondary)]">
        {!collapsed ? (
          <>
            <p className="mb-1 text-sm font-semibold text-[var(--text-primary)]">Mission Pulse</p>
            <p>27 active drives coordinated this week.</p>
          </>
        ) : (
          <Menu className="mx-auto h-4 w-4" />
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ collapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => (
  <>
    <motion.aside
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.26, ease: 'easeInOut' }}
      className="relative hidden min-h-screen flex-col border-r border-[var(--border-muted)] bg-[var(--bg-elevated)] px-3 py-4 xl:flex"
    >
      <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </motion.aside>

    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-slate-950/50 xl:hidden"
          />

          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[var(--border-muted)] bg-[var(--bg-elevated)] p-4 xl:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AnimatedLogo className="h-9 w-9" />
                <p className="font-['Sora'] text-lg font-semibold">Help<span style={{ background: 'linear-gradient(135deg, #3a916d, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hive</span></p>
              </div>
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-[var(--border-muted)] p-1.5"
                onClick={onCloseMobile}
                aria-label="Close mobile sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent collapsed={false} onToggleCollapse={onToggleCollapse} onNavigate={onCloseMobile} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
