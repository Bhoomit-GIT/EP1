import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutRef = useRef(null);
  const hallCardRef = useRef(null);
  const floristCardRef = useRef(null);
  const watermarkRef = useRef(null);
  const pillarsRef = useRef(null);

  // Framer Motion 3D tilt on the florist hands card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 140, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 140, damping: 20 });
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!floristCardRef.current) return;
    const rect = floristCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // GSAP Multi-plane Scroll Parallax and Scrub Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Tall Hall Card Parallax
      if (hallCardRef.current) {
        gsap.to(hallCardRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Foreground Florist Card Inverse Parallax (Tactile Depth Separation)
      if (floristCardRef.current) {
        gsap.to(floristCardRef.current, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Giant Watermark Smooth Scroll Scrub
      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { x: -40, opacity: 0.02 },
          {
            x: 40,
            opacity: 0.055,
            ease: 'none',
            scrollTrigger: {
              trigger: aboutRef.current,
              start: 'top 80%',
              end: 'bottom bottom',
              scrub: 2,
            },
          }
        );
      }

      // Staggered Reveal for 3 Process Pillars
      if (pillarsRef.current) {
        const pillarCards = pillarsRef.current.querySelectorAll('.pillar-card, .pillar-cta-card');
        gsap.from(pillarCards, {
          opacity: 0,
          y: 35,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: 'top 85%',
          },
        });
      }
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-section" id="about" ref={aboutRef}>
      <div className="about-wrapper">
        {/* Top Section Overline & Hairline Rule */}
        <div className="about-header-rail">
          <div className="about-eyebrow">
            <span className="eyebrow-num">01</span>
            <span className="eyebrow-dash">—</span>
            <span className="eyebrow-text">ABOUT FREESTYLE</span>
          </div>
          <div className="about-header-line" aria-hidden="true" />
        </div>

        {/* Main About Grid */}
        <div className="about-main-grid">
          {/* Left Column */}
          <div className="about-left">
            <div className="about-title-service-lockup">
              <motion.h2
                className="about-title"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                We make<br />
                moments<br />
                matter.
              </motion.h2>

              <div className="about-side-service-block">
                <div className="about-swiss-asterisk" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="1" x2="12" y2="23" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="1" y1="12" x2="23" y2="12" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="4.2" y1="4.2" x2="19.8" y2="19.8" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="4.2" y1="19.8" x2="19.8" y2="4.2" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="about-side-service-body">
                  <div className="about-side-service-line" aria-hidden="true" />
                  <ul className="about-side-service-items">
                    <li>EXPERIENCES</li>
                    <li>BRANDS</li>
                    <li>COMMUNITIES</li>
                    <li>BEYOND EVENTS</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="about-description">
              Freestyle is an independent event studio creating considered experiences where people, brands and ideas come together.
            </p>

            {/* Action & Triad Indicator Group */}
            <div className="about-action-group">
              <motion.a
                href="#contact"
                className="btn-circle-arrow"
                aria-label="Explore possibilities"
                whileHover={{ scale: 1.08, backgroundColor: '#111111', color: '#FFFFFF' }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <motion.span
                  whileHover={{ x: 2, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight size={22} strokeWidth={1.8} />
                </motion.span>
              </motion.a>

              <div className="about-triad-indicator">
                <span className="triad-text">PEOPLE &nbsp;/&nbsp; PLACES &nbsp;/&nbsp; POSSIBILITIES</span>
                <div className="triad-line" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="about-right">
            <div className="about-visual-cluster">
              {/* Subtle Layered Backing Card */}
              <div className="about-card-backdrop" aria-hidden="true" />

              {/* Main Tall Grand Hall Card (Atmospheric dark banquet hall with hanging greenery) */}
              <div className="about-card-hall" ref={hallCardRef}>
                <img
                  src="/assets/images/about-hall.jpg"
                  alt="Atmospheric dark candlelit luxury greenhouse event hall with cascading hanging greenery and chandeliers"
                  className="about-img"
                  loading="lazy"
                />
              </div>

              {/* Top-Right Meta Service Lines */}
              <div className="about-meta-services">
                <div className="meta-service-item">
                  <span className="meta-dash" aria-hidden="true" />
                  <span className="meta-label">CREATIVE DIRECTION</span>
                </div>
                <div className="meta-service-item">
                  <span className="meta-dash" aria-hidden="true" />
                  <span className="meta-label">PRODUCTION</span>
                </div>
                <div className="meta-service-item">
                  <span className="meta-dash" aria-hidden="true" />
                  <span className="meta-label">EXPERIENCE DESIGN</span>
                </div>
                <div className="meta-service-item">
                  <span className="meta-dash" aria-hidden="true" />
                  <span className="meta-label">SINCE 2018</span>
                </div>
              </div>

              {/* Foreground Florist Hands Card with 3D Tilt */}
              <motion.div
                className="about-card-florist"
                ref={floristCardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformPerspective: 800 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <img
                  src="/assets/images/about-florist-hands.jpg"
                  alt="Florist hands carefully arranging white roses and luxury banquet table setting"
                  className="about-img"
                  loading="lazy"
                />
              </motion.div>

              {/* Atmosphere Vertical Tags */}
              <div className="about-atmosphere-tags">
                <span>DETAILS</span>
                <span>PEOPLE</span>
                <span>ATMOSPHERE</span>
                <span>EXTRAORDINARY</span>
                <span>TOGETHER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Process Pillars */}
        <div className="about-pillars-container" ref={pillarsRef}>
          <div className="about-pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-card">
              <span className="pillar-num">01</span>
              <h3 className="pillar-title">THINK</h3>
              <p className="pillar-desc">
                We listen, understand and uncover what makes your event unique.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card with-divider">
              <span className="pillar-num">02</span>
              <h3 className="pillar-title">CREATE</h3>
              <p className="pillar-desc">
                We design experiences with purpose, creativity and precision.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card with-divider">
              <span className="pillar-num">03</span>
              <h3 className="pillar-title">DELIVER</h3>
              <p className="pillar-desc">
                We bring ideas to life seamlessly, leaving a lasting impact.
              </p>
            </div>

            {/* Right CTA Card */}
            <div className="pillar-cta-card">
              <motion.a
                href="#contact"
                className="btn-circle-plus"
                aria-label="Let's create together"
                whileHover={{ rotate: 90, scale: 1.08, backgroundColor: '#111111', color: '#FFFFFF' }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Plus size={22} strokeWidth={2} />
              </motion.a>
              <div className="pillar-cta-text">
                <span>LET'S</span>
                <span>CREATE</span>
                <span>TOGETHER</span>
                <div className="pillar-cta-dash" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Giant Background Watermark with Scrub Parallax */}
        <div className="about-watermark" ref={watermarkRef} aria-hidden="true">
          FREESTYLE
        </div>
      </div>
    </section>
  );
}
