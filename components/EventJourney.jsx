'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useModalA11y from './useModalA11y';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const JOURNEY_MILESTONES = [
  {
    id: '01',
    category: 'Ring Ceremony',
    eyebrow: 'THE BEGINNING · PROMISE OF FOREVER',
    badge: 'INTIMATE EXCHANGE',
    subtitle: 'The Sacred Promise & Ring Exchange',
    date: 'Evening of Day One',
    time: '6:30 PM – 9:00 PM',
    guests: '80 Guests',
    location: 'The Grand Mandap, Ballroom',
    description:
      'Where two hearts make their first vow. An intimate ring exchange ceremony surrounded by candlelight, intricate mehndi, and the quiet magic of two souls choosing each other before their families and the divine.',
    cta: 'View Ceremony',
    images: {
      primary: '/assets/images/marriage/ring-ceremony-main.jpg',
      accentTop: '/assets/images/marriage/ring-ceremony-accent1.jpg',
      accentBottom: '/assets/images/marriage/ring-ceremony-accent2.jpg',
    },
    waveY: 48,
  },
  {
    id: '02',
    category: 'Haldi',
    eyebrow: 'GOLDEN GLOW · DAY OF JOY',
    badge: 'THE GOLDEN RITUAL',
    subtitle: 'Turmeric & Marigold Morning Ceremony',
    date: 'Morning of Day Two',
    time: '10:00 AM – 1:00 PM',
    guests: '120 Guests',
    location: 'Garden Pavilion, Outdoor Terrace',
    description:
      'A burst of sunshine, laughter, and turmeric. The entire family gathers in yellow to anoint the couple with haldi paste, marigold petals, and decades of love — a tradition that glows brighter than any jewel.',
    cta: 'Join the Joy',
    images: {
      primary: '/assets/images/marriage/haldi-main.jpg',
      accentTop: '/assets/images/marriage/haldi-accent1.jpg',
      accentBottom: '/assets/images/marriage/haldi-accent2.jpg',
    },
    waveY: 44,
  },
  {
    id: '03',
    category: 'Vivah',
    eyebrow: 'THE SACRED UNION · PHERAS',
    badge: 'THE GRAND CEREMONY',
    subtitle: 'Seven Vows Beneath the Sacred Fire',
    date: 'Day Two',
    time: '3:00 PM – 7:00 PM',
    guests: '350 Guests',
    location: 'The Ceremonial Mandap, Main Hall',
    description:
      'The sacred centre of it all. Surrounded by roses, sacred fire, and 350 witnesses, the couple take their seven pheras — each step a promise, each vow a lifelong bond sealed with flowers and flame.',
    cta: 'View Ceremony',
    images: {
      primary: '/assets/images/marriage/vivah-main.jpg',
      accentTop: '/assets/images/marriage/vivah-accent1.jpg',
      accentBottom: '/assets/images/marriage/vivah-accent2.jpg',
    },
    waveY: 52,
  },
  {
    id: '04',
    category: 'Reception',
    eyebrow: 'THE GRAND CELEBRATION · EVENING GALA',
    badge: 'BLACK TIE RECEPTION',
    subtitle: 'Crystal Ballroom Gala & Formal Dinner',
    date: 'Evening of Day Two',
    time: '7:30 PM – 11:00 PM',
    guests: '400 Guests',
    location: 'Crystal Grand Ballroom',
    description:
      'The couple makes their grand entrance in glittering couture. A candlelit formal dinner under crystal chandeliers, laser light shows, and heartfelt speeches mark the joyous transition into married life.',
    cta: 'Reserve a Seat',
    images: {
      primary: '/assets/images/marriage/reception-main.jpg',
      accentTop: '/assets/images/marriage/reception-accent1.jpg',
      accentBottom: '/assets/images/marriage/reception-accent2.jpg',
    },
    waveY: 46,
  },
  {
    id: '05',
    category: 'After Hours',
    eyebrow: 'THE FINALE · DANCE TILL DAWN',
    badge: 'THE AFTER PARTY',
    subtitle: 'Dance Floor, DJ & Midnight Revelry',
    date: 'Night of Day Two',
    time: '11:00 PM – 3:00 AM',
    guests: '200 Guests',
    location: 'Rooftop Lounge & Dance Hall',
    description:
      'The party the whole family has been waiting for. The bride hits the floor in white sequins, the DJ drops Bollywood anthems, and the night belongs entirely to everyone who danced, laughed, and celebrated love without reservations.',
    cta: 'Join the Party',
    images: {
      primary: '/assets/images/marriage/afterhours-main.jpg',
      accentTop: '/assets/images/marriage/afterhours-accent1.jpg',
      accentBottom: '/assets/images/marriage/afterhours-accent2.jpg',
    },
    waveY: 50,
  },
];

