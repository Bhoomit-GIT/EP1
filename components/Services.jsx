'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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

      // Master Scroll-Driven Timeline pinned with comfortable resting buffer
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=470%',
          pin: stageRef.current,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* ------------------------------------------------------------------
         INITIAL STATES:
         - All visuals start waiting below at the downside (y: 75vh).
         - Central headline starts hidden (y: 45px, opacity: 0) to animate
           in FIRST as the user scrolls into the section.
         ------------------------------------------------------------------ */
      visuals.forEach((visual) => {
        if (visual) {
          gsap.set(visual, {
            y: '75vh',
            x: '0vw',
            scale: 0.94,
            opacity: 0,
            filter: 'blur(24px)',
          });
        }
      });

      // Typography initial states: Headline 1 enters on scroll first
      gsap.set(headline1Ref.current, {
        opacity: 0,
        y: 40,
        scale: 0.97,
        filter: 'blur(8px)',
      });
      gsap.set(headline2Ref.current, {
        opacity: 0,
        y: 24,
        filter: 'blur(8px)',
      });

      /* ------------------------------------------------------------------
         TIMELINE CHOREOGRAPHY:
         1. TEXT ENTERS FIRST: Scroll brings "Unforgettable experiences" into view
         2. IMAGE ENTERS SECOND: Space 10 glides up from downside after text arrives
         3. Subsequent visuals and headlines transition in harmony
         ------------------------------------------------------------------ */

      // --- 1. TEXT ENTRANCE (Reveals on initial scroll into section) ---
      masterTL.to(headline1Ref.current, {
        opacity: 1,
        y: 0,
        scale: 1.0,
        filter: 'blur(0px)',
        duration: 12,
        ease: 'power2.out',
      }, 0);

      // --- 2. VISUAL 0 (Space 10, Right Flank) - Enters AFTER text ---
      masterTL
        // Glides up from downside into center focus after text is established
        .to(visuals[0], {
          y: '0vh',
          x: '0vw',
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 14,
          ease: 'power2.out',
        }, 12)
        // Holds presence in focus, with subtle upward drift
        .to(visuals[0], {
          y: '-4vh',
          scale: 1.01,
          duration: 10,
          ease: 'none',
        }, 26)
        // Exits UPWARDS toward the top
        .to(visuals[0], {
          y: '-75vh',
          scale: 0.92,
          opacity: 0,
          filter: 'blur(24px)',
          duration: 12,
          ease: 'power1.in',
        }, 36);

      // --- 3. VISUAL 1 (Cuatro, Left Flank) ---
      masterTL
        // Comes from DOWNSIDE up into center focus
        .to(visuals[1], {
          y: '0vh',
          x: '0vw',
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 14,
          ease: 'power2.out',
        }, 34)
        // Holds presence in focus, with subtle upward drift
        .to(visuals[1], {
          y: '-4vh',
          scale: 1.01,
          duration: 10,
          ease: 'none',
        }, 48)
        // Exits UPWARDS toward the top
        .to(visuals[1], {
          y: '-75vh',
          scale: 0.92,
          opacity: 0,
          filter: 'blur(24px)',
          duration: 12,
          ease: 'power1.in',
        }, 58);

      // --- 4. CENTER HEADLINE TRANSITION ---
      masterTL
        .to(headline1Ref.current, {
          opacity: 0,
          y: -22,
          filter: 'blur(6px)',
          duration: 8,
          ease: 'power1.inOut',
        }, 54)
        .to(headline2Ref.current, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 8,
          ease: 'power1.inOut',
        }, 60);

      // --- 5. VISUAL 2 (Jeep Launch Event, Right Flank) ---
      masterTL
        // Comes from DOWNSIDE up into center focus
        .to(visuals[2], {
          y: '0vh',
          x: '0vw',
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 14,
          ease: 'power2.out',
        }, 58)
        // Holds presence in focus, with subtle upward drift
        .to(visuals[2], {
          y: '-4vh',
          scale: 1.01,
          duration: 10,
          ease: 'none',
        }, 72)
        // Exits UPWARDS toward the top
        .to(visuals[2], {
          y: '-75vh',
          scale: 0.92,
          opacity: 0,
          filter: 'blur(24px)',
          duration: 12,
          ease: 'power1.in',
        }, 82);

      // --- 6. VISUAL 3 (Paseo Festival EEUU, Left Flank) ---
      masterTL
        // Comes from DOWNSIDE up into center focus
        .to(visuals[3], {
          y: '0vh',
          x: '0vw',
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 14,
          ease: 'power2.out',
        }, 80)
        // Remains in center focus with subtle breathing drift
        .to(visuals[3], {
          y: '-3.5vh',
          scale: 1.01,
          duration: 18,
          ease: 'none',
        }, 94)
        // Ascends upward becoming blurry — Hosted Events rolls into view as this occurs
        .to(visuals[3], {
          y: '-60vh',
          scale: 0.94,
          opacity: 0,
          filter: 'blur(24px)',
          duration: 12,
          ease: 'power1.in',
        }, 112);

      // Headline 2 softly fades out as Visual 3 ascends and blurs
      masterTL.to(headline2Ref.current, {
        opacity: 0,
        y: -18,
        filter: 'blur(6px)',
        duration: 10,
        ease: 'power1.inOut',
      }, 114);

      // Hairline scroll progress tracker across the full duration
      if (progressBarRef.current) {
        masterTL.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          duration: 124,
        }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="swiss-services-section">
      {/* Pinned Full-Screen Stage */}
      <div ref={stageRef} className="swiss-services-stage">

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
