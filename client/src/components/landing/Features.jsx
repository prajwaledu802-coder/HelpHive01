import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Users, Package, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageProvider';

const features = [
  {
    titleKey: 'features.volunteerTitle',
    descKey: 'features.volunteerDesc',
    icon: Users,
    accentColor: 'rgba(45,212,191,1)',
    accentLight: 'rgba(45,212,191,0.12)',
    accentGlow: 'rgba(45,212,191,0.25)',
  },
  {
    titleKey: 'features.resourceTitle',
    descKey: 'features.resourceDesc',
    icon: Package,
    accentColor: 'rgba(168,85,247,1)',
    accentLight: 'rgba(168,85,247,0.12)',
    accentGlow: 'rgba(168,85,247,0.25)',
  },
  {
    titleKey: 'features.eventTitle',
    descKey: 'features.eventDesc',
    icon: Calendar,
    accentColor: 'rgba(59,130,246,1)',
    accentLight: 'rgba(59,130,246,0.12)',
    accentGlow: 'rgba(59,130,246,0.25)',
  },
];

/* ── Animation Variants ─────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 18, mass: 0.8 },
  },
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

/* ── Features Header (i18n) ─────────────────────────── */

const FeaturesHeader = () => {
  const { t } = useLanguage();
  return (
    <>
      <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary tracking-tight">
        {t('features.heading1')} <br className="hidden md:block" />
        <span className="text-gradient">{t('features.heading2')}</span>
      </h2>
      <p className="text-text-secondary text-lg md:text-xl leading-relaxed">
        {t('features.subtitle')}
      </p>
    </>
  );
};

/* ── 3D Tilt Feature Card ───────────────────────────── */

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;
  const cardRef = useRef(null);
  const { t } = useLanguage();

  // Motion values — all hooks called at the top level (React-safe)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotOpacity = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  const spotXSpring = useSpring(spotX, { stiffness: 200, damping: 25 });
  const spotYSpring = useSpring(spotY, { stiffness: 200, damping: 25 });
  const spotOpacitySpring = useSpring(spotOpacity, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  // Spotlight radial gradient — computed via useTransform, not inline
  const spotlightBg = useTransform(
    [spotXSpring, spotYSpring],
    ([sx, sy]) =>
      `radial-gradient(350px circle at ${sx}px ${sy}px, rgba(255,255,255,0.35), transparent 55%)`,
  );

  const handleMouseMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      mouseX.set(mx / w - 0.5);
      mouseY.set(my / h - 0.5);
      spotX.set(mx);
      spotY.set(my);
      spotOpacity.set(1);
    },
    [mouseX, mouseY, spotX, spotY, spotOpacity],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    spotOpacity.set(0);
  }, [mouseX, mouseY, spotOpacity]);

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col items-center text-center rounded-[1.75rem] border border-black/[0.06] dark:border-white/[0.06] bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8 md:p-10 cursor-pointer transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2"
    >
      {/* Spotlight overlay (follows cursor) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[1.75rem] mix-blend-overlay"
        style={{
          background: spotlightBg,
          opacity: spotOpacitySpring,
        }}
      />

      {/* Ambient glow on hover */}
      <div
        className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
        style={{
          boxShadow: `0 0 40px ${feature.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.6)`,
        }}
      />

      {/* Colored top edge */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${feature.accentColor}, transparent)` }}
      />

      {/* 3D Content wrapper */}
      <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d', width: '100%' }}>
        {/* Icon */}
        <motion.div
          className="mx-auto mb-8 relative z-10 w-max"
          whileHover={{ scale: 1.1, rotate: [0, -4, 4, 0] }}
          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        >
          <div
            className="relative inline-flex p-5 md:p-6 rounded-2xl border border-black/[0.06] overflow-hidden"
            style={{ background: feature.accentLight }}
          >
            <div
              className="absolute inset-0 blur-xl opacity-40"
              style={{ background: feature.accentLight }}
            />
            <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
              <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: feature.accentColor }} />
            </div>
          </div>
          {/* Hover glow behind icon */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[28px] opacity-0 group-hover:opacity-50 transition-opacity duration-500"
            style={{ background: feature.accentGlow }}
          />
        </motion.div>

        {/* Texts */}
        <motion.div
          variants={textContainerVariants}
          className="flex flex-col flex-grow relative z-10"
          style={{ transform: 'translateZ(30px)' }}
        >
          <motion.h3
            variants={textItemVariants}
            className="font-outfit text-2xl md:text-3xl font-bold text-text-primary mb-4"
          >
            {t(feature.titleKey)}
          </motion.h3>
          <motion.p variants={textItemVariants} className="text-text-secondary text-base leading-relaxed">
            {t(feature.descKey)}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ── Features Section ───────────────────────────────── */

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-bg-primary overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Animated scanner lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] w-[200%] -ml-[50%]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(45,212,191,0.5), transparent)',
            boxShadow: '0 0 15px rgba(45,212,191,0.3)',
          }}
        />
        <motion.div
          animate={{ x: ['-100vw', '100vw'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 bottom-0 w-[1px] h-[200%] -mt-[50%]"
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(168,85,247,0.5), transparent)',
            boxShadow: '0 0 15px rgba(168,85,247,0.3)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <FeaturesHeader />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{ perspective: 1200 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.titleKey} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
