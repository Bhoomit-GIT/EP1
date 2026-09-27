'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Maximize2,
  Sparkles,
  Grid,
  Compass,
  Eye,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY_IMAGES } from '../data/galleryImages';
import useModalA11y from './useModalA11y';

// Curated Category Definitions
const CATEGORIES = [
  { id: 'all', label: 'All Archives', icon: Sparkles },
  { id: 'royal', label: 'Royal Unions', icon: Compass },
  { id: 'rituals', label: 'Sacred Rituals', icon: Layers },
  { id: 'galas', label: 'Grand Galas', icon: Maximize2 },
  { id: 'couture', label: 'Bespoke Couture', icon: Grid },
];

export default function Gallery3D() {
  // Presentation modes: 'spatial' (Infinite Continuous Universe), 'runway' (3D Coverflow Deck), 'mosaic' (Haute Couture Grid)
  const [mode, setMode] = useState('spatial');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
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
  const titleBackdropRef = useRef(null);
  const dragBadgeRef = useRef(null);
  const badgeTextRef = useRef(null);
  const lightboxDialogRef = useRef(null);

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

  // 3D Deck Touch/Drag Physics
  const deckRef = useRef({
    startX: 0,
    isDragging: false,
  });

  // Refs for pinned-state tracking (avoids re-subscribing wheel on state changes)
  const isPinnedRef = useRef(false);
  const modeRef = useRef(mode);
  const lightboxImgRef = useRef(null);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    lightboxImgRef.current = lightboxImg;
  }, [lightboxImg]);

  // Tag images with categories
  const enrichedImages = useMemo(() => {
    return GALLERY_IMAGES.map((img, idx) => {
      let category = 'royal';
      const sub = (img.subtitle || '').toLowerCase();

      if (
        sub.includes('ritual') ||
        sub.includes('pheras') ||
        sub.includes('haldi') ||
        sub.includes('mehndi') ||
        sub.includes('gathbandhan') ||
        sub.includes('fire') ||
        sub.includes('candle')
      ) {
        category = 'rituals';
      } else if (
        sub.includes('gala') ||
        sub.includes('soirée') ||
        sub.includes('banquet') ||
        sub.includes('sangeet') ||
        sub.includes('cocktail') ||
        sub.includes('dance') ||
        sub.includes('night') ||
        sub.includes('festivity')
      ) {
        category = 'galas';
      } else if (
        sub.includes('couture') ||
        sub.includes('ensemble') ||
        sub.includes('arch') ||
        sub.includes('floral') ||
        sub.includes('bridal') ||
        sub.includes('decor') ||
        sub.includes('design') ||
        sub.includes('suite')
      ) {
        category = 'couture';
      } else {
        category = 'royal';
      }

      return {
        ...img,
        galleryIdx: idx,
        category,
      };
    });
  }, []);

  // Filtered list for Mosaic mode
  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return enrichedImages;
    return enrichedImages.filter((img) => img.category === activeCategory);
  }, [enrichedImages, activeCategory]);

  // ══════════════════════════════════════════════════════════════════
  // PROCEDURAL RANDOMIZED CONSTELLATION GENERATOR
  // - Calibrated max distance so min of 6 images are always visible in frame (including blurry images)
  // - Enforced min distance (380px) so images are never too close
  // - Randomized position, aspect (portrait/landscape), and blur tiers each load
  // - Infinite toroidal wrapping across W = 3200, H = 2200
  // ══════════════════════════════════════════════════════════════════
  const [spatialCards, setSpatialCards] = useState([]);

  useEffect(() => {
    const W = 3200;
    const H = 2200;
    const cols = 7;
    const rows = 4;
    const cellW = W / cols; // ~457px
    const cellH = H / rows; // ~550px

    const points = [];
    let imgIdx = Math.floor(Math.random() * enrichedImages.length);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Cell center coordinates in [-W/2, W/2] x [-H/2, H/2]
        const cellCenterX = -W / 2 + (c + 0.5) * cellW;
        const cellCenterY = -H / 2 + (r + 0.5) * cellH;

        // Controlled random jitter within cell
        const jitterX = (Math.random() - 0.5) * (cellW * 0.45);
        const jitterY = (Math.random() - 0.5) * (cellH * 0.45);

        const x = Math.round(cellCenterX + jitterX);
        const y = Math.round(cellCenterY + jitterY);

        const isLandscape = Math.random() > 0.5;
        const isBlurry = Math.random() > 0.52; // ~48% blurry, ~52% sharp

        const img = enrichedImages[imgIdx % enrichedImages.length];
        imgIdx++;

        points.push({
          ...img,
          spatialId: `card-${r}-${c}-${img.id}-${Math.random().toString(36).substring(2, 7)}`,
          baseX: x,
          baseY: y,
          aspect: isLandscape ? 'landscape' : 'portrait',
          isBlurry,
          tier: isBlurry ? 'ambient' : 'hero',
          scale: isBlurry ? 0.78 + Math.random() * 0.08 : 0.98 + Math.random() * 0.08,
          floatDelay: `${-(Math.random() * 6).toFixed(2)}s`,
          floatDuration: `${(6.0 + Math.random() * 2.5).toFixed(1)}s`,
        });
      }
    }

    // Relaxation passes to guarantee minimum 380px distance between any two images
    const minDistance = 380;
    for (let pass = 0; pass < 5; pass++) {
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[j].baseX - points[i].baseX;
          const dy = points[j].baseY - points[i].baseY;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < minDistance) {
            const overlap = (minDistance - dist) / 2;
            const nx = (dx / dist) * overlap;
            const ny = (dy / dist) * overlap;
            points[i].baseX = Math.round(points[i].baseX - nx);
            points[i].baseY = Math.round(points[i].baseY - ny);
            points[j].baseX = Math.round(points[j].baseX + nx);
            points[j].baseY = Math.round(points[j].baseY + ny);
          }
        }
      }
    }

    setSpatialCards(points);
  }, [enrichedImages]);

  // Initial title backdrop cards (subtly framing before scroll zoom)
  const titleBackdropCards = useMemo(() => {
    const layout = [
      { x: -420, y: -220, scale: 0.92, blur: 2 },
      { x:  420, y: -220, scale: 0.92, blur: 2 },
      { x: -420, y:  220, scale: 0.92, blur: 2 },
      { x:  420, y:  220, scale: 0.92, blur: 2 },
      { x: -180, y: -310, scale: 0.78, blur: 4 },
      { x:  180, y: -310, scale: 0.78, blur: 4 },
    ];
    return layout.map((l, idx) => ({
      ...enrichedImages[idx % enrichedImages.length],
      ...l,
    }));
  }, [enrichedImages]);

  // ══════════════════════════════════════════════════════════════════
  // GSAP SCROLL & ENTRANCE ANIMATION (Pinned Stage Timeline)
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
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
            // Track pinned state so wheel-hijack only runs while the stage is active
            isPinnedRef.current = self.progress > 0 && self.progress < 1;
          },
        },
      });

      // 0% -> 15%: Hold headline
      scrubTL.to({}, { duration: 15 });

      // 15% -> 60%: Dissolve title + backdrop & bloom spatial canvas forward
      if (typo) {
        scrubTL.to(
          typo,
          {
            y: -120,
            opacity: 0,
            scale: 0.88,
            filter: 'blur(14px)',
            ease: 'power2.inOut',
            duration: 45,
          },
          15
        );
      }

      if (titleBackdropRef.current) {
        scrubTL.to(
          titleBackdropRef.current,
          {
            scale: 1.75,
            opacity: 0,
            filter: 'blur(12px)',
            ease: 'power2.inOut',
            duration: 45,
          },
          15
        );
      }

      if (cardsWrapper) {
        gsap.set(cardsWrapper, { scale: 0.45, opacity: 0, filter: 'blur(12px)' });
        scrubTL.to(
          cardsWrapper,
          {
            scale: 1.0,
            opacity: 1.0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 45,
          },
          15
        );
      }

      // 60% -> 100%: Active interactive exploration
      scrubTL.to({}, { duration: 40 }, 60);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ══════════════════════════════════════════════════════════════════
  // RAF PHYSICS LOOP: SEAMLESS TOROIDAL WRAPPING (120 FPS)
  // Continuous wrapping across W = 3200px × H = 2200px domain
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    let animId;
    const W = 3200;
    const H = 2200;
    const halfW = W / 2;
    const halfH = H / 2;

    const updatePhysics = () => {
      // Skip work entirely when the tab is hidden
      if (document.hidden) {
        animId = requestAnimationFrame(updatePhysics);
        return;
      }

      if (mode === 'spatial') {
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

        // Seamless wrap each card element directly
        cardRefs.current.forEach((el, idx) => {
          if (!el) return;
          const card = spatialCards[idx];
          if (!card) return;

          // Infinite toroidal wrap math
          let rx = (card.baseX + totalX + halfW) % W;
          if (rx < 0) rx += W;
          const wrapX = rx - halfW;

          let ry = (card.baseY + totalY + halfH) % H;
          if (ry < 0) ry += H;
          const wrapY = ry - halfH;

          el.style.transform = `translate3d(${wrapX.toFixed(2)}px, ${wrapY.toFixed(2)}px, 0) scale(${card.scale})`;
        });
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [mode, spatialCards]);

  // Mouse move handler for Magnetic Cursor & Parallax
  const handleMouseMove = useCallback(
    (e) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Parallax shift
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      cursorParallaxRef.current.rawX = ((x - cx) / cx) * -24;
      cursorParallaxRef.current.rawY = ((y - cy) / cy) * -18;

      // Magnetic Drag Badge
      if (dragBadgeRef.current) {
        dragBadgeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        const isOverInteractive = Boolean(
          e.target &&
            e.target.closest &&
            e.target.closest(
              'button, a, .gallery-header-bar, .gallery-categories-bar, .deck3d-controls-bar, .lightbox-modal, .mosaic-card-shell'
            )
        );

        if (isOverInteractive || mode !== 'spatial') {
          dragBadgeRef.current.classList.remove('visible');
        } else {
          dragBadgeRef.current.classList.add('visible');
          if (badgeTextRef.current) {
            badgeTextRef.current.textContent = 'DRAG';
          }
        }
      }

      // Drag panning
      if (panRef.current.isPanning) {
        const dx = e.clientX - panRef.current.lastX;
        const dy = e.clientY - panRef.current.lastY;
        panRef.current.targetX += dx * 1.15;
        panRef.current.targetY += dy * 1.15;
        panRef.current.velX = dx;
        panRef.current.velY = dy;
        panRef.current.lastX = e.clientX;
        panRef.current.lastY = e.clientY;
      }
    },
    [mode]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest('button, a, .gallery-categories-bar, .gallery-mode-switch')) return;
      if (dragBadgeRef.current) {
        dragBadgeRef.current.classList.add('is-dragging');
      }
      if (mode === 'spatial') {
        panRef.current.isPanning = true;
        panRef.current.lastX = e.clientX;
        panRef.current.lastY = e.clientY;
        setIsDragging(true);
      } else if (mode === 'runway') {
        deckRef.current.isDragging = true;
        deckRef.current.startX = e.clientX;
        setIsDragging(true);
      }
    },
    [mode]
  );

  const handleMouseUp = useCallback(() => {
    if (dragBadgeRef.current) {
      dragBadgeRef.current.classList.remove('is-dragging');
    }
    if (mode === 'spatial') {
      panRef.current.isPanning = false;
      panRef.current.targetX += panRef.current.velX * 5.5;
      panRef.current.targetY += panRef.current.velY * 5.5;
      panRef.current.velX = 0;
      panRef.current.velY = 0;
      setTimeout(() => setIsDragging(false), 50);
    } else if (mode === 'runway') {
      deckRef.current.isDragging = false;
      setTimeout(() => setIsDragging(false), 50);
    }
  }, [mode]);

  // Touch gestures for mobile devices
  const handleTouchStart = useCallback(
    (e) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      if (mode === 'spatial') {
        panRef.current.isPanning = true;
        panRef.current.lastX = touch.clientX;
        panRef.current.lastY = touch.clientY;
      } else if (mode === 'runway') {
        deckRef.current.isDragging = true;
        deckRef.current.startX = touch.clientX;
      }
    },
    [mode]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      if (mode === 'spatial' && panRef.current.isPanning) {
        const dx = touch.clientX - panRef.current.lastX;
        const dy = touch.clientY - panRef.current.lastY;
        panRef.current.targetX += dx * 1.35;
        panRef.current.targetY += dy * 1.35;
        panRef.current.lastX = touch.clientX;
        panRef.current.lastY = touch.clientY;
      } else if (mode === 'runway' && deckRef.current.isDragging) {
        const dx = touch.clientX - deckRef.current.startX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) {
            setActiveIndex((prev) => (prev + 1) % enrichedImages.length);
          } else {
            setActiveIndex((prev) => (prev - 1 + enrichedImages.length) % enrichedImages.length);
          }
          deckRef.current.startX = touch.clientX;
        }
      }
    },
    [mode, enrichedImages.length]
  );

  const handleTouchEnd = useCallback(() => {
    if (mode === 'spatial') {
      panRef.current.isPanning = false;
    } else if (mode === 'runway') {
      deckRef.current.isDragging = false;
    }
  }, [mode]);

  // Wheel navigation for infinite continuous scroll
  const handleWheel = useCallback(
    (e) => {
      const activeMode = modeRef.current;
      const isModalOpen = Boolean(lightboxImgRef.current);

      if (activeMode === 'spatial') {
        // Only pan while the pinned stage is active — otherwise let the page scroll normally
        if (!isPinnedRef.current || isModalOpen) return;
        e.preventDefault();
        // Continuous wheel scrolling pans the infinite canvas
        const deltaX = e.deltaX || (e.shiftKey ? e.deltaY : 0);
        const deltaY = e.shiftKey ? 0 : e.deltaY;
        panRef.current.targetX -= deltaX * 1.25;
        panRef.current.targetY -= deltaY * 1.25;
      } else if (activeMode === 'runway') {
        if (!isPinnedRef.current || isModalOpen) return;
        if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
          if (e.deltaY > 0 || e.deltaX > 0) {
            setActiveIndex((prev) => (prev + 1) % enrichedImages.length);
          } else {
            setActiveIndex((prev) => (prev - 1 + enrichedImages.length) % enrichedImages.length);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enrichedImages.length]
  );

  // Native non-passive wheel listener so preventDefault() actually works
  // (React's synthetic onWheel is passive on modern browsers)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => stage.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Open Lightbox
  const handleCardClick = (img) => {
    if (isDragging) return;
    setLightboxImg(img);
  };

  useModalA11y(Boolean(lightboxImg), () => setLightboxImg(null), lightboxDialogRef);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxImg) {
        if (e.key === 'Escape') setLightboxImg(null);
        if (e.key === 'ArrowRight') {
          const nextIdx = (lightboxImg.galleryIdx + 1) % enrichedImages.length;
          setLightboxImg(enrichedImages[nextIdx]);
        }
        if (e.key === 'ArrowLeft') {
          const prevIdx =
            (lightboxImg.galleryIdx - 1 + enrichedImages.length) % enrichedImages.length;
          setLightboxImg(enrichedImages[prevIdx]);
        }
        return;
      }

      if (mode === 'runway') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          setActiveIndex((prev) => (prev + 1) % enrichedImages.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          setActiveIndex((prev) => (prev - 1 + enrichedImages.length) % enrichedImages.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImg, mode, enrichedImages]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className={`gallery-luxury-universe mode-${mode}`}
    >
      {/* Pinned Stage Viewport */}
      <div
        ref={stageRef}
        className="gallery-stage"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (dragBadgeRef.current) {
            dragBadgeRef.current.classList.remove('visible');
            dragBadgeRef.current.classList.remove('is-dragging');
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Cosmic Star Dust Particles */}
        <div className="gallery-ambient-particles" aria-hidden="true">
          <div className="ambient-glow-orb orb-gold-1" />
          <div className="ambient-glow-orb orb-gold-2" />
        </div>

        {/* ── Top Header Navigation Bar ──────────────────────────────── */}
        <header className="gallery-header-bar">
          <div className="gallery-eyebrow-capsule">
            <span className="gallery-eyebrow-tag">ROYAL ARCHIVES</span>
            <span className="gallery-eyebrow-dot" />
            <span className="gallery-eyebrow-title">
              {enrichedImages.length} BESPOKE MOMENTS
            </span>
          </div>

          {/* Mode Switcher Pill */}
          <div className="gallery-mode-switch">
            <button
              type="button"
              className={`mode-btn ${mode === 'spatial' ? 'active' : ''}`}
              onClick={() => setMode('spatial')}
              title="Endless Spatial Universe"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>SPATIAL</span>
            </button>

            <button
              type="button"
              className={`mode-btn ${mode === 'runway' ? 'active' : ''}`}
              onClick={() => setMode('runway')}
              title="3D Perspective Runway Deck"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>3D RUNWAY</span>
            </button>

            <button
              type="button"
              className={`mode-btn ${mode === 'mosaic' ? 'active' : ''}`}
              onClick={() => setMode('mosaic')}
              title="Editorial Haute Couture Masonry"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>EDITORIAL</span>
            </button>
          </div>
        </header>

        {/* ── Category Filter Pills (Shown in Mosaic Mode) ─────────── */}
        {mode === 'mosaic' && (
          <motion.div
            className="gallery-categories-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const count =
                cat.id === 'all'
                  ? enrichedImages.length
                  : enrichedImages.filter((img) => img.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className="category-count">{count}</span>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* ── Magnetic Custom Follower Badge ────────────────────────── */}
        {mode === 'spatial' && (
          <div ref={dragBadgeRef} className="gallery-magnetic-badge" aria-hidden="true">
            <span ref={badgeTextRef}>DRAG</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* PRESENTATION MODE 1: SPATIAL UNIVERSE (Infinite Continuous Horizon) */}
        {/* ============================================================ */}
        <AnimatePresence>
          {mode === 'spatial' && (
            <motion.div
              key="spatial-universe-view"
              className="gallery-spatial-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Initial Title Backdrop Cards (dissolves on scroll) */}
              <div
                ref={titleBackdropRef}
                className="gallery-title-backdrop-plane"
                aria-hidden="true"
              >
                {titleBackdropCards.map((img, idx) => (
                  <div
                    key={`title-bg-${idx}-${img.id}`}
                    className="title-backdrop-card"
                    style={{
                      transform: `translate3d(${img.x}px, ${img.y}px, 0) scale(${img.scale})`,
                      filter: `blur(${img.blur}px)`,
                    }}
                  >
                    <div className="card-image-shell">
                      <img src={img.src} alt={img.title} draggable={false} />
                      <div className="card-ambient-shadow" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Central Luxury Serif Headline with Split Word Animation */}
              <div ref={typoRef} className="gallery-center-typography" aria-hidden="true">
                <h2 className="luxury-headline">
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
                <p ref={sublineRef} className="luxury-subline">
                  AN IMMERSIVE ODYSSEY OF SACRED CELEBRATION
                </p>
              </div>

              {/* Seamless Infinite Toroidal Constellation Canvas */}
              <div ref={cardsWrapperRef} className="gallery-cards-focal-wrapper">
                <div ref={canvasRef} className="gallery-spatial-plane">
                  {spatialCards.map((item, idx) => (
                    <div
                      key={item.spatialId}
                      ref={(el) => (cardRefs.current[idx] = el)}
                      className={`spatial-card tier-${item.tier} aspect-${item.aspect}`}
                      style={{
                        animationDelay: item.floatDelay,
                        animationDuration: item.floatDuration,
                      }}
                      onClick={() => handleCardClick(item)}
                    >
                      <div className="spatial-card-inner">
                        <img
                          src={item.src}
                          alt={item.title}
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="card-ambient-shadow" />
                        <div className="card-gold-border-glow" />

                        {/* Hover Metadata Pill */}
                        <div className="spatial-card-caption">
                          <span className="caption-sub">{item.subtitle}</span>
                          <h4 className="caption-title">{item.title}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* PRESENTATION MODE 2: 3D RUNWAY DECK (Infinite Looping Coverflow) */}
        {/* ============================================================ */}
        <AnimatePresence>
          {mode === 'runway' && (
            <motion.div
              key="runway-3d-view"
              className="gallery-runway-wrapper"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 3D Curved Perspective Stage */}
              <div className="runway-stage-viewport">
                <div className="runway-carousel">
                  {enrichedImages.map((img, idx) => {
                    const diff = idx - activeIndex;
                    const total = enrichedImages.length;
                    
                    // Normalized shortest circular distance for infinite looping
                    let circularDiff = diff;
                    if (circularDiff > total / 2) circularDiff -= total;
                    if (circularDiff < -total / 2) circularDiff += total;

                    const absDiff = Math.abs(circularDiff);

                    // Optimized render window
                    if (absDiff > 6) return null;

                    const translateX = circularDiff * 280;
                    const translateZ = -absDiff * 190;
                    const rotateY = Math.max(-50, Math.min(50, -circularDiff * 35));
                    const scale = Math.max(0.7, 1 - absDiff * 0.08);
                    const opacity = Math.max(0.2, 1 - absDiff * 0.18);
                    const blur = absDiff > 0 ? Math.min(6, absDiff * 1.5) : 0;
                    const zIndex = 50 - absDiff;

                    return (
                      <div
                        key={`runway-${img.id}`}
                        className={`runway-card ${absDiff === 0 ? 'is-active' : ''}`}
                        style={{
                          transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                          zIndex,
                          opacity,
                          filter: blur > 0 ? `blur(${blur}px)` : 'none',
                          transition: isDragging
                            ? 'none'
                            : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, filter 0.5s ease',
                        }}
                        onClick={() => {
                          if (absDiff === 0) handleCardClick(img);
                          else setActiveIndex(idx);
                        }}
                      >
                        <div className="runway-card-inner">
                          <img
                            src={img.src}
                            alt={img.title}
                            draggable={false}
                            loading={absDiff <= 2 ? 'eager' : 'lazy'}
                          />
                          <div className="runway-glass-reflection" />
                          <div className="runway-card-border" />

                          {/* Center Active Metadata */}
                          {absDiff === 0 && (
                            <motion.div
                              className="runway-active-meta"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                            >
                              <span className="runway-category-tag">{img.subtitle}</span>
                              <h3 className="runway-active-title">{img.title}</h3>
                              <button
                                type="button"
                                className="runway-expand-pill"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCardClick(img);
                                }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>VIEW FULLSCREEN</span>
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Obsidian Glass Reflection Floor */}
                <div className="runway-floor-reflection" aria-hidden="true" />
              </div>

              {/* Bottom Navigation Controls & Infinite Filmstrip Mini-Scrubber */}
              <div className="deck3d-controls-bar">
                <button
                  type="button"
                  className="deck3d-nav-btn"
                  onClick={() =>
                    setActiveIndex((prev) => (prev - 1 + enrichedImages.length) % enrichedImages.length)
                  }
                  title="Previous Moment"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Filmstrip Mini-Dots */}
                <div className="deck3d-filmstrip-track">
                  {enrichedImages.map((_, dotIdx) => (
                    <button
                      key={`dot-${dotIdx}`}
                      type="button"
                      className={`filmstrip-dot ${dotIdx === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(dotIdx)}
                      title={`Jump to Moment ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                <div className="deck3d-counter-pill">
                  <span className="counter-current">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="counter-slash">/</span>
                  <span className="counter-total">
                    {String(enrichedImages.length).padStart(2, '0')}
                  </span>
                </div>

                <button
                  type="button"
                  className="deck3d-nav-btn"
                  onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % enrichedImages.length)
                  }
                  title="Next Moment"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* PRESENTATION MODE 3: HAUTE COUTURE MOSAIC (Editorial Masonry) */}
        {/* ============================================================ */}
        <AnimatePresence>
          {mode === 'mosaic' && (
            <motion.div
              key="mosaic-editorial-view"
              className="gallery-mosaic-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="mosaic-scroll-container"
                onWheel={(e) => e.stopPropagation()}
              >
                <div className="mosaic-masonry-grid">
                  {filteredImages.map((img, idx) => (
                    <motion.div
                      key={`mosaic-${img.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: (idx % 12) * 0.04 }}
                      className="mosaic-card-shell"
                      onClick={() => handleCardClick(img)}
                    >
                      <div className="mosaic-image-wrapper">
                        <img src={img.src} alt={img.title} loading="lazy" />
                        <div className="mosaic-gradient-overlay" />
                        <div className="mosaic-hover-badge">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div className="mosaic-card-meta">
                          <span className="mosaic-sub">{img.subtitle}</span>
                          <h4 className="mosaic-title">{img.title}</h4>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                ref={lightboxDialogRef}
                tabIndex={-1}
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
                  <div className="lightbox-glass-shimmer" />
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
                          (lightboxImg.galleryIdx - 1 + enrichedImages.length) %
                          enrichedImages.length;
                        setLightboxImg(enrichedImages[prevIdx]);
                      }}
                      title="Previous (Left Arrow)"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="lightbox-counter">
                      {String(lightboxImg.galleryIdx + 1).padStart(2, '0')} /{' '}
                      {String(enrichedImages.length).padStart(2, '0')}
                    </span>

                    <button
                      type="button"
                      className="lightbox-arrow-btn"
                      onClick={() => {
                        const nextIdx =
                          (lightboxImg.galleryIdx + 1) % enrichedImages.length;
                        setLightboxImg(enrichedImages[nextIdx]);
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
