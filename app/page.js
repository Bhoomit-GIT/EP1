'use client';

import React, { useState, useEffect } from 'react';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import EventJourney from '../components/EventJourney';
import Gallery3D from '../components/Gallery3D';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const galleryEl = document.getElementById('gallery');
      const journeyEl = document.getElementById('journey');
      const servicesEl = document.getElementById('services');
      const aboutEl = document.getElementById('about');

      const vh = window.innerHeight;

      if (galleryEl && galleryEl.getBoundingClientRect().top <= vh * 0.4) {
        setActiveSection('gallery');
      } else if (journeyEl) {
        const parent = journeyEl.parentElement;
        const rect =
          parent && parent.classList.contains('pin-spacer')
            ? parent.getBoundingClientRect()
            : journeyEl.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom > 80) {
          setActiveSection('journey');
        } else if (servicesEl && servicesEl.getBoundingClientRect().top <= vh * 0.4) {
          setActiveSection('services');
        } else if (aboutEl && aboutEl.getBoundingClientRect().top <= vh * 0.4) {
          setActiveSection('about');
        } else {
          setActiveSection('home');
        }
      } else if (servicesEl && servicesEl.getBoundingClientRect().top <= vh * 0.4) {
        setActiveSection('services');
      } else if (aboutEl && aboutEl.getBoundingClientRect().top <= vh * 0.4) {
        setActiveSection('about');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (target) {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScroll>
      <div className="freestyle-app">
        <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
        <main>
          <Hero />
          <About />
          <Services />
          <EventJourney />
          <Gallery3D />
        </main>
      </div>
    </SmoothScroll>
  );
}
