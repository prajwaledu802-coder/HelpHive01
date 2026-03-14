import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedLogo({ className = 'w-10 h-10' }) {
  return (
    <motion.div
      className={`relative flex items-center justify-center cursor-pointer ${className}`}
      whileHover="hover"
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={{
          hover: { scale: 1.08, filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 128, 0.3))' },
        }}
        transition={{ duration: 0.3 }}
      >
        <defs>
          <linearGradient id="logo-saffron" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
          <linearGradient id="logo-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#138808" />
            <stop offset="100%" stopColor="#0B8043" />
          </linearGradient>
        </defs>

        {/* Saffron Ribbon (top) */}
        <path
          d="M 15 50 A 35 35 0 0 1 85 50 A 35 20 0 0 0 15 50 Z"
          fill="url(#logo-saffron)"
        />

        {/* Green Ribbon (bottom) */}
        <path
          d="M 85 50 A 35 35 0 0 1 15 50 A 35 20 0 0 0 85 50 Z"
          fill="url(#logo-green)"
        />

        {/* White circle behind Ashoka Chakra for contrast */}
        <circle cx="50" cy="50" r="15" fill="white" />

        {/* Ashoka Chakra — FIXED position, no rotation */}
        <g>
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
        </g>
      </motion.svg>
    </motion.div>
  );
}
