import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageProvider';

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-12 md:p-16 rounded-[2.5rem] text-center relative overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="font-outfit text-4xl md:text-5xl font-bold mb-6 text-text-primary leading-tight">
              {t('cta.heading')}
            </h2>
            <p className="text-xl text-text-secondary mb-10 max-w-xl font-medium">
              {t('cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl">
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
                <Link to="/register?role=volunteer" className="btn-primary w-full flex items-center justify-center gap-2 group cursor-pointer">
                  {t('cta.volunteerBtn')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
                <Link to="/login?role=admin" className="w-full flex items-center justify-center gap-2 group rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-text-primary font-semibold hover:bg-black/[0.02] dark:hover:bg-white/[0.08] transition-colors cursor-pointer">
                  {t('cta.adminBtn')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
