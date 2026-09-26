'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const centerCardRef = useRef(null);
  const topRightCardRef = useRef(null);
  const badgeRef = useRef(null);

  // Framer Motion 3D interactive tilt for center card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e) => {
    if (!centerCardRef.current) return;
    const rect = centerCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // GSAP Multi-plane Scroll Parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (centerCardRef.current) {
        gsap.to(centerCardRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (topRightCardRef.current) {
        gsap.to(topRightCardRef.current, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          yPercent: -12,
          rotation: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      <div className="bg-shape-arc" aria-hidden="true" />

      <div className="hero-wrapper">
        {/* Left Column: Typographic & Messaging Core */}
        <div className="hero-left">
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>EVENTS THAT FEEL DIFFERENT</span>
          </motion.div>

          <div className="headline-service-lockup">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Ideas.<br />
              People.<br />
              Unforgettable<br />
              Experiences.
            </motion.h1>

            <motion.div
              className="side-service-block"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 8-Point Swiss Asterisk */}
              <div className="swiss-asterisk" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" y1="1" x2="12" y2="23" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="1" y1="12" x2="23" y2="12" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4.2" y1="4.2" x2="19.8" y2="19.8" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4.2" y1="19.8" x2="19.8" y2="4.2" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              <div className="side-service-body">
                <div className="side-service-line" aria-hidden="true" />
                <ul className="side-service-items">
                  <li>WEDDINGS</li>
                  <li>CORPORATE EVENTS</li>
                  <li>LIVE SHOWS</li>
                  <li>BRAND EXPERIENCES</li>
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Freestyle is an event management studio crafting meaningful moments for brands, people and communities.
          </motion.p>

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <motion.a
              href="#contact"
              className="btn-hero-primary"
              whileHover={{ y: -3, scale: 1.02, backgroundColor: '#262626' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span>PLAN YOUR EVENT</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              >
                <ArrowRight size={17} strokeWidth={2} />
              </motion.span>
            </motion.a>

            <motion.a
              href="#about"
              className="btn-hero-secondary"
              whileHover={{ color: '#444' }}
              transition={{ duration: 0.2 }}
            >
              <span>VIEW OUR WORK</span>
            </motion.a>
          </div>

          {/* Bottom Indexed Rail & Timeline */}
          <div className="hero-bottom-rail">
            <div className="category-index-list">
              <div className="cat-item">
                <span className="cat-num">01</span>
                <span className="cat-name">WEDDINGS</span>
              </div>
              <div className="cat-item">
                <span className="cat-num">02</span>
                <span className="cat-name">CORPORATE</span>
              </div>
              <div className="cat-item">
                <span className="cat-num">03</span>
                <span className="cat-name">SOCIAL EVENTS</span>
              </div>
              <div className="cat-item">
                <span className="cat-num">04</span>
                <span className="cat-name">BRAND ACTIVATIONS</span>
              </div>
            </div>

            <div className="rail-indicator" aria-hidden="true">
              <div className="rail-track" />
              <div className="rail-dot" />
            </div>
          </div>
        </div>

        {/* Right Column: Asymmetric Visual Collage */}
        <div className="hero-right">
          <div className="visual-grid">
            {/* Center Tall Card (Chamfer cut) with 3D Tilt */}
            <motion.div
              ref={centerCardRef}
              className="card-center-feature"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="card-inner-silhouette">
                <img
                  src="/assets/images/hero-concert.jpg"
                  alt="Live concert festival crowd with golden confetti"
                  className="card-img"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="card-gradient-overlay" aria-hidden="true" />
                <div className="feature-tag-list">
                  <span>LIVE EVENTS</span>
                  <span>BRAND ACTIVATIONS</span>
                  <span>EXPERIENCES</span>
                </div>
              </div>
            </motion.div>

            {/* Rotating Circular Badge Stamp */}
            <div className="rotating-badge-container" ref={badgeRef}>
              <motion.div
                className="rotating-badge-body"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <svg className="spinning-circle-svg" viewBox="0 0 160 160" width="150" height="150" aria-label="Freestyle Event Management">
                  <defs>
                    <path id="badgeCirclePath" d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0" />
                  </defs>
                  <text className="badge-curved-text">
                    <textPath href="#badgeCirclePath" startOffset="0%">
                      • FREESTYLE EVENT MANAGEMENT • FREESTYLE EVENT MANAGEMENT
                    </textPath>
                  </text>
                </svg>
                <div className="badge-center-arrow">
                  <ArrowRight size={20} strokeWidth={2} color="#111111" />
                </div>
              </motion.div>
            </div>

            {/* Top Right Visual Card & Stat Pill */}
            <div className="top-right-group" ref={topRightCardRef}>
              <motion.div
                className="card-top-right"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/assets/images/hero-wedding.jpg"
                  alt="Atmospheric candlelit event hall with chandeliers"
                  className="card-img"
                  loading="eager"
                />
              </motion.div>

              <motion.div
                className="stat-badge-events"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                whileHover={{ y: -3 }}
              >
                <div className="stat-number">200+</div>
                <div className="stat-label">EVENTS<br />DELIVERED</div>
                <div className="stat-dash" aria-hidden="true" />
              </motion.div>
            </div>

            {/* Middle Right Visual Card & 5K+ */}
            <div className="middle-right-group">
              <motion.div
                className="card-middle-right"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2 }}
              >
                <img
                  src="/assets/images/hero-glassware.jpg"
                  alt="Fine dining table glassware setting"
                  className="card-img"
                  loading="lazy"
                />
              </motion.div>

              <div className="stat-badge-clients">
                <div className="stat-number">5K+</div>
                <div className="stat-label">HAPPY<br />CLIENTS</div>
              </div>
            </div>

            {/* Bottom Right Social Proof Avatars */}
            <motion.div
              className="bottom-social-proof"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className="avatar-stack">
                <div className="avatar-item"><img src="/assets/images/avatar1.jpg" alt="Client 1" /></div>
                <div className="avatar-item"><img src="/assets/images/avatar2.jpg" alt="Client 2" /></div>
                <div className="avatar-item"><img src="/assets/images/avatar3.jpg" alt="Client 3" /></div>
                <div className="avatar-item avatar-plus" title="More clients">
                  <Plus size={16} strokeWidth={2.4} />
                </div>
              </div>

              <div className="social-proof-text">
                <span>TRUSTED BY</span>
                <strong>AMAZING BRANDS</strong>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
