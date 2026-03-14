import { Link } from 'react-router-dom';
import AnimatedLogo from '../common/AnimatedLogo';
import { useLanguage } from '../../contexts/LanguageProvider';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-secondary border-t border-black/5 dark:border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex cursor-pointer transition-transform hover:scale-[1.02]">
              <AnimatedLogo className="h-10 w-10" />
              <span className="font-outfit text-xl font-bold tracking-tight text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                Help<span className="text-gradient">Hive</span>
              </span>
            </Link>
            <p className="text-text-tertiary max-w-xs leading-relaxed font-medium">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="font-outfit font-bold text-text-primary mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="group/link relative cursor-pointer text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium inline-block">
                  {t('footer.features')}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent-primary transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="group/link relative cursor-pointer text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium inline-block">
                  {t('footer.howItWorks')}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent-primary transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
              <li>
                <Link to="/login" className="group/link relative cursor-pointer text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium inline-block">
                  {t('footer.login')}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent-primary transition-all duration-300 group-hover/link:w-full" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-outfit font-bold text-text-primary mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="group/link relative cursor-pointer text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium inline-block">
                  {t('footer.privacy')}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent-primary transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
              <li>
                <a href="#" className="group/link relative cursor-pointer text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium inline-block">
                  {t('footer.terms')}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-accent-primary transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-tertiary text-sm font-medium">
            © {currentYear} HelpHive. {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4 text-sm text-text-tertiary font-medium">
            {t('footer.impact')}
          </div>
        </div>
      </div>
    </footer>
  );
}
