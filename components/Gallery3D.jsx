'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Layers, Maximize2, Sparkles } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/galleryImages';

export default function Gallery3D() {
  // Mode: 'scattered' (2.5D floating depth canvas) or 'deck3d' (3D perspective rectangle deck)
  const [mode, setMode] = useState('scattered');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100, isHovering: false });

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Scattered Canvas Pan Physics (Inertia & Dampening)
  const panRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    startX: 0,
    startY: 0,
    isPanning: false,
    velX: 0,
    velY: 0,
    lastX: 0,
    lastY: 0,
  });

  // 3D Deck Physics
  const deckRef = useRef({
    currentIdx: 0,
    targetIdx: 0,
    startX: 0,
    isDragging: false,
    velX: 0,
  });

  // Generate deterministic scattered positions for all 53 images
  const scatteredImages = useMemo(() => {
    // Generate a spacious organic constellation around the central typography
    const total = GALLERY_IMAGES.length;
    return GALLERY_IMAGES.map((img, idx) => {
      // Golden angle distribution for natural organic scattering
      const angle = (idx * 137.5 * Math.PI) / 180;
      const radius = 240 + Math.sqrt(idx) * 220; // Expands outward
      const rawX = Math.cos(angle) * radius * 1.4 + ((idx % 7) - 3) * 60;
      const rawY = Math.sin(angle) * radius * 0.95 + (((idx + 2) % 5) - 2) * 50;
      const x = Math.round(rawX * 10) / 10;
      const y = Math.round(rawY * 10) / 10;
      
      // Depth planes: 0 (deep background, blurred), 1 (midground), 2 (foreground, sharp)
      const depthTier = idx % 3;
      const depthBlur = depthTier === 0 ? 5 : depthTier === 1 ? 2 : 0;
      const scale = depthTier === 0 ? 0.72 : depthTier === 1 ? 0.88 : 1.05;
      const zIndex = depthTier === 0 ? 2 : depthTier === 1 ? 5 : 10;
      const opacity = depthTier === 0 ? 0.6 : depthTier === 1 ? 0.85 : 1;
      const rotation = Math.round(((((idx * 17) % 21) - 10) * 0.8) * 10) / 10;

      return {
        ...img,
        x,
        y,
        scale,
        depthBlur,
        zIndex,
        opacity,
        rotation,
      };
    });
  }, []);

  // Smooth RAF Animation Loop for Physics & Custom Easing
  useEffect(() => {
    let animId;

    const updatePhysics = () => {
      if (mode === 'scattered' && canvasRef.current) {
        const pan = panRef.current;
        // Ease target to current with custom lerp factor (0.08 for buttery smoothness)
        pan.currentX += (pan.targetX - pan.currentX) * 0.08;
        pan.currentY += (pan.targetY - pan.currentY) * 0.08;

        canvasRef.current.style.transform = `translate3d(${pan.currentX}px, ${pan.currentY}px, 0)`;
      } else if (mode === 'deck3d') {
        const deck = deckRef.current;
        deck.currentIdx += (deck.targetIdx - deck.currentIdx) * 0.12;
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [mode]);

  // Pointer Movement for Magnetic "DRAG" Cursor Badge
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovering: true,
    });

    if (panRef.current.isPanning) {
      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;
      panRef.current.targetX += dx;
      panRef.current.targetY += dy;
      panRef.current.velX = dx;
      panRef.current.velY = dy;
      panRef.current.lastX = e.clientX;
      panRef.current.lastY = e.clientY;
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (mode === 'scattered') {
      panRef.current.isPanning = true;
      panRef.current.lastX = e.clientX;
      panRef.current.lastY = e.clientY;
      setIsDragging(true);
    } else if (mode === 'deck3d') {
      deckRef.current.isDragging = true;
      deckRef.current.startX = e.clientX;
      setIsDragging(true);
    }
  }, [mode]);

  const handleMouseUp = useCallback(() => {
    if (mode === 'scattered') {
      panRef.current.isPanning = false;
      // Add subtle momentum fling
      panRef.current.targetX += panRef.current.velX * 4;
      panRef.current.targetY += panRef.current.velY * 4;
      panRef.current.velX = 0;
      panRef.current.velY = 0;
      setTimeout(() => setIsDragging(false), 50);
    } else if (mode === 'deck3d') {
      deckRef.current.isDragging = false;
      setTimeout(() => setIsDragging(false), 50);
    }
  }, [mode]);

  // Touch handlers for mobile devices
  const handleTouchStart = useCallback((e) => {
    if (!e.touches[0]) return;
    const touch = e.touches[0];
    if (mode === 'scattered') {
      panRef.current.isPanning = true;
      panRef.current.lastX = touch.clientX;
      panRef.current.lastY = touch.clientY;
    } else if (mode === 'deck3d') {
      deckRef.current.isDragging = true;
      deckRef.current.startX = touch.clientX;
    }
  }, [mode]);

  const handleTouchMove = useCallback((e) => {
    if (!e.touches[0]) return;
    const touch = e.touches[0];
    if (mode === 'scattered' && panRef.current.isPanning) {
      const dx = touch.clientX - panRef.current.lastX;
      const dy = touch.clientY - panRef.current.lastY;
      panRef.current.targetX += dx * 1.2;
      panRef.current.targetY += dy * 1.2;
      panRef.current.lastX = touch.clientX;
      panRef.current.lastY = touch.clientY;
    } else if (mode === 'deck3d' && deckRef.current.isDragging) {
      const dx = touch.clientX - deckRef.current.startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0 && activeIndex < GALLERY_IMAGES.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else if (dx > 0 && activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
        deckRef.current.startX = touch.clientX;
      }
    }
  }, [mode, activeIndex]);

  const handleTouchEnd = useCallback(() => {
    if (mode === 'scattered') {
      panRef.current.isPanning = false;
    } else if (mode === 'deck3d') {
      deckRef.current.isDragging = false;
    }
  }, [mode]);

  // Wheel navigation for 3D Deck
  const handleWheel = useCallback((e) => {
    if (mode === 'deck3d') {
      e.preventDefault();
      if (e.deltaY > 20 || e.deltaX > 20) {
        setActiveIndex((prev) => Math.min(prev + 1, GALLERY_IMAGES.length - 1));
      } else if (e.deltaY < -20 || e.deltaX < -20) {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  }, [mode]);

  // Open 3D Deck Mode on card click
  const handleCardClick = (idx) => {
    if (isDragging) return;
    setActiveIndex(idx);
    setMode('deck3d');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode === 'deck3d') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          setActiveIndex((prev) => Math.min(prev + 1, GALLERY_IMAGES.length - 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Escape') {
          setMode('scattered');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  return (
    <section
      ref={containerRef}
      id="gallery"
      className={`gallery-luxury-section ${mode === 'deck3d' ? 'mode-deck3d' : 'mode-scattered'}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setCursorPos((p) => ({ ...p, isHovering: false }))}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Top Controls & Eyebrow */}
      <div className="gallery-header-bar">
        <div className="gallery-eyebrow-capsule">
          <span className="gallery-eyebrow-tag">CURATED VISUALS</span>
          <span className="gallery-eyebrow-dot" />
          <span className="gallery-eyebrow-title">THE WEDDING ARCHIVES ({GALLERY_IMAGES.length} MOMENTS)</span>
        </div>

        {/* Mode Switch Pill */}
        <div className="gallery-mode-switch">
          <button
            type="button"
            className={`mode-btn ${mode === 'scattered' ? 'active' : ''}`}
            onClick={() => setMode('scattered')}
            title="Floating Canvas View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CANVAS</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'deck3d' ? 'active' : ''}`}
            onClick={() => setMode('deck3d')}
            title="3D Perspective Deck"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>3D DECK</span>
          </button>
        </div>
      </div>

      {/* Floating DRAG Cursor Pill in Scattered Mode */}
      {mode === 'scattered' && cursorPos.isHovering && (
        <motion.div
          className="gallery-drag-badge"
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <span>DRAG</span>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* MODE A: SCATTERED 2.5D CANVAS (Floating Multi-Depth Plane) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mode === 'scattered' && (
          <motion.div
            key="scattered-view"
            className="gallery-scattered-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Centerpiece Luxury Serif Typography */}
            <div className="gallery-center-typography" aria-hidden="true">
              <h2 className="luxury-headline">A NEW ERA OF LUXURY</h2>
              <p className="luxury-subline">AN IMMERSIVE ODYSSEY OF SACRED CELEBRATION</p>
            </div>

            {/* Draggable Multi-Depth Constellation Canvas */}
            <div ref={canvasRef} className="gallery-canvas-plane">
              {scatteredImages.map((item, idx) => (
                <div
                  key={item.id}
                  className="scattered-card"
                  style={{
                    transform: `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation}deg) scale(${item.scale})`,
                    zIndex: item.zIndex,
                    filter: item.depthBlur > 0 ? `blur(${item.depthBlur}px)` : 'none',
                    opacity: item.opacity,
                  }}
                  onClick={() => handleCardClick(idx)}
                >
                  <div className="card-image-shell">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading={idx < 12 ? 'eager' : 'lazy'}
                      draggable={false}
                    />
                    <div className="card-ambient-shadow" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODE B: 3D PERSPECTIVE RECTANGLE DECK (Cover Flow Carousel) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mode === 'deck3d' && (
          <motion.div
            key="deck3d-view"
            className="gallery-deck3d-wrapper"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Close / Return Pill Button */}
            <button
              type="button"
              className="deck3d-close-btn"
              onClick={() => setMode('scattered')}
              title="Return to Canvas"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 3D Perspective Stage Viewport */}
            <div className="deck3d-stage">
              <div className="deck3d-carousel">
                {GALLERY_IMAGES.map((img, idx) => {
                  const diff = idx - activeIndex;
                  const absDiff = Math.abs(diff);

                  // Only render cards within active visible window for extreme 120fps performance
                  if (absDiff > 7) return null;

                  // 3D Matrix Math matching reference video (tilted 3D cards)
                  const translateX = diff * 240; // Horizontal offset
                  const translateZ = -absDiff * 160; // Depth plunge
                  const rotateY = Math.max(-55, Math.min(55, -diff * 32)); // Perspective angle
                  const scale = Math.max(0.68, 1 - absDiff * 0.07);
                  const opacity = Math.max(0.15, 1 - absDiff * 0.16);
                  const blur = absDiff > 0 ? Math.min(6, absDiff * 1.4) : 0;
                  const zIndex = 100 - absDiff;

                  return (
                    <div
                      key={img.id}
                      className={`deck3d-card ${diff === 0 ? 'is-active' : ''}`}
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        zIndex,
                        opacity,
                        filter: blur > 0 ? `blur(${blur}px)` : 'none',
                        transition: isDragging
                          ? 'none'
                          : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, filter 0.5s ease',
                      }}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <div className="deck3d-card-inner">
                        <img
                          src={img.src}
                          alt={img.title}
                          draggable={false}
                          loading={absDiff <= 3 ? 'eager' : 'lazy'}
                        />
                        <div className="deck3d-glass-reflect" />
                        
                        {/* Center Card Title Overlay */}
                        {diff === 0 && (
                          <motion.div
                            className="deck3d-active-meta"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.1 }}
                          >
                            <span className="active-subtitle">{img.subtitle}</span>
                            <h4 className="active-title">{img.title}</h4>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Deck Controls & Dynamic Counter */}
            <div className="deck3d-controls-bar">
              <button
                type="button"
                className="deck3d-nav-btn"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="deck3d-counter-pill">
                <span className="counter-current">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="counter-slash">/</span>
                <span className="counter-total">
                  {String(GALLERY_IMAGES.length).padStart(2, '0')}
                </span>
              </div>

              <button
                type="button"
                className="deck3d-nav-btn"
                disabled={activeIndex === GALLERY_IMAGES.length - 1}
                onClick={() =>
                  setActiveIndex((prev) =>
                    Math.min(prev + 1, GALLERY_IMAGES.length - 1)
                  )
                }
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
