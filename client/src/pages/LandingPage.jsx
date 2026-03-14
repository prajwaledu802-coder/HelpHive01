import Navbar from '../components/landing/Navbar';
import HeroSlider from '../components/landing/HeroSlider';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import Preloader from '../components/landing/Preloader';
import AboutSection from '../components/landing/AboutSection';
import ContactSection from '../components/landing/ContactSection';
import MouseTrail from '../components/common/MouseTrail';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-primary selection:bg-accent-blue/30" style={{ background: 'var(--page-gradient)' }}>
      <MouseTrail />
      <Preloader />
      <Navbar />
      <HeroSlider />
      
      {/* Pushing the rest of the content down slightly so it flows naturally after the full-screen hero */}
      <div className="relative z-10" style={{ background: 'var(--page-gradient)' }}>
        <AboutSection />
        <Features />
        <HowItWorks />
        <CTASection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;

