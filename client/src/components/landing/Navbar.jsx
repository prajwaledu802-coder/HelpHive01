import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from '../common/AnimatedLogo';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSelector from '../common/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageProvider';

/* ── Magnetic Nav Link ────────────────────────────────
   On hover, the link text gets a magnetic pull toward
   the cursor plus a spotlight glow behind it.
   ──────────────────────────────────────────────────── */
function MagneticNavLink({ href, children, onClick }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.35;
    setOffset({ x: dx, y: dy });
  }, []);

  const reset = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setHovering(false);
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className="group relative cursor-pointer rounded-xl px-4 py-2 text-[0.88rem] font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
      style={{ display: 'inline-block' }}
    >
      {/* Spotlight glow behind on hover */}
      <span
        className="absolute inset-0 rounded-xl transition-all duration-300 ease-out"
        style={{
          background: hovering
            ? 'radial-gradient(circle at 50% 50%, rgba(75,184,138,0.12) 0%, transparent 70%)'
            : 'transparent',
          transform: hovering ? `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px)` : 'none',
        }}
      />

      {/* Text with magnetic pull */}
      <span
        className="relative z-10 block transition-transform duration-200 ease-out"
        style={{
          transform: hovering ? `translate(${offset.x}px, ${offset.y}px)` : 'none',
        }}
      >
        {children}
      </span>

      {/* Animated underline */}
      <span
        className="absolute bottom-0.5 left-1/2 h-[2px] rounded-full transition-all duration-300 ease-out"
        style={{
          width: hovering ? '60%' : '0%',
          transform: `translateX(-50%) translateX(${hovering ? offset.x * 0.5 : 0}px)`,
          background: 'linear-gradient(90deg, #FF9933, #138808)',
          opacity: hovering ? 1 : 0,
        }}
      />
    </a>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.howItWorks'), href: '#how-it-works' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-3 py-3 md:px-5"
    >
      <nav
        className={[
          'mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl px-5 py-2.5 md:px-8 md:py-3.5 transition-all duration-300 ease-out',
          isScrolled
            ? 'bg-white/72 dark:bg-[#13201a]/80 border border-black/[0.06] dark:border-white/[0.06] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.10)] backdrop-blur-2xl'
            : 'bg-white/50 dark:bg-[#0c1410]/50 border border-transparent shadow-none backdrop-blur-lg',
        ].join(' ')}
      >
        {/* Logo */}
        <Link to="/" className="group flex cursor-pointer items-center gap-2.5">
          <AnimatedLogo className="h-10 w-10 md:h-11 md:w-11" />
          <span className="font-outfit text-xl md:text-2xl font-bold tracking-tight text-text-primary transition-colors duration-300">
            Help<span className="text-gradient">Hive</span>
          </span>
        </Link>

        {/* Desktop Links — wider gap, magnetic hover */}
        <div className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <MagneticNavLink key={link.name} href={link.href}>
              {link.name}
            </MagneticNavLink>
          ))}
        </div>

        {/* Controls — better spaced */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSelector />
          <ThemeToggle />

          {/* Login button with border glow on hover */}
          <Link
            to="/login?role=admin"
            className="group/login relative cursor-pointer overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold text-text-secondary border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/5 transition-all duration-250 hover:text-text-primary hover:border-accent-primary/40 dark:hover:border-accent-primary/40 hover:shadow-[0_0_16px_-4px_rgba(75,184,138,0.3)]"
          >
            <span className="relative z-10">{t('nav.login')}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-accent-primary/0 via-accent-primary/5 to-accent-primary/0 translate-x-[-100%] group-hover/login:translate-x-[100%] transition-transform duration-600" />
          </Link>

          {/* Get Started CTA with shimmer */}
          <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register?role=volunteer"
              className="group/btn relative cursor-pointer flex items-center gap-1.5 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #3a916d 0%, #2d8659 50%, #1a6b42 100%)',
                boxShadow: '0 4px 16px -4px rgba(58,145,109,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">{t('nav.getStarted')}</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer rounded-xl p-2.5 text-text-secondary transition-all duration-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-text-primary"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-3 right-3 top-[calc(100%+0.25rem)] origin-top flex flex-col gap-1 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-white/92 dark:bg-[#13201a]/95 p-3 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)] backdrop-blur-2xl lg:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="cursor-pointer rounded-xl px-4 py-3 text-[0.95rem] font-medium text-text-secondary transition-all duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-text-primary hover:pl-6"
              >
                {link.name}
              </motion.a>
            ))}
            <div className="my-1.5 h-px w-full bg-black/[0.06] dark:bg-white/[0.06]" />
            <div className="flex flex-col gap-2 px-1 pb-1">
              <Link
                to="/login?role=admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer rounded-xl px-4 py-2.5 text-center text-[0.95rem] font-semibold text-text-primary border border-black/[0.08] dark:border-white/[0.08] transition-all duration-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register?role=volunteer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer rounded-xl px-4 py-2.5 text-center text-[0.95rem] font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3a916d 0%, #2d8659 50%, #1a6b42 100%)',
                  boxShadow: '0 4px 12px -4px rgba(58,145,109,0.4)',
                }}
              >
                {t('nav.getStarted')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
