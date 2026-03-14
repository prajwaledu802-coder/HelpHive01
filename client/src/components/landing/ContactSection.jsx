import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageProvider';

export default function ContactSection() {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.callUs'),
      value: '+91 7019650179',
      href: 'tel:+917019650179',
    },
    {
      icon: Mail,
      title: t('contact.emailUs'),
      value: 'shreyas@gmail.com',
      href: 'mailto:shreyas@gmail.com',
    },
  ];

  return (
    <section id="contact" className="relative w-full bg-bg-secondary py-24 md:py-32 overflow-hidden border-t border-black/5 dark:border-white/5">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {t('contact.title')} <span className="text-gradient">{t('contact.titleHighlight')}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-16 flex flex-wrap justify-center gap-6 w-full max-w-4xl"
          >
            {contactInfo.map((info, idx) => {
              const IconComp = info.icon;
              return (
                <motion.a
                  key={idx}
                  href={info.href}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="group relative flex w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-white/5 p-8 shadow-sm transition-all duration-300 hover:shadow-xl md:w-[calc(50%-1.5rem)]"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-primary/10 transition-transform duration-300 group-hover:scale-110"
                  >
                    <IconComp className="h-6 w-6 text-accent-primary" />
                  </motion.div>
                  <h3 className="mb-2 font-outfit text-xl font-bold text-text-primary">{info.title}</h3>
                  <p className="text-lg font-medium text-text-secondary transition-colors group-hover:text-accent-primary">
                    {info.value}
                  </p>
                </motion.a>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
