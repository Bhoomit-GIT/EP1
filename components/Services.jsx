'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_PROJECTS = [
  {
    id: '01',
    brand: 'Space 10',
    event: 'Denmark',
    image: '/assets/images/about-hall-vibe4.jpg',
    flank: 'right',
  },
  {
    id: '02',
    brand: 'Cuatro',
    event: 'Mediaset',
    image: '/assets/images/about-arch-main.jpg',
    flank: 'left',
  },
  {
    id: '03',
    brand: 'Jeep',
    event: 'Launch event',
    image: '/assets/images/hero-concert.jpg',
    flank: 'right',
  },
  {
    id: '04',
    brand: 'Paseo Festival',
    event: 'EEUU',
    image: '/assets/images/about-hall-alt.jpg',
    flank: 'left',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const visualRefs = useRef([]);
  const headline1Ref = useRef(null);
  const headline2Ref = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const visuals = visualRefs.current;

      // Master Scroll-Driven Timeline pinned across 450vh
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=450%',
          pin: stageRef.current,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* ------------------------------------------------------------------
         INITIAL STATES:
         - Visual 0 (Space 10): ALREADY PRESENT in center focus (No pop up).
         - Subsequent visuals wait at the DOWNSIDE (y: 75vh below viewport)
           to glide upwards into view.
         ------------------------------------------------------------------ */
      // Visual 0 (Space 10): ALREADY PRESENT in resting position
      gsap.set(visuals[0], {
        y: '0vh',
        x: '0vw',
        scale: 1.0,
        opacity: 1,
        filter: 'blur(0px)',
      });

      // Visual 1 (Cuatro): Waiting below at the downside
      gsap.set(visuals[1], {
        y: '75vh',
        x: '0vw',
        scale: 0.94,
        opacity: 0,
        filter: 'blur(26px)',
      });

      // Visual 2 (Jeep): Waiting below at the downside
      gsap.set(visuals[2], {
        y: '75vh',
        x: '0vw',
        scale: 0.94,
        opacity: 0,
        filter: 'blur(26px)',
      });

      // Visual 3 (Paseo Festival): Waiting below at the downside
      gsap.set(visuals[3], {
        y: '75vh',
        x: '0vw',
        scale: 0.94,
        opacity: 0,
        filter: 'blur(26px)',
      });

      // Typography initial states
      gsap.set(headline1Ref.current, { opacity: 1, y: 0 });
      gsap.set(headline2Ref.current, { opacity: 0, y: 22 });

      /* ------------------------------------------------------------------
         TIMELINE CHOREOGRAPHY: IMAGES COME FROM DOWNSIDE
         - Visual 0 holds, then exits upwards.
         - Visual 1 comes from DOWNSIDE (75vh -> 0vh), holds, exits upwards.
         - Visual 2 comes from DOWNSIDE (75vh -> 0vh), holds, exits upwards.
         - Visual 3 comes from DOWNSIDE (75vh -> 0vh), holds & settles.
         ------------------------------------------------------------------ */

      // --- 1. VISUAL 0 (Space 10, Right Flank) ---
      masterTL
        // Holds presence initially, with subtle upward drift
        .to(visuals[0], {
          y: '-4vh',
          scale: 1.01,
          duration: 12,
          ease: 'none',
        }, 0)
        // Exits UPWARDS toward the top
        .to(visuals[0], {
          y: '-75vh',
          scale: 0.92,
          opacity: 0,
          filter: 'blur(26px)',
          duration: 16,
          ease: 'power1.in',
        }, 12);

      // --- 2. VISUAL 1 (Cuatro, Left Flank) ---
      masterTL
        // Comes from DOWNSIDE up into center focus
        .to(visuals[1], {
          y: '0vh',
          x: '0vw',
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 16,
          ease: 'power1.out',
        }, 10)
        // Holds presence in focus, with subtle upward drift
        .to(visuals[1], {
          y: '-4vh',
          scale: 1.01,
          duration: 14,
          ease: 'none',
        }, 26)
        // Exits UPWARDS toward the top
        .to(visuals[1], {
          y: '-75vh',
          scale: 0.92,
          opacity: 0,
          filter: 'blur(26px)',
          duration: 16,
          ease: 'power1.in',
        }, 40);

      // --- CENTER HEADLINE TRANSITION ---
      masterTL
        .to(headline1Ref.current, {
          opacity: 0,
          y: -20,
          duration: 8,
          ease: 'power1.inOut',
        }, 38)
        .to(headline2Ref.current, {
          opacity: 1,
          y: 0,
          duration: 8,
          ease: 'power1.inOut',
        }, 44);

      // --- 3. VISUAL 2 (Jeep Launch Event, Right Flank) ---
      masterTL
        // Comes from DOWNSIDE up into center focus
        .to(visuals[2], {
          y: '0vh',
          x: '0vw',
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 16,
          ease: 'power1.out',
        }, 38)
        // Holds presence in focus, with subtle upward drift
        .to(visuals[2], {
          y: '-4vh',
          scale: 1.01,
          duration: 14,
          ease: 'none',
        }, 54)
        // Exits UPWARDS toward the top
        .to(visuals[2], {
          y: '-75vh',
          scale: 0.92,
          opacity: 0,
          filter: 'blur(26px)',
          duration: 16,
          ease: 'power1.in',
        }, 68);

      // --- 4. VISUAL 3 (Paseo Festival EEUU, Left Flank) ---
      masterTL
        // Comes from DOWNSIDE up into center focus
        .to(visuals[3], {
          y: '0vh',
          x: '0vw',
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 16,
          ease: 'power1.out',
        }, 66)
        // Remains present and softly settles as the section concludes
        .to(visuals[3], {
          y: '-4vh',
          scale: 1.01,
          duration: 18,
          ease: 'none',
        }, 82);

      // Hairline scroll progress tracker at the bottom
      if (progressBarRef.current) {
        masterTL.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          duration: 100,
        }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="swiss-services-section">
      {/* Pinned Full-Screen Stage */}
      <div ref={stageRef} className="swiss-services-stage">
        {/* Minimal Top Brand & Navigation Header (Matching Reference Frames) */}
        <div className="swiss-top-brand-bar">
          <div className="swiss-brand-pill">
            <span className="swiss-logo-dots">
              <span className="dot dot-1" />
              <span className="dot dot-2" />
              <span className="dot dot-3" />
            </span>
          </div>

          <div className="swiss-top-nav-pill">
            <a href="#about" className="nav-pill-link">Work</a>
            <a href="#services" className="nav-pill-link">Info</a>
            <a href="#contact" className="nav-pill-link">Contact</a>
          </div>
        </div>

        {/* Central Dominant Grotesque Typography Layer */}
        <div className="swiss-center-content">
          {/* Phase 1: Unforgettable experiences */}
          <div ref={headline1Ref} className="swiss-headline-state state-1">
            <h2 className="swiss-headline-text">
              Unforgettable experiences
            </h2>
          </div>

          {/* Phase 2: Made with Freestyle + Minimal Rounded CTA */}
          <div ref={headline2Ref} className="swiss-headline-state state-2">
            <h2 className="swiss-headline-text">
              Made with Freestyle
            </h2>
            <a href="#contact" className="swiss-contact-btn">
              Contact us
            </a>
          </div>
        </div>

        {/* Large Bleeding Event Visuals with Dreamy Cloud Feather Masks */}
        <div className="swiss-visuals-container" aria-hidden="true">
          {SERVICE_PROJECTS.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) visualRefs.current[idx] = el;
              }}
              className={`swiss-event-visual visual-flank-${project.flank}`}
            >
              <div className="swiss-visual-inner">
                <div className="swiss-img-wrap">
                  <img
                    src={project.image}
                    alt={`${project.brand} ${project.event}`}
                    className="swiss-visual-img"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Overall soft feathered border contour frame */}
                  <div className="swiss-feather-frame" aria-hidden="true" />
                </div>

                {/* Floating Frosted Pill Badge */}
                <div className="swiss-floating-badge">
                  <span className="badge-brand">{project.brand}</span>
                  <span className="badge-event">{project.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hairline Timeline Progress at Stage Bottom */}
        <div className="swiss-progress-track">
          <div ref={progressBarRef} className="swiss-progress-bar" />
        </div>
      </div>
    </section>
  );
}
