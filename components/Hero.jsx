'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ROTATING_WORDS = ['Unforgettable', 'Timeless', 'Limitless'];

/* ------------------------------------------------------------------ */
/* Count-up number for stat badges                                     */
/* ------------------------------------------------------------------ */
function StatCounter({ value, suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic hover wrapper — element gravitates toward the cursor       */
/* ------------------------------------------------------------------ */
function Magnetic({ children, strength = 0.32 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.6 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div className="magnetic" style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const heroWrapperRef = useRef(null);
  const centerCardRef = useRef(null);
  const topRightCardRef = useRef(null);
  const badgeRef = useRef(null);

  // Rotating headline word
  const [wordIdx, setWordIdx] = useState(0);
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (reducedMotion) return;
    let interval;
    const startDelay = setTimeout(() => {
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          setWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length);
        }
      }, 3000);
    }, 1400);
    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [reducedMotion]);

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

      // Cinematic dolly: hero recedes gently as the story begins
      if (heroWrapperRef.current && !reducedMotion) {
        gsap.to(heroWrapperRef.current, {
          yPercent: -4,
          scale: 0.988,
          opacity: 0.45,
          transformOrigin: 'center top',
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Kinetic line reveal variants
  const lineReveal = {
    hidden: { yPercent: 118 },
    visible: (i) => ({
      yPercent: 0,
      transition: { duration: 0.95, delay: 0.18 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      <div className="bg-shape-arc" aria-hidden="true" />

      {/* Animated Aurora Gradient Backdrop + Film Grain */}
      <div className="hero-aurora" aria-hidden="true">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
      </div>
      <div className="hero-grain" aria-hidden="true" />

      <div className="hero-wrapper" ref={heroWrapperRef}>
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
            <h1 className="hero-title">
              <span className="hero-line-mask">
                <motion.span className="hero-line" custom={0} variants={lineReveal} initial="hidden" animate="visible">
                  Ideas.
                </motion.span>
              </span>
              <br />
              <span className="hero-line-mask">
                <motion.span className="hero-line" custom={1} variants={lineReveal} initial="hidden" animate="visible">
                  People.
                </motion.span>
              </span>
              <br />
              <span className="hero-line-mask hero-line-mask-rotating">
                <motion.span className="hero-line" custom={2} variants={lineReveal} initial="hidden" animate="visible">
                  <span className="rotating-word-mask">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={wordIdx}
                        className="rotating-word"
                        initial={{ yPercent: 112 }}
                        animate={{ yPercent: 0 }}
                        exit={{ yPercent: -112 }}
                        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                      >
                        {ROTATING_WORDS[wordIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </motion.span>
              </span>
              <br />
              <span className="hero-line-mask">
                <motion.span className="hero-line" custom={3} variants={lineReveal} initial="hidden" animate="visible">
                  Experiences.
                </motion.span>
              </span>
            </h1>

            <motion.div
              className="side-service-block"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            Freestyle is an event management studio crafting meaningful moments for brands, people and communities.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            <Magnetic strength={0.28}>
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
            </Magnetic>

            <motion.a
              href="#about"
              className="btn-hero-secondary"
              whileHover={{ color: '#444' }}
              transition={{ duration: 0.2 }}
            >
              <span>VIEW OUR WORK</span>
            </motion.a>
          </motion.div>

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
              transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="card-inner-silhouette">
                <img
                  src="/assets/images/hero-concert.jpg"
                  alt="Live concert festival crowd with golden confetti"
                  className="card-img"
                  width="800"
                  height="1067"
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
                transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/assets/images/hero-wedding.jpg"
                  alt="Atmospheric candlelit event hall with chandeliers"
                  className="card-img"
                  width="640"
                  height="480"
                  loading="eager"
                />
              </motion.div>

              <motion.div
                className="stat-badge-events"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 1.15 }}
                whileHover={{ y: -3 }}
              >
                <div className="stat-number">
                  <StatCounter value={200} suffix="+" />
                </div>
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
                transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2 }}
              >
                <img
                  src="/assets/images/hero-glassware.jpg"
                  alt="Fine dining table glassware setting"
                  className="card-img"
                  width="640"
                  height="480"
                  loading="lazy"
                />
              </motion.div>

              <div className="stat-badge-clients">
                <div className="stat-number">
                  <StatCounter value={5} suffix="K+" />
                </div>
                <div className="stat-label">HAPPY<br />CLIENTS</div>
              </div>
            </div>

            {/* Bottom Right Social Proof Avatars */}
            <motion.div
              className="bottom-social-proof"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <div className="avatar-stack">
                <div className="avatar-item"><img src="/assets/images/avatar1.jpg" alt="Client 1" width="56" height="56" /></div>
                <div className="avatar-item"><img src="/assets/images/avatar2.jpg" alt="Client 2" width="56" height="56" /></div>
                <div className="avatar-item"><img src="/assets/images/avatar3.jpg" alt="Client 3" width="56" height="56" /></div>
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

      {/* Infinite Brand Marquee Trust Strip */}
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          {[0, 1].map((copy) => (
            <div className="hero-marquee-group" key={copy}>
              {['WEDDINGS', 'CORPORATE GALAS', 'LIVE CONCERTS', 'BRAND ACTIVATIONS', 'PRIVATE SOIRÉES', 'CULTURAL FESTIVALS'].map(
                (item) => (
                  <span className="hero-marquee-item" key={`${copy}-${item}`}>
                    {item}
                    <span className="marquee-separator" />
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
