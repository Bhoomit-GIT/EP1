'use client';

import React, { useState, useEffect } from 'react';
import SmoothScroll from '../components/SmoothScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import EventJourney from '../components/EventJourney';
import dynamic from 'next/dynamic';

const Gallery3D = dynamic(() => import('../components/Gallery3D'), {
  ssr: false,
  loading: () => (
    <div
      id="gallery"
      style={{
        minHeight: '100vh',
        background: '#070709',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  ),
});

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      const galleryEl = document.getElementById('gallery');
      const journeyEl = document.getElementById('journey');
      const servicesEl = document.getElementById('services');
      const aboutEl = document.getElementById('about');

      if (galleryEl && scrollPos >= galleryEl.offsetTop) {
        setActiveSection('gallery');
      } else if (journeyEl && scrollPos >= journeyEl.offsetTop) {
        setActiveSection('journey');
      } else if (servicesEl && scrollPos >= servicesEl.offsetTop) {
        setActiveSection('services');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
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
      target.scrollIntoView({ behavior: 'smooth' });
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
