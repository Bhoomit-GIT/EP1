'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Diamond, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoModal from './VideoModal';
import AcousticPill from './AcousticPill';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const sectionRef = useRef(null);
  const mainArchRef = useRef(null);
  const secondaryArchRef = useRef(null);
  const blushCircleRef = useRef(null);
  const soundwaveRef = useRef(null);
  const pillarsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Primary Arch Parallax
      if (mainArchRef.current) {
        gsap.to(mainArchRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Secondary Overlapping Arch (Opposite/Deeper Parallax)
      if (secondaryArchRef.current) {
        gsap.to(secondaryArchRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          },
        });
      }

      // Floating Blush Sphere
      if (blushCircleRef.current) {
        gsap.to(blushCircleRef.current, {
          y: -15,
          x: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Interactive Acoustic Soundwave Pill Parallax
      if (soundwaveRef.current) {
        gsap.to(soundwaveRef.current, {
          y: -22,
          x: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          },
        });
      }

      // Staggered reveal for right-side pillars
      if (pillarsRef.current) {
        const items = pillarsRef.current.querySelectorAll('.value-prop-card');
        gsap.from(items, {
          opacity: 0,
          x: 30,
          stagger: 0.18,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: 'top 80%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-editorial-section" id="about" ref={sectionRef}>
      {/* Structural Vertical Grid Hairline */}
      <div className="grid-structural-axis" aria-hidden="true" />

      <div className="about-editorial-wrapper">
        {/* Top Header Rail */}
        <div className="editorial-top-rail">
          <div className="top-left-marker">
            <span className="marker-stroke" aria-hidden="true" />
            <span className="marker-label">ABOUT US</span>
          </div>
          <div className="top-right-breadcrumb">
            <span>PEOPLE &nbsp;•&nbsp; PLACES &nbsp;•&nbsp; BEAUTIFUL STORIES</span>
          </div>
        </div>

        {/* Main 3-Column Editorial Grid */}
        <div className="editorial-main-grid">
          {/* ===============================================================
              LEFT COLUMN: TYPOGRAPHY, STATS, VIDEO TRIGGER
             =============================================================== */}
          <div className="editorial-left-col">
            <motion.div
              className="editorial-eyebrow"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span>MORE THAN EVENTS</span>
            </motion.div>

            {/* Display Headline with Terracotta Italic Serif */}
            <motion.h2
              className="editorial-headline"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              We Create<br />
              <span className="serif-terracotta-italic">Moments</span><br />
              That Matter.
            </motion.h2>

            <motion.p
              className="editorial-bio"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              At Evently, we believe every occasion is a story waiting to be told. We design, plan, and curate events that bring people together and turn ordinary days into extraordinary memories.
            </motion.p>

            <div className="editorial-dash-separator" aria-hidden="true" />

            {/* 3 Metric Stats with Vertical Hairlines */}
            <motion.div
              className="editorial-stats-row"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="stat-unit">
                <span className="stat-figure">500+</span>
                <span className="stat-caption">Events Planned</span>
              </div>

              <div className="stat-unit with-divider">
                <span className="stat-figure">98%</span>
                <span className="stat-caption">Client Satisfaction</span>
              </div>

              <div className="stat-unit with-divider">
                <span className="stat-figure">10+</span>
                <span className="stat-caption">Years of Experience</span>
              </div>
            </motion.div>

            {/* Video Story Action Trigger */}
            <motion.div
              className="editorial-video-action"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <motion.button
                className="btn-play-circle"
                aria-label="Play story video"
                onClick={() => setIsVideoOpen(true)}
                whileHover={{ scale: 1.08, borderColor: '#111111' }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Play size={16} fill="#111111" stroke="#111111" style={{ marginLeft: 2 }} />
              </motion.button>

              <div
                className="video-action-info"
                onClick={() => setIsVideoOpen(true)}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setIsVideoOpen(true);
                }}
              >
                <span className="action-tag">OUR STORY</span>
                <span className="action-headline">Watch How We Create Magic</span>
              </div>

              <div className="video-action-rail" aria-hidden="true" />
            </motion.div>
          </div>

          {/* ===============================================================
              CENTER COLUMN: ARCHED ARCHITECTURAL COMPOSITION
             =============================================================== */}
          <div className="editorial-center-col">
            <div className="arches-composition-wrapper">
              {/* Soft Blush Circle Accent (Top Right) */}
              <div className="accent-circle-blush" ref={blushCircleRef} aria-hidden="true" />

              {/* Wireframe Curved Arc */}
              <div className="accent-wireframe-arc" aria-hidden="true" />

              {/* Primary Tall Roman Arch Window (Outdoor Wedding Canopy) */}
              <div className="arch-card-primary" ref={mainArchRef}>
                <div className="arch-inner-window">
                  <img
                    src="/assets/images/about-arch-main.jpg"
                    alt="Outdoor floral wedding canopy with mountains in background"
                    className="arch-img"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Rotating Circular Text Stamp on Crest */}
              <div className="arch-rotating-stamp" aria-hidden="true">
                <svg viewBox="0 0 160 160" width="130" height="130">
                  <defs>
                    <path id="archCirclePath" d="M 80, 80 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" />
                  </defs>
                  <text className="arch-stamp-text">
                    <textPath href="#archCirclePath" startOffset="0%">
                      • EXPERIENCES • EXPERIENCES • EXPERIENCES
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Secondary Overlapping Arch Window (Candlelit Tablescape) */}
              <div className="arch-card-secondary" ref={secondaryArchRef}>
                <div className="arch-inner-window secondary">
                  <img
                    src="/assets/images/about-arch-detail.jpg"
                    alt="Atmospheric candlelit banquet table setting with tall glass hurricane cylinders"
                    className="arch-img"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Direction 2: Interactive Acoustic Soundwave Pill */}
              <AcousticPill containerRef={soundwaveRef} />
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN: SERVICE PILLARS & CALLIGRAPHY SIGNATURE
             =============================================================== */}
          <div className="editorial-right-col">
            {/* 3 Value Pillars */}
            <div className="value-props-container" ref={pillarsRef}>
              {/* Pillar 1: Personalized Planning */}
              <div className="value-prop-card">
                <div className="value-prop-icon-badge blush">
                  <Heart size={20} strokeWidth={1.8} color="#111111" />
                </div>
                <div className="value-prop-content">
                  <h3 className="value-prop-title">Personalized Planning</h3>
                  <p className="value-prop-desc">
                    Every event is tailored to your vision, style, and story.
                  </p>
                </div>
              </div>

              {/* Pillar 2: End-to-End Support */}
              <div className="value-prop-card">
                <div className="value-prop-icon-badge gray">
                  <Diamond size={20} strokeWidth={1.8} color="#111111" />
                </div>
                <div className="value-prop-content">
                  <h3 className="value-prop-title">End-to-End Support</h3>
                  <p className="value-prop-desc">
                    From concept to execution, we handle every detail.
                  </p>
                </div>
              </div>

              {/* Pillar 3: Unforgettable Experiences */}
              <div className="value-prop-card">
                <div className="value-prop-icon-badge blush">
                  <Users size={20} strokeWidth={1.8} color="#111111" />
                </div>
                <div className="value-prop-content">
                  <h3 className="value-prop-title">Unforgettable Experiences</h3>
                  <p className="value-prop-desc">
                    We create celebrations that leave a lasting impression.
                  </p>
                </div>
              </div>
            </div>

            {/* Atmosphere Keywords & Handwritten Signature Image Row */}
            <div className="editorial-atmosphere-signature-row">
              <div className="editorial-atmosphere-stack">
                <span>DETAILS</span>
                <span>PEOPLE</span>
                <span>ATMOSPHERE</span>
                <span>MEMORIES</span>
                <div className="atmosphere-dash" aria-hidden="true" />
              </div>

              {/* Handwritten "Celebrations with Purpose" Calligraphy Image */}
              <motion.div
                className="editorial-signature-flourish"
                initial={{ opacity: 0, y: 136, rotate: -15, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 152, rotate: -15, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25 }}
              >
                <img
                  src="/assets/images/celebrations-with-purpose.png"
                  alt="Celebrations with Purpose"
                  className="signature-flourish-img"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Story Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  );
}
