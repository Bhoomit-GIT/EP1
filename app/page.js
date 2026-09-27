'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import EventJourney from '../components/EventJourney';
import Gallery3D from '../components/Gallery3D';
import Contact from '../components/Contact';
import Preloader from '../components/Preloader';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const SECTION_IDS = ['home', 'about', 'services', 'journey', 'gallery', 'contact'];

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Clean ScrollTrigger-based scroll spy — pin-aware, no DOM class sniffing
  useEffect(() => {
    const triggers = [];

    const init = () => {
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            id: `spy-${id}`,
            trigger: el,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => {
              if (self.isActive) setActiveSection(id);
            },
          })
        );
      });
    };

    // Let pinned sections measure first, then build the spy triggers
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      init();
    }, 300);

    // Re-measure once webfonts/images settle
    const lateTimer = setTimeout(() => ScrollTrigger.refresh(), 1500);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(lateTimer);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const handleNavigate = (id) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (!target) return;
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SmoothScroll>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      <div className={`freestyle-app ${preloaderDone ? 'is-ready' : 'is-loading'}`}>
        <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
        <main>
          <Hero />
          <About />
          <Services />
          <EventJourney />
          <Gallery3D />
          <Contact />
        </main>
      </div>
    </SmoothScroll>
  );
}
