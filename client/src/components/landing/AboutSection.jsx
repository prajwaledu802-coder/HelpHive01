import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageProvider';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative w-full bg-bg-primary py-24 md:py-32 selection:bg-accent-blue/30 overflow-hidden">
      <div className="absolute top-0 right-0 -m-32 h-[500px] w-[500px] rounded-full bg-accent-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -m-32 h-[500px] w-[500px] rounded-full bg-accent-secondary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {t('about.title')} <span className="text-gradient">{t('about.brandName')}</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-8 grid gap-8 md:grid-cols-2 text-left"
          >
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
              className="group rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 p-8 shadow-sm backdrop-blur-xl cursor-pointer transition-all duration-300"
            >
              <h3 className="mb-4 font-outfit text-xl font-bold text-text-primary">{t('about.missionTitle')}</h3>
              <p className="text-lg leading-relaxed text-text-secondary">
                {t('about.missionText')}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
              className="group rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 p-8 shadow-sm backdrop-blur-xl cursor-pointer transition-all duration-300"
            >
              <h3 className="mb-4 font-outfit text-xl font-bold text-text-primary">{t('about.visionTitle')}</h3>
              <p className="text-lg leading-relaxed text-text-secondary">
                {t('about.visionText')}
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