// Ultra-smooth continuous mathematical sine spline (16 cubic bezier segments per panel).
// C1 and C2 continuous derivatives — zero sharp corners, silky organic curvature matching video reference.
// Peak crest is aligned at x = 350 (at the milestone dot), trough at x = 850 (under photos).
function generateSmoothWavePath(totalPanels = 5, panelWidth = 1000, amplitude = 32, midY = 500) {
  const segmentsPerPanel = 16;
  const dx = panelWidth / segmentsPerPanel;
  const totalX = totalPanels * panelWidth;

  const y = (x) => midY - amplitude * Math.sin((2 * Math.PI * (x - 100)) / panelWidth);
  const dydx = (x) => -amplitude * ((2 * Math.PI) / panelWidth) * Math.cos((2 * Math.PI * (x - 100)) / panelWidth);

  let path = `M 0 ${y(0).toFixed(2)} `;
  for (let x = 0; x < totalX; x += dx) {
    const x0 = x;
    const x1 = x + dx;
    const y0 = y(x0);
    const y1 = y(x1);
    const dy0 = dydx(x0);
    const dy1 = dydx(x1);

    const cp1x = (x0 + dx / 3).toFixed(2);
    const cp1y = (y0 + (dx / 3) * dy0).toFixed(2);
    const cp2x = (x1 - dx / 3).toFixed(2);
    const cp2y = (y1 - (dx / 3) * dy1).toFixed(2);

    path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1.toFixed(2)} ${y1.toFixed(2)} `;
  }
  return path.trim();
}

const WAVE_PATH_DATA = generateSmoothWavePath(5, 1000, 32, 500);

// Exact coordinates of each milestone dot on the wave (crest at x = i*1000 + 350, y = 468)
const MILESTONE_DOT_COORDS = [0, 1, 2, 3, 4].map((i) => ({
  x: i * 1000 + 350,
  y: 468,
}));

export default function EventJourney() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const panelsRef = useRef([]);
  const categoryTitleRefs = useRef([]);
  const aboveInfoRefs = useRef([]);
  const belowInfoRefs = useRef([]);
  const heroCardRefs = useRef([]);
  const accentTopRefs = useRef([]);
  const accentBottomRefs = useRef([]);
  const flowGradRef = useRef(null);
  const progressBarRef = useRef(null);
  const masterSTRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const rsvpModalRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !stageRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalPanels = JOURNEY_MILESTONES.length;

      // Master Pinned Scroll-Driven Horizontal Translation with UX Resting Buffer
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(totalPanels + 0.5) * 100}%`,
          pin: stageRef.current,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Horizontal glide completes across first ~91% of scroll travel (leaving 50vh resting buffer)
            const glideProgress = Math.min(1, self.progress * (110 / 100));
            const rawIdx = Math.round(glideProgress * (totalPanels - 1));
            setActiveIdx(Math.min(totalPanels - 1, Math.max(0, rawIdx)));
          },
        },
      });

      // Cache the ScrollTrigger for exact milestone navigation math
      masterSTRef.current = masterTL.scrollTrigger;

      // 1. Horizontal track glide (scrolling towards the right as user scrolls down)
      masterTL.to(
        track,
        {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          duration: 100,
        },
        0
      );

      // 2. Liquid Gold Flow — stays anchored in the middle/65% of the visible frame throughout all events
      const flowObj = { headX: 600 }; // 60% of panel 1 visible on start

      if (flowGradRef.current) {
        flowGradRef.current.setAttribute('gradientTransform', `matrix(${flowObj.headX} 0 0 1 0 0)`);
      }

      masterTL.to(
        flowObj,
        {
          headX: 5050, // Accurately tracks viewport so every event shows the flow entering and feathering
          ease: 'none',
          duration: 100,
          onUpdate: () => {
            if (flowGradRef.current) {
              flowGradRef.current.setAttribute('gradientTransform', `matrix(${flowObj.headX} 0 0 1 0 0)`);
            }
          },
        },
        0
      );

      // 3. Staggered Scroll Entrances for Text & Images as user visits each panel to the right
      JOURNEY_MILESTONES.forEach((_, idx) => {
        if (idx > 0) {
          // Time window in master timeline corresponding to panel arrival
          const tStart = (idx - 1) * 23 + 4;

          if (categoryTitleRefs.current[idx]) {
            masterTL.fromTo(
              categoryTitleRefs.current[idx],
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, ease: 'power2.out', duration: 14 },
              tStart
            );
          }

          if (aboveInfoRefs.current[idx]) {
            masterTL.fromTo(
              aboveInfoRefs.current[idx],
              { opacity: 0, y: -24 },
              { opacity: 1, y: 0, ease: 'power2.out', duration: 12 },
              tStart + 2
            );
          }

          if (belowInfoRefs.current[idx]) {
            masterTL.fromTo(
              belowInfoRefs.current[idx],
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, ease: 'power2.out', duration: 14 },
              tStart + 3
            );
          }

          // Image Card Entrances — smoothly unmasking and drifting into position along the golden flow
          if (heroCardRefs.current[idx]) {
            masterTL.fromTo(
              heroCardRefs.current[idx],
              { opacity: 0, scale: 0.85, y: 40, rotate: 1.8 },
              { opacity: 1, scale: 1, y: 0, rotate: 0, ease: 'power2.out', duration: 16 },
              tStart + 1
            );
          }

          if (accentTopRefs.current[idx]) {
            masterTL.fromTo(
              accentTopRefs.current[idx],
              { opacity: 0, x: -45, y: -30, scale: 0.85 },
              { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power2.out', duration: 16 },
              tStart + 3
            );
          }

          if (accentBottomRefs.current[idx]) {
            masterTL.fromTo(
              accentBottomRefs.current[idx],
              { opacity: 0, x: 45, y: 35, scale: 0.85 },
              { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power2.out', duration: 16 },
              tStart + 4
            );
          }
        }

        // Continuous Flow Motion & 2.5D Parallax for Images Along the Line While Moving
        if (heroCardRefs.current[idx]) {
          masterTL.to(
            heroCardRefs.current[idx],
            {
              xPercent: -16,
              yPercent: -8,
              ease: 'none',
              duration: 100,
            },
            0
          );
        }

        if (accentTopRefs.current[idx]) {
          masterTL.to(
            accentTopRefs.current[idx],
            {
              xPercent: -32,
              yPercent: -18,
              rotate: -3.5,
              ease: 'none',
              duration: 100,
            },
            0
          );
        }

        if (accentBottomRefs.current[idx]) {
          masterTL.to(
            accentBottomRefs.current[idx],
            {
              xPercent: 26,
              yPercent: 20,
              rotate: 3.5,
              ease: 'none',
              duration: 100,
            },
            0
          );
        }
      });

      // Bottom timeline hairline scrub progress
      if (progressBarRef.current) {
        masterTL.to(
          progressBarRef.current,
          {
            scaleX: 1,
            ease: 'none',
            duration: 100,
          },
          0
        );
      }

      // Intentional UX resting interval after "After Hours" before entering Gallery section (2nd scroll try release)
      masterTL.to({}, { duration: 10 }, 100);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToMilestone = (idx) => {
    const st = masterSTRef.current;
    if (!st) return;
    // Glide finishes at 100/110 of the timeline duration — mirror the same math
    const glideScroll = (st.end - st.start) * (100 / 110);
    const targetScroll = st.start + (idx / (JOURNEY_MILESTONES.length - 1)) * glideScroll;

    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(targetScroll, {
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Lock scroll (Lenis-aware) while the RSVP modal is open + a11y focus trap
  useModalA11y(Boolean(selectedMilestone), () => setSelectedMilestone(null), rsvpModalRef);

  useEffect(() => {
    if (selectedMilestone) {
      setRsvpSubmitted(false);
      window.__lenis?.stop?.();
    } else {
      window.__lenis?.start?.();
    }

    return () => {
      window.__lenis?.start?.();
    };
  }, [selectedMilestone]);

  useEffect(() => () => clearTimeout(closeTimeoutRef.current), []);

  return (
    <section ref={sectionRef} id="journey" className="journey-section">
      {/* Pinned Full-Screen Horizontal Stage */}
      <div ref={stageRef} className="journey-stage">
        {/* Subtle Atmospheric Background Glow & Texture */}
        <div className="journey-bg-ambient" aria-hidden="true" />

        {/* Top Header Badge */}
        <div className="journey-top-bar">
          <div className="journey-eyebrow-capsule">
            <span className="journey-eyebrow-label">HOSTED CELEBRATIONS</span>
            <span className="journey-eyebrow-divider" />
            <span className="journey-eyebrow-sub">FIVE SIGNATURE MOMENTS · A CURATED CELEBRATION</span>
          </div>

          <div className="journey-live-counter">
            <span className="counter-dot" />
            <span className="counter-text">
              CELEBRATION 0{activeIdx + 1} OF 0{JOURNEY_MILESTONES.length}
            </span>
          </div>
        </div>

        {/* Horizontal Track of Event Panels */}
        <div ref={trackRef} className="journey-track">
          {/* Continuous Golden Timeline Wave SVG (Spanning all 5 slides inside track) */}
          <div className="journey-wave-wrapper" aria-hidden="true">
            <svg
              className="journey-wave-svg"
              viewBox="0 0 5000 1000"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                {/* Razor-thin, smooth GPU-interpolated flow gradient with long feathered falloff */}
                <linearGradient
                  id="flowThreadGrad"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  ref={flowGradRef}
                >
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="72%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="84%" stopColor="#FFF2D6" stopOpacity="0.85" />
                  <stop offset="93%" stopColor="#E5CA96" stopOpacity="0.45" />
                  <stop offset="98%" stopColor="#C9A26B" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#C9A26B" stopOpacity="0" />
                </linearGradient>

                {/* Subtle delicate halation filter */}
                <filter id="threadMicroGlow" x="-10%" y="-30%" width="120%" height="160%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ========================================================= */}
              {/* LAYER 1: Muted Faint Dark Base Track (Across entire track) */}
              {/* ========================================================= */}
              <g className="wave-faded-base-group">
                <path
                  d={WAVE_PATH_DATA}
                  stroke="#F0E8D0"
                  strokeWidth="0.75"
                  strokeOpacity="0.16"
                  strokeLinecap="round"
                />
              </g>

              {/* ========================================================= */}
              {/* LAYER 2: Illuminated Flowing Thread with Long Feather     */}
              {/* ========================================================= */}
              <g className="wave-highlight-progress-group">
                {/* Delicate micro-glow */}
                <path
                  d={WAVE_PATH_DATA}
                  stroke="url(#flowThreadGrad)"
                  strokeWidth="1.8"
                  strokeOpacity="0.32"
                  filter="url(#threadMicroGlow)"
                  strokeLinecap="round"
                />

                {/* Razor-thin crisp illuminated core (Matches Reference Image) */}
                <path
                  d={WAVE_PATH_DATA}
                  stroke="url(#flowThreadGrad)"
                  strokeWidth="0.95"
                  strokeOpacity="1"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {JOURNEY_MILESTONES.map((item, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={item.id}
                ref={(el) => {
                  if (el) panelsRef.current[idx] = el;
                }}
                className={`journey-panel ${isActive ? 'is-active' : ''}`}
              >
                <div className="journey-panel-content">
                  {/* LEFT: Large italic category title + above/below line info */}
                  <div className="journey-info-col">
                    <span className="journey-eyebrow-accent">{item.eyebrow}</span>
                    <h2
                      ref={(el) => {
                        if (el) categoryTitleRefs.current[idx] = el;
                      }}
                      className="journey-category-title"
                    >
                      {item.category}
                    </h2>

                    {/* Date + Time — sits cleanly ABOVE the golden line */}
                    <div
                      ref={(el) => {
                        if (el) aboveInfoRefs.current[idx] = el;
                      }}
                      className="journey-above-line-info"
                    >
                      <span className="journey-line-date">{item.date}</span>
                      <span className="journey-line-time">{item.time}</span>
                    </div>

                    {/* Below line: Badge capsule + Subtitle + Description */}
                    <div
                      ref={(el) => {
                        if (el) belowInfoRefs.current[idx] = el;
                      }}
                      className="journey-below-line-info"
                    >
                      <div className="journey-badge-pill">
                        <span className="badge-bullet">✦</span>
                        <span className="badge-text">{item.badge}</span>
                      </div>
                      <h3 className="journey-subtitle">{item.subtitle}</h3>
                      <p className="journey-description">{item.description}</p>
                      <button
                        type="button"
                        className="journey-panel-cta"
                        onClick={() => setSelectedMilestone(item)}
                      >
                        {item.cta}
                        <span className="cta-arrow" aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Overlapping Multi-Image Collage with 2.5D Parallax */}
                  <div className="journey-collage-col">
                    <div className="journey-collage-container">
                      {/* Ambient Soft Bokeh Backlight */}
                      <div className="collage-ambient-glow" aria-hidden="true" />

                      {/* Floating Accent 1 (Top-Left Offset with Parallax) */}
                      <div
                        ref={(el) => {
                          if (el) accentTopRefs.current[idx] = el;
                        }}
                        className="collage-card collage-accent-top"
                      >
                        <div className="collage-card-inner">
                          <img
                            src={item.images.accentTop}
                            alt={`${item.subtitle} Detail`}
                            loading={idx < 2 ? 'eager' : 'lazy'}
                          />
                        </div>
                      </div>

                      {/* Dominant Primary Hero Image */}
                      <div
                        ref={(el) => {
                          if (el) heroCardRefs.current[idx] = el;
                        }}
                        className="collage-card collage-primary-hero"
                      >
                        <div className="collage-card-inner">
                          <img
                            src={item.images.primary}
                            alt={item.subtitle}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                          />
                          {/* Delicate Vignette Feather Overlay */}
                          <div className="collage-vignette-overlay" aria-hidden="true" />
                        </div>
                      </div>

                      {/* Floating Accent 2 (Bottom-Right Offset with Parallax) */}
                      <div
                        ref={(el) => {
                          if (el) accentBottomRefs.current[idx] = el;
                        }}
                        className="collage-card collage-accent-bottom"
                      >
                        <div className="collage-card-inner">
                          <img
                            src={item.images.accentBottom}
                            alt={`${item.subtitle} Perspective`}
                            loading={idx < 2 ? 'eager' : 'lazy'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM INTERACTIVE TIMELINE SCRUBBER */}
        <div className="journey-bottom-scrubber">
          {/* Continuous Hairline Progress Track */}
          <div className="journey-scrubber-track">
            <div ref={progressBarRef} className="journey-scrubber-progress" />
          </div>

          {/* Interactive Milestone Navigation Nodes */}
          <div className="journey-milestone-nodes">
            {JOURNEY_MILESTONES.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`milestone-node-btn ${isActive ? 'is-current' : ''}`}
                  onClick={() => scrollToMilestone(idx)}
                  aria-label={`Jump to ${item.category}`}
                >
                  <span className="node-indicator">
                    <span className="node-core" />
                  </span>
                  <span className="node-title-label">
                    0{idx + 1} {item.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK RSVP MODAL */}
      {selectedMilestone && (
        <div className="journey-modal-backdrop" onClick={() => setSelectedMilestone(null)}>
          <div
            className="journey-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            ref={rsvpModalRef}
            tabIndex={-1}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedMilestone(null)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="modal-badge-row">
              <span className="modal-gold-tag">✦ {selectedMilestone.badge} ✦</span>
              <span className="modal-capacity">{selectedMilestone.guests}</span>
            </div>

            <h3 className="modal-event-title">{selectedMilestone.subtitle}</h3>
            <p className="modal-event-timing">
              {selectedMilestone.date} · {selectedMilestone.time}
            </p>
            <p className="modal-event-venue">{selectedMilestone.location}</p>

            {rsvpSubmitted ? (
              <div className="rsvp-success" role="status">
                <div className="rsvp-success-mark" aria-hidden="true">
                  <svg viewBox="0 0 52 52" width="52" height="52">
                    <circle className="rsvp-success-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="rsvp-success-check" d="M14 27 L23 36 L38 19" fill="none" />
                  </svg>
                </div>
                <h4 className="rsvp-success-title">Reservation confirmed</h4>
                <p className="rsvp-success-copy">
                  Your pass for <strong>{selectedMilestone.subtitle}</strong> is being prepared.
                  A confirmation will reach your inbox shortly.
                </p>
                <button
                  type="button"
                  className="modal-submit-btn"
                  onClick={() => setSelectedMilestone(null)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                className="modal-rsvp-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setRsvpSubmitted(true);
                  closeTimeoutRef.current = setTimeout(() => setSelectedMilestone(null), 4200);
                }}
              >
              <div className="form-field">
                <label htmlFor="rsvp-name">Full Name</label>
                <input id="rsvp-name" type="text" placeholder="e.g. Helena Vance" required />
              </div>

              <div className="form-field">
                <label htmlFor="rsvp-email">Email Address</label>
                <input id="rsvp-email" type="email" placeholder="name@company.com" required />
              </div>

              <button type="submit" className="modal-submit-btn">
                Confirm Reservation Pass →
              </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
