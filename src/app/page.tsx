import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import ArcadeSection from './components/ArcadeSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import CursorFollower from './components/CursorFollower';
import ScrollReset from './components/ScrollReset';

export default function Page() {
  return (
    <main className="relative">
      <ScrollReset />
      <CursorFollower />
      <Header />
      <HeroSection />
      <StatsSection />
      <ArcadeSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
