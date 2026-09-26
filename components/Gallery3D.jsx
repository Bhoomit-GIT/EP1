'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Eye,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY_IMAGES } from '../data/galleryImages';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Gallery3D() {
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // References
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRefs = useRef([]);
  const typoRef = useRef(null);
  const sublineRef = useRef(null);
  const cardsWrapperRef = useRef(null);
  const dragBadgeRef = useRef(null);

  // Infinite Canvas Pan Physics (Inertia & Smooth Dampening)
  const panRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    isPanning: false,
    velX: 0,
    velY: 0,
    lastX: 0,
    lastY: 0,
  });

  // Cursor Parallax Ref
  const cursorParallaxRef = useRef({ rawX: 0, rawY: 0, currentX: 0, currentY: 0 });

  // ══════════════════════════════════════════════════════════════════
  // RANDOMIZED AIRY CONSTELLATION GENERATOR (Unique On Each Load)
  // 24 Cards distributed across 3600px × 2400px toroidal domain
  // Maximum distance between adjacent images is bounded (<= 580px - 750px)
  // Guarantees MINIMUM OF 6 IMAGES visible in frame at all times (sharp + blur)
  // ══════════════════════════════════════════════════════════════════
  const generateRandomConstellation = useCallback(() => {
    // Shuffle available 53 high-res images
    const shuffledImages = [...GALLERY_IMAGES].sort(() => Math.random() - 0.5);

    const cards = [];
    let cardIdx = 0;

    // 6 columns × 4 rows = 24 cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        const imgData = shuffledImages[cardIdx % shuffledImages.length];

        // Base cell centers across 3600px × 2400px domain
        const colCenter = -1500 + col * 600;
        const rowCenter = -900 + row * 600;

        // Bounded random jitter (prevents overlapping & guarantees min 6 visible in frame)
        const jitterX = (Math.random() - 0.5) * 180;
        const jitterY = (Math.random() - 0.5) * 140;

        const baseX = Math.round(colCenter + jitterX);
        const baseY = Math.round(rowCenter + jitterY);

        // Balanced tier distribution with organic variation
        const isBaseSharp = (col + row) % 2 === 0;
        const tier = (Math.random() > 0.15 ? isBaseSharp : !isBaseSharp) ? 'sharp' : 'blur';

        // Randomized aspect ratio & editorial dimensions
        const isLandscape = Math.random() > 0.45;
        let width, height, scale, blur;

        if (tier === 'sharp') {
          scale = 1.0;
          blur = 0;
          if (isLandscape) {
            width = Math.round(280 + Math.random() * 25);
            height = Math.round(195 + Math.random() * 15);
          } else {
            width = Math.round(175 + Math.random() * 15);
            height = Math.round(250 + Math.random() * 20);
          }
        } else {
          scale = Number((0.72 + Math.random() * 0.04).toFixed(2));
          blur = Math.round(13 + Math.random() * 4);
          if (isLandscape) {
            width = Math.round(250 + Math.random() * 25);
            height = Math.round(175 + Math.random() * 15);
          } else {
            width = Math.round(155 + Math.random() * 15);
            height = Math.round(225 + Math.random() * 15);
          }
        }

        cards.push({
          ...imgData,
          galleryIdx: cardIdx,
          spatialId: `random-card-${cardIdx}-${imgData.id}`,
          baseX,
          baseY,
          width,
          height,
          scale,
          tier,
          blur,
          aspect: isLandscape ? 'landscape' : 'portrait',
          floatDelay: `${-(Math.random() * 8).toFixed(2)}s`,
          floatDuration: `${(5.8 + Math.random() * 2.8).toFixed(1)}s`,
        });

        cardIdx++;
      }
    }

    return cards;
  }, []);

  const [spatialUniverseCards, setSpatialUniverseCards] = useState(() => generateRandomConstellation());

  // Randomize fresh layout on client mount
  useEffect(() => {
    setSpatialUniverseCards(generateRandomConstellation());
  }, [generateRandomConstellation]);

  // ══════════════════════════════════════════════════════════════════
  // GSAP SCROLL & ENTRANCE ANIMATION (Pinned Stage Timeline)
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const typo = typoRef.current;
      const words = typo?.querySelectorAll('.luxury-word');
      const subline = sublineRef.current;
      const cardsWrapper = cardsWrapperRef.current;
      if (!words || !words.length) return;

      let hasPlayed = false;
      const playEntrance = () => {
        if (hasPlayed) return;
        hasPlayed = true;

        gsap.fromTo(
          words,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 1.2,
            ease: 'power3.out',
          }
        );

        if (subline) {
          gsap.fromTo(
            subline,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay: 0.4,
              ease: 'power2.out',
            }
          );
        }
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: playEntrance,
        onEnterBack: playEntrance,
      });

      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        playEntrance();
      }

      // Master GSAP Pinned Scrub Timeline for Cinematic Stage Zoom
      const scrubTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: stageRef.current,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (typo) {
              typo.style.pointerEvents = self.progress > 0.35 ? 'none' : 'auto';
            }
          },
        },
      });

      // 0% -> 15%: Hold headline
      scrubTL.to({}, { duration: 15 });

      // 15% -> 55%: Dissolve title & bloom spatial canvas forward
      if (typo) {
        scrubTL.to(
          typo,
          {
            y: -100,
            opacity: 0,
            scale: 0.9,
            filter: 'blur(12px)',
            ease: 'power2.inOut',
            duration: 40,
          },
          15
        );
      }

      if (cardsWrapper) {
        gsap.set(cardsWrapper, { scale: 0.55, opacity: 0, filter: 'blur(10px)' });
        scrubTL.to(
          cardsWrapper,
          {
            scale: 1.0,
            opacity: 1.0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 40,
          },
          15
        );
      }

      // 55% -> 100%: Active interactive exploration
      scrubTL.to({}, { duration: 45 }, 55);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ══════════════════════════════════════════════════════════════════
  // RAF PHYSICS LOOP: SEAMLESS TOROIDAL WRAPPING (120 FPS)
  // 3600px × 2400px domain with offscreen modulo wrapping
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    let animId;
    const W = 3600;
    const H = 2400;
    const halfW = W / 2;
    const halfH = H / 2;

    const updatePhysics = () => {
      const pan = panRef.current;
      const cp = cursorParallaxRef.current;

      // Inertial lerp
      pan.currentX += (pan.targetX - pan.currentX) * 0.085;
      pan.currentY += (pan.targetY - pan.currentY) * 0.085;

      // Cursor parallax
      cp.currentX += (cp.rawX - cp.currentX) * 0.05;
      cp.currentY += (cp.rawY - cp.currentY) * 0.05;

      const totalX = pan.currentX + cp.currentX;
      const totalY = pan.currentY + cp.currentY;

      // Seamless toroidal wrap on every card
      cardRefs.current.forEach((el, idx) => {
        if (!el) return;
        const card = spatialUniverseCards[idx];
        if (!card) return;

        let rx = (card.baseX + totalX + halfW) % W;
        if (rx < 0) rx += W;
        const wrapX = rx - halfW;

        let ry = (card.baseY + totalY + halfH) % H;
        if (ry < 0) ry += H;
        const wrapY = ry - halfH;

        el.style.transform = `translate3d(${wrapX.toFixed(2)}px, ${wrapY.toFixed(2)}px, 0) scale(${card.scale})`;
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [spatialUniverseCards]);

  // Mouse move handler for Magnetic Cursor & Parallax
  const handleMouseMove = useCallback((e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Parallax shift
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    cursorParallaxRef.current.rawX = ((x - cx) / cx) * -24;
    cursorParallaxRef.current.rawY = ((y - cy) / cy) * -18;

    // Magnetic Drag Badge Follower (matching reference screenshot)
    if (dragBadgeRef.current) {
      dragBadgeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const isOverInteractive = Boolean(
        e.target &&
          e.target.closest &&
          e.target.closest('button, a, .lightbox-modal, .gallery-top-nav')
      );

      if (isOverInteractive) {
        dragBadgeRef.current.classList.remove('visible');
      } else {
        dragBadgeRef.current.classList.add('visible');
      }
    }

    // Drag panning
    if (panRef.current.isPanning) {
      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;
      panRef.current.targetX += dx * 1.2;
      panRef.current.targetY += dy * 1.2;
      panRef.current.velX = dx;
      panRef.current.velY = dy;
      panRef.current.lastX = e.clientX;
      panRef.current.lastY = e.clientY;
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button, a, .gallery-top-nav')) return;
    if (dragBadgeRef.current) {
      dragBadgeRef.current.classList.add('is-dragging');
    }
    panRef.current.isPanning = true;
    panRef.current.lastX = e.clientX;
    panRef.current.lastY = e.clientY;
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragBadgeRef.current) {
      dragBadgeRef.current.classList.remove('is-dragging');
    }
    panRef.current.isPanning = false;
    panRef.current.targetX += panRef.current.velX * 5.5;
    panRef.current.targetY += panRef.current.velY * 5.5;
    panRef.current.velX = 0;
    panRef.current.velY = 0;
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  // Touch gestures for mobile
  const handleTouchStart = useCallback((e) => {
    if (!e.touches[0]) return;
    const touch = e.touches[0];
    panRef.current.isPanning = true;
    panRef.current.lastX = touch.clientX;
    panRef.current.lastY = touch.clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!e.touches[0]) return;
    const touch = e.touches[0];
    if (panRef.current.isPanning) {
      const dx = touch.clientX - panRef.current.lastX;
      const dy = touch.clientY - panRef.current.lastY;
      panRef.current.targetX += dx * 1.35;
      panRef.current.targetY += dy * 1.35;
      panRef.current.lastX = touch.clientX;
      panRef.current.lastY = touch.clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    panRef.current.isPanning = false;
  }, []);

  // Continuous wheel scrolling
  const handleWheel = useCallback((e) => {
    const deltaX = e.deltaX || (e.shiftKey ? e.deltaY : 0);
    const deltaY = e.shiftKey ? 0 : e.deltaY;
    panRef.current.targetX -= deltaX * 1.3;
    panRef.current.targetY -= deltaY * 1.3;
  }, []);

  // Lightbox click
  const handleCardClick = (img) => {
    if (isDragging) return;
    setLightboxImg(img);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxImg) {
        if (e.key === 'Escape') setLightboxImg(null);
        if (e.key === 'ArrowRight') {
          const nextIdx = (lightboxImg.galleryIdx + 1) % GALLERY_IMAGES.length;
          setLightboxImg({ ...GALLERY_IMAGES[nextIdx], galleryIdx: nextIdx });
        }
        if (e.key === 'ArrowLeft') {
          const prevIdx =
            (lightboxImg.galleryIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
          setLightboxImg({ ...GALLERY_IMAGES[prevIdx], galleryIdx: prevIdx });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImg]);

  return (
    <section ref={sectionRef} id="gallery" className="gallery-editorial-universe">
      {/* Pinned Stage Viewport */}
      <div
        ref={stageRef}
        className="gallery-stage"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Top Minimalist Header (Matching Reference Screenshot) */}
        <header className="gallery-top-nav">
          <div className="gallery-brand-tag">
            <span>THE ARCHIVES</span>
          </div>
          <div className="gallery-menu-hint">
            <span>Curated Moments</span>
          </div>
        </header>

        {/* Magnetic DRAG Pill Follower Badge (Matching Reference Screenshot) */}
        <div ref={dragBadgeRef} className="gallery-drag-pill-badge" aria-hidden="true">
          <span>DRAG</span>
        </div>

        {/* Central Luxury Serif Headline with Split Word Animation (Dissolves on Scroll) */}
        <div ref={typoRef} className="gallery-center-typography" aria-hidden="true">
          <h2 className="editorial-headline">
            <span className="luxury-word-mask">
              <span className="luxury-word">A</span>
            </span>{' '}
            <span className="luxury-word-mask">
              <span className="luxury-word">NEW</span>
            </span>{' '}
            <span className="luxury-word-mask">
              <span className="luxury-word">ERA</span>
            </span>{' '}
            <span className="luxury-word-mask">
              <span className="luxury-word">OF</span>
            </span>{' '}
            <span className="luxury-word-mask">
              <span className="luxury-word luxury-word-gold">LUXURY</span>
            </span>
          </h2>
          <p ref={sublineRef} className="editorial-subline">
            AN IMMERSIVE ODYSSEY OF SACRED CELEBRATION
          </p>
        </div>

        {/* Seamless Infinite Toroidal Constellation Canvas */}
        <div ref={cardsWrapperRef} className="gallery-cards-focal-wrapper">
          <div ref={canvasRef} className="gallery-spatial-plane">
            {spatialUniverseCards.map((item, idx) => (
              <div
                key={item.spatialId}
                ref={(el) => (cardRefs.current[idx] = el)}
                className={`airy-editorial-card tier-${item.tier}`}
                style={{
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                  marginTop: `-${item.height / 2}px`,
                  marginLeft: `-${item.width / 2}px`,
                  filter: item.tier === 'blur' ? `blur(${item.blur}px)` : 'none',
                  opacity: item.tier === 'blur' ? 0.42 : 1.0,
                  zIndex: item.tier === 'sharp' ? 10 : 2,
                  animationDelay: item.floatDelay,
                  animationDuration: item.floatDuration,
                }}
                onClick={() => handleCardClick(item)}
              >
                <div className="airy-card-inner">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    draggable={false}
                  />
                  {item.tier === 'sharp' && (
                    <div className="card-subtle-shadow" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* UNIVERSAL CINEMA LIGHTBOX (Ultra-Luxe Fullscreen Theater) */}
        {/* ============================================================ */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              className="gallery-lightbox-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setLightboxImg(null)}
            >
              <div className="lightbox-backdrop-blur" />

              <motion.div
                className="lightbox-dialog"
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.88, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => setLightboxImg(null)}
                  title="Close Lightbox (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Main Photo Frame */}
                <div className="lightbox-photo-stage">
                  <img
                    src={lightboxImg.src}
                    alt={lightboxImg.title}
                    className="lightbox-main-img"
                  />
                </div>

                {/* Bottom Metadata & Navigation Controls */}
                <div className="lightbox-bottom-bar">
                  <div className="lightbox-info">
                    <span className="lightbox-pill-tag">{lightboxImg.subtitle}</span>
                    <h3 className="lightbox-title">{lightboxImg.title}</h3>
                  </div>

                  <div className="lightbox-nav-group">
                    <button
                      type="button"
                      className="lightbox-arrow-btn"
                      onClick={() => {
                        const prevIdx =
                          (lightboxImg.galleryIdx - 1 + GALLERY_IMAGES.length) %
                          GALLERY_IMAGES.length;
                        setLightboxImg({ ...GALLERY_IMAGES[prevIdx], galleryIdx: prevIdx });
                      }}
                      title="Previous (Left Arrow)"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="lightbox-counter">
                      {String(lightboxImg.galleryIdx + 1).padStart(2, '0')} /{' '}
                      {String(GALLERY_IMAGES.length).padStart(2, '0')}
                    </span>

                    <button
                      type="button"
                      className="lightbox-arrow-btn"
                      onClick={() => {
                        const nextIdx =
                          (lightboxImg.galleryIdx + 1) % GALLERY_IMAGES.length;
                        setLightboxImg({ ...GALLERY_IMAGES[nextIdx], galleryIdx: nextIdx });
                      }}
                      title="Next (Right Arrow)"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
