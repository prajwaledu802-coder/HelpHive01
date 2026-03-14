import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SANSKRIT_TEXT = 'सर्वे सुखिनो भवन्तु';
const ENGLISH_TEXT = 'May All Beings Be Happy';

export default function Preloader() {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'launching' | 'done'

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const launchTimer = setTimeout(() => setPhase('launching'), 3200);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      document.body.style.overflow = '';
    }, 4000);

    return () => {
      clearTimeout(launchTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'done') return null;

  const sanskritChars = SANSKRIT_TEXT.split('');

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(160deg, #0A0F14 0%, #0D1A14 50%, #0A1210 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={phase === 'launching' ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
              style={{ background: 'radial-gradient(circle, #FF9933 0%, transparent 40%, #138808 70%, transparent 100%)' }}
            />
          </div>

          <div className="flex flex-col items-center justify-center relative z-10">
            {/* ── Indian Flag-Style Logo ── */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-10 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0px 0px 20px rgba(255, 153, 51, 0.15)) drop-shadow(0px 0px 20px rgba(19, 136, 8, 0.15))' }}
              >
                <defs>
                  <linearGradient id="preloader-saffron" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF9933" />
                    <stop offset="100%" stopColor="#FF6B00" />
                  </linearGradient>
                  <linearGradient id="preloader-green" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#138808" />
                    <stop offset="100%" stopColor="#0B8043" />
                  </linearGradient>
                </defs>

                {/* Saffron Ribbon (top half) */}
                <motion.path
                  d="M 15 50 A 35 35 0 0 1 85 50 A 35 20 0 0 0 15 50 Z"
                  fill="url(#preloader-saffron)"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />

                {/* Green Ribbon (bottom half) */}
                <motion.path
                  d="M 85 50 A 35 35 0 0 1 15 50 A 35 20 0 0 0 85 50 Z"
                  fill="url(#preloader-green)"
                  initial={{ clipPath: 'inset(0% 0% 0% 100%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.6 }}
                />

                {/* White background circle for Ashoka Chakra visibility */}
                <motion.circle
                  cx="50" cy="50" r="15"
                  fill="white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '50px 50px' }}
                />

                {/* Ashoka Chakra — Navy blue on white background */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 1.3 },
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  }}
                  style={{ originX: '50px', originY: '50px' }}
                >
                  <circle cx="50" cy="50" r="14" stroke="#000080" strokeWidth="1.5" fill="none" />
                  <circle cx="50" cy="50" r="11" stroke="#000080" strokeWidth="0.4" fill="none" />
                  <circle cx="50" cy="50" r="2.5" fill="#000080" />
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line
                      key={i}
                      x1="50" y1="50"
                      x2={50 + 11 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={50 + 11 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="#000080"
                      strokeWidth="0.7"
                    />
                  ))}
                </motion.g>
              </svg>
            </div>

            {/* ── Sanskrit Text — Character-by-character animation ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="mb-3"
            >
              <h2 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-center">
                {sanskritChars.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.4,
                      delay: 1.7 + i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                    style={{
                      color: char === ' ' ? 'transparent' : undefined,
                      background: char !== ' '
                        ? 'linear-gradient(135deg, #FF9933, #FFD699, #FFFFFF, #90EE90, #138808)'
                        : 'none',
                      WebkitBackgroundClip: char !== ' ' ? 'text' : undefined,
                      backgroundClip: char !== ' ' ? 'text' : undefined,
                      WebkitTextFillColor: char !== ' ' ? 'transparent' : undefined,
                      width: char === ' ' ? '0.5em' : undefined,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h2>
            </motion.div>

            {/* ── English Translation ── */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 0.6, delay: 2.6, ease: 'easeOut' }}
              className="text-white/50 text-xs sm:text-sm tracking-[0.25em] uppercase font-medium text-center"
            >
              {ENGLISH_TEXT}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
