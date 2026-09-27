'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

/**
 * RosePetalShower - A blissful, performant petal fall effect
 * Uses requestAnimationFrame for smooth, organic motion
 * Colors match the design system: blush, terracotta, cream, sage
 */
export default function RosePetalShower({ isActive = true, intensity = 'medium', onDebug }) {
  const debug = (msg) => {
    onDebug?.(msg);
  };
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const petalsRef = useRef([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Petal configurations matching the design system palette
  const PETAL_VARIANTS = useMemo(() => [
    // Blush petals (primary - matching --color-blush: #F3DDD1)
    { 
      color: '#F3DDD1', 
      opacity: 0.85, 
      sizeRange: [14, 22],
      swayAmplitude: 18,
      swayFrequency: 0.0008,
      rotationSpeed: 0.0003,
      fallSpeedRange: [0.15, 0.35],
      count: 12
    },
    // Soft blush (--color-blush-soft: #FBECE5)
    { 
      color: '#FBECE5', 
      opacity: 0.7, 
      sizeRange: [10, 18],
      swayAmplitude: 22,
      swayFrequency: 0.001,
      rotationSpeed: 0.0004,
      fallSpeedRange: [0.1, 0.28],
      count: 10
    },
    // Terracotta accent (--color-terracotta: #C68B6E)
    { 
      color: '#C68B6E', 
      opacity: 0.6, 
      sizeRange: [8, 14],
      swayAmplitude: 15,
      swayFrequency: 0.0006,
      rotationSpeed: 0.0002,
      fallSpeedRange: [0.2, 0.4],
      count: 6
    },
    // Cream/white petals (--color-surface-white: #FFFFFF)
    { 
      color: '#FFFFFF', 
      opacity: 0.55, 
      sizeRange: [12, 20],
      swayAmplitude: 20,
      swayFrequency: 0.0009,
      rotationSpeed: 0.00035,
      fallSpeedRange: [0.12, 0.3],
      count: 8
    },
  ], []);

  // Intensity modifiers
  const intensityConfig = useMemo(() => ({
    subtle: { multiplier: 0.5, spawnInterval: 3000 },
    medium: { multiplier: 1, spawnInterval: 2000 },
    gentle: { multiplier: 0.7, spawnInterval: 2500 },
  }), []);

  const config = intensityConfig[intensity] || intensityConfig.medium;

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Rose petal SVG path - organic, slightly asymmetric shape
  const petalSVG = useMemo(() => `
    <svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size * 1.5}">
      <path 
        d="M12 0 
           C6 4, 2 14, 2 22 
           C2 28, 6 34, 12 36 
           C18 34, 22 28, 22 22 
           C22 14, 18 4, 12 0 Z"
        fill="{color}" 
        opacity="{opacity}"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
      />
    </svg>
  `, []);

  // Create a petal element
  const createPetal = (variant, containerWidth, containerHeight) => {
    const size = variant.sizeRange[0] + Math.random() * (variant.sizeRange[1] - variant.sizeRange[0]);
    const startX = Math.random() * containerWidth;
    const startY = -size * 2;
    const fallSpeed = variant.fallSpeedRange[0] + Math.random() * (variant.fallSpeedRange[1] - variant.fallSpeedRange[0]);
    const swayPhase = Math.random() * Math.PI * 2;
    const rotation = Math.random() * 360;
    const rotationSpeed = variant.rotationSpeed * (0.5 + Math.random());
    const swayAmplitude = variant.swayAmplitude * (0.7 + Math.random() * 0.6);
    const swayFrequency = variant.swayFrequency * (0.8 + Math.random() * 0.4);
    const delay = Math.random() * 500;

    const petalEl = document.createElement('div');
    petalEl.className = 'rose-petal';
    petalEl.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      width: ${size}px;
      height: ${size * 1.5}px;
      pointer-events: none;
      will-change: transform, opacity;
      transform-origin: center center;
    `;
    
    petalEl.innerHTML = petalSVG
      .replace('{size}', size)
      .replace('{color}', variant.color)
      .replace('{opacity}', variant.opacity);

    return {
      element: petalEl,
      x: startX,
      y: startY,
      fallSpeed,
      swayPhase,
      rotation,
      rotationSpeed,
      swayAmplitude,
      swayFrequency,
      size,
      variant,
      delay,
      startTime: Date.now() + delay,
      isActive: false,
    };
  };

  // Initialize petals and animation loop
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const container = containerRef.current;
    // Cache container dimensions once — never read layout inside the RAF loop
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Create initial petal pool
    PETAL_VARIANTS.forEach(variant => {
      const count = Math.floor(variant.count * config.multiplier);
      for (let i = 0; i < count; i++) {
        const petal = createPetal(variant, containerWidth, containerHeight);
        container.appendChild(petal.element);
        petalsRef.current.push(petal);
      }
    });

    // Animation loop
    let lastTime = 0;
    const animate = (currentTime) => {
      if (!isActive || prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clamp to avoid huge jumps after tab switches / RAF pauses
      const deltaTime = Math.min(currentTime - lastTime, 50);
      lastTime = currentTime;

      petalsRef.current.forEach(petal => {
        if (!petal.isActive && currentTime >= petal.startTime) {
          petal.isActive = true;
          petal.element.style.opacity = '1';
        }

        if (!petal.isActive) return;

        // Update position with organic motion
        petal.y += petal.fallSpeed * (deltaTime / 16.67); // Normalize to 60fps
        
        // Sway motion - organic sine wave with phase offset
        const swayOffset = Math.sin((currentTime * petal.swayFrequency) + petal.swayPhase) * petal.swayAmplitude;
        petal.x += swayOffset * 0.02; // Gentle horizontal drift
        
        // Rotation - slow, natural tumbling
        petal.rotation += petal.rotationSpeed * deltaTime;

        // Apply transforms
        petal.element.style.transform = `
          translate3d(${petal.x}px, ${petal.y}px, 0)
          rotate(${petal.rotation}deg)
        `;

        // Fade out near bottom
        const progress = petal.y / containerHeight;
        if (progress > 0.85) {
          petal.element.style.opacity = (1 - (progress - 0.85) / 0.15) * petal.variant.opacity;
        }

        // Recycle petal when it falls off screen
        if (petal.y > containerHeight + petal.size * 2) {
          // Reset to top with new random properties
          petal.x = Math.random() * containerWidth;
          petal.y = -petal.size * 2 - Math.random() * 100;
          petal.rotation = Math.random() * 360;
          petal.swayPhase = Math.random() * Math.PI * 2;
          petal.startTime = currentTime + Math.random() * 2000;
          petal.isActive = false;
          petal.element.style.opacity = '0';
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      // Petals will naturally adapt on next recycle
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      // Clean up DOM
      petalsRef.current.forEach(petal => {
        petal.element.remove();
      });
      petalsRef.current = [];
    };
  }, [isActive, prefersReducedMotion, config.multiplier, PETAL_VARIANTS]);

  // Spawn new petals periodically for continuous flow
  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;

    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      // Pick a random variant weighted by count
      const totalCount = PETAL_VARIANTS.reduce((sum, v) => sum + v.count * config.multiplier, 0);
      let random = Math.random() * totalCount;
      let selectedVariant = PETAL_VARIANTS[0];
      
      for (const variant of PETAL_VARIANTS) {
        const count = variant.count * config.multiplier;
        if (random < count) {
          selectedVariant = variant;
          break;
        }
        random -= count;
      }

      const petal = createPetal(selectedVariant, containerWidth, containerHeight);
      petal.startTime = Date.now();
      petal.isActive = true;
      containerRef.current.appendChild(petal.element);
      petalsRef.current.push(petal);

      // Limit total petals for performance
      const maxPetals = Math.floor(36 * config.multiplier);
      if (petalsRef.current.length > maxPetals) {
        const oldPetal = petalsRef.current.shift();
        if (oldPetal) oldPetal.element.remove();
      }
    }, config.spawnInterval);

    return () => clearInterval(interval);
  }, [isActive, prefersReducedMotion, config, PETAL_VARIANTS]);

  return (
    <div
      ref={containerRef}
      className="rose-petal-shower"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
}