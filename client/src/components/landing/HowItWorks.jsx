import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { UserPlus, PackageSearch, CalendarCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageProvider';

const steps = [
  {
    id: 'step-1',
    titleKey: 'howItWorks.step1Title',
    descKey: 'howItWorks.step1Desc',
    Icon: UserPlus,
    gradient: 'linear-gradient(135deg, #00F0FF, #0080FF)',
    shadowColor: 'rgba(0,240,255,0.25)',
    dotColor: '#00F0FF',
  },
  {
    id: 'step-2',
    titleKey: 'howItWorks.step2Title',
    descKey: 'howItWorks.step2Desc',
    Icon: PackageSearch,
    gradient: 'linear-gradient(135deg, #0080FF, #8A2BE2)',
    shadowColor: 'rgba(0,128,255,0.25)',
    dotColor: '#0080FF',
  },
  {
    id: 'step-3',
    titleKey: 'howItWorks.step3Title',
    descKey: 'howItWorks.step3Desc',
    Icon: CalendarCheck,
    gradient: 'linear-gradient(135deg, #8A2BE2, #FF00FF)',
    shadowColor: 'rgba(138,43,226,0.25)',
    dotColor: '#8A2BE2',
  },
];

/* ── Animation Variants ─────────────────────────── */

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: (isEven) => ({
    opacity: 0,
    x: isEven ? -50 : 50,
    y: 20,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 16, mass: 0.9 },
  },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.15 },
  },
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ── SVG Snake Path ──────────────────────────────── */

// This SVG snake path weaves left-right-left between cards (S-curve / serpentine)
const SNAKE_PATH = `M 50 0 C 50 80, 90 100, 90 150 S 10 220, 10 300 S 90 380, 90 450 S 50 520, 50 550`;

const SnakePath = ({ pathLength, prefersReducedMotion }) => {
  if (prefersReducedMotion) return null;

  return (
    <svg
      className="absolute left-1/2 top-0 -translate-x-1/2 w-[120px] h-full z-0 pointer-events-none hidden md:block"
      viewBox="0 0 100 550"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Background track */}
      <path
        d={SNAKE_PATH}
        stroke="rgba(138,43,226,0.08)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Animated gradient fill */}
      <defs>
        <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#FF00FF" />
        </linearGradient>
        <filter id="snakeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={SNAKE_PATH}
        stroke="url(#snakeGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        filter="url(#snakeGlow)"
        style={{ pathLength }}
      />
    </svg>
  );
};

/* Mobile straight line fallback */
const MobileLine = ({ pathLength, prefersReducedMotion }) => {
  if (prefersReducedMotion) return null;

  return (
    <div className="absolute left-[18px] top-0 bottom-0 w-[3px] z-0 md:hidden">
      <div className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06]" />
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top rounded-full"
        style={{
          scaleY: pathLength,
          height: '100%',
          background: 'linear-gradient(180deg, #00F0FF, #8A2BE2, #FF00FF)',
          boxShadow: '0 0 8px rgba(138,43,226,0.3)',
        }}
      />
    </div>
  );
};

/* ── Step Card ──────────────────────────────────── */

const StepCard = ({ step, index }) => {
  const isEven = index % 2 === 0;
  const { t } = useLanguage();

  return (
    <li className="relative grid grid-cols-[40px_1fr] md:grid-cols-[1fr_56px_1fr] gap-4 md:gap-0 items-start md:items-center">
      {/* Timeline Dot */}
      <div className="col-start-1 md:col-start-2 row-start-1 flex items-start md:items-center justify-center pt-6 md:pt-0">
        <motion.div
          variants={dotVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="relative w-5 h-5 rounded-full border-[2.5px] z-10"
          style={{
            borderColor: step.dotColor,
            background: 'var(--bg-primary)',
          }}
        >
          <span
            className="absolute inset-[-4px] rounded-full animate-ping opacity-30"
            style={{ background: step.dotColor }}
          />
        </motion.div>
      </div>

      {/* Desktop Spacer */}
      <div
        className={`hidden md:block ${
          isEven ? 'col-start-3 row-start-1' : 'col-start-1 row-start-1'
        }`}
      />

      {/* Card */}
      <motion.div
        custom={isEven}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className={`col-start-2 md:row-start-1 ${
          isEven ? 'md:col-start-1 md:text-right' : 'md:col-start-3 md:text-left'
        }`}
      >
        <div
          className={`group relative flex flex-col md:flex-row items-start gap-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 md:p-7 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
            isEven ? 'md:flex-row-reverse' : ''
          }`}
          style={{ '--card-shadow': step.shadowColor }}
        >
          {/* Icon */}
          <motion.div
            className="relative shrink-0"
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <div
              className="p-4 rounded-2xl relative z-10 shadow-md"
              style={{ background: step.gradient }}
            >
              <step.Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
              style={{ background: step.gradient }}
            />
          </motion.div>

          {/* Text */}
          <motion.div variants={textContainerVariants} className="flex-1 pt-0.5">
            <motion.div
              variants={textItemVariants}
              className="inline-flex items-center gap-2 mb-2"
            >
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: step.dotColor }}
              >
                Step {index + 1}
              </span>
            </motion.div>
            <motion.h3
              variants={textItemVariants}
              className="font-outfit text-xl md:text-2xl font-bold text-text-primary mb-2"
            >
              {t(step.titleKey)}
            </motion.h3>
            <motion.p variants={textItemVariants} className="text-text-secondary text-base leading-relaxed">
              {t(step.descKey)}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </li>
  );
};

/* ── HowItWorks Section ─────────────────────────── */

export default function HowItWorks() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      ref={containerRef}
      className="relative py-24 md:py-36 bg-bg-primary overflow-hidden"
    >
      {/* Parallax Background Radial */}
      {!prefersReducedMotion && (
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(0,240,255,0.06) 0%, rgba(138,43,226,0.06) 50%, rgba(255,0,255,0.04) 100%)',
          }}
        />
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <header className="text-center mb-16 md:mb-24">
          <motion.h2
            id="how-it-works-title"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="font-outfit text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight"
          >
            {t('howItWorks.title')} <span className="text-gradient">{t('howItWorks.brandName')}</span> {t('howItWorks.titleEnd')}
          </motion.h2>
        </header>

        {/* Timeline container */}
        <div className="relative">
          {/* Snake SVG Path (Desktop) */}
          <SnakePath pathLength={pathLength} prefersReducedMotion={prefersReducedMotion} />

          {/* Mobile fallback straight line */}
          <MobileLine pathLength={pathLength} prefersReducedMotion={prefersReducedMotion} />

          {/* Steps */}
          <ol role="list" className="relative space-y-10 md:space-y-20 py-8">
            {steps.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
