import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import './styles/index.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Initialize Lenis Smooth Scrolling for luxury Swiss editorial experience
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Track active section on scroll
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        const aboutTop = aboutEl.offsetTop;
        if (scrollPos >= aboutTop) {
          setActiveSection('about');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = (id) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="freestyle-app">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <main>
        <Hero />
        <About />
      </main>
    </div>
  );
}
