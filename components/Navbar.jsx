'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'services', label: 'SERVICES' },
  { id: 'journey', label: 'HOSTED EVENTS' },
  { id: 'gallery', label: 'GALLERY' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar({ activeSection, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolledIntoHiddenSection, setIsScrolledIntoHiddenSection] = useState(false);

  useEffect(() => {
    let st;
    const initTrigger = () => {
      const journeyEl = document.getElementById('journey');
      const galleryEl = document.getElementById('gallery');
      if (!journeyEl || !galleryEl) return;

      st = ScrollTrigger.create({
        trigger: journeyEl,
        start: 'top 80px',
        endTrigger: galleryEl,
        end: 'bottom top',
        onEnter: () => setIsScrolledIntoHiddenSection(true),
        onLeave: () => setIsScrolledIntoHiddenSection(false),
        onEnterBack: () => setIsScrolledIntoHiddenSection(true),
        onLeaveBack: () => setIsScrolledIntoHiddenSection(false),
      });
    };

    const timer = setTimeout(initTrigger, 150);
    return () => {
      clearTimeout(timer);
      if (st) st.kill();
    };
  }, []);

  const isHidden =
    isScrolledIntoHiddenSection ||
    activeSection === 'journey' ||
    activeSection === 'gallery';

  const handleNavClick = (id) => {
    onNavigate?.(id);
    setMobileOpen(false);
  };

  return (
    <header className={`site-header ${isHidden ? 'is-hidden' : ''}`} id="mainHeader">
      <div className="header-inner">
        {/* Brand Logo */}
        <a href="#home" className="brand-logo" onClick={() => handleNavClick('home')}>
          <motion.span whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            FREESTYLE
          </motion.span>
        </a>

        {/* Centered Desktop Navigation */}
        <nav className="nav-container" aria-label="Main Navigation">
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="nav-link-item">
                  <a
                    href={`#${item.id}`}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="nav-active-bar"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Group */}
        <div className="header-actions">
          <motion.a
            href="#contact"
            className="btn-pill"
            whileHover={{ y: -2, backgroundColor: '#262626' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span>PLAN AN EVENT</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ArrowRight size={13.5} strokeWidth={2} />
            </motion.span>
          </motion.a>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="mobile-nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="mobile-nav-link"
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="btn-pill"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setMobileOpen(false)}
            >
              PLAN AN EVENT <ArrowRight size={15} style={{ marginLeft: 8 }} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
