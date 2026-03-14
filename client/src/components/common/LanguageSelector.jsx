import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageProvider';

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition-all duration-200 hover:text-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
          {currentLang.code}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-48 max-h-72 overflow-y-auto rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-[#13201a]/95 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)] backdrop-blur-2xl p-1.5"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                  language === lang.code
                    ? 'bg-accent-primary/10 text-accent-primary font-semibold'
                    : 'text-text-secondary hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-text-primary'
                }`}
              >
                <span className="font-medium">{lang.native}</span>
                <span className="text-xs text-text-tertiary uppercase tracking-wider">
                  {lang.code}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
