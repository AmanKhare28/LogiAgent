import { useEffect } from 'react';
import { Navbar }          from '../components/landing/Navbar';
import { HeroSection }     from '../components/landing/Hero';
import { StatsBar }        from '../components/landing/Stats';
import { FeaturesSection } from '../components/landing/Features';
import { HowItWorks }      from '../components/landing/HowItWorks';
import { DemoTeaser }      from '../components/landing/DemoTeaser';
import { Footer }          from '../components/landing/Footer';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'LogiAgent — AI Supply Chain Assistant';
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorks />
        <DemoTeaser />
      </main>
      <Footer />
    </>
  );
}
