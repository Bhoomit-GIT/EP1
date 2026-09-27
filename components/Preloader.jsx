'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDMARK = 'FREESTYLE'.split('');

/**
 * Branded preloader: percentage counter + staggered wordmark reveal,
 * then a curtain wipe that hands off to the hero entrance.
 */
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const DURATION = 1050;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease-out curve — fast count, gentle landing
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        setIsExiting(true);
        onComplete?.();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isExiting && (
        <motion.div
          className="preloader-root"
          aria-hidden="true"
          initial={false}
          exit={{ yPercent: -100 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Cream hairline edge that leads the wipe */}
          <div className="preloader-edge" />
        </motion.div>
      )}
      {!isExiting && (
        <motion.div
          className="preloader-root"
          role="status"
          aria-label="Loading Freestyle"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="preloader-center">
            {/* Percentage counter — giant, top-left anchored like a Swiss folio */}
            <div className="preloader-count" aria-hidden="true">
              {String(progress).padStart(3, '0')}
              <span className="preloader-count-symbol">%</span>
            </div>

            {/* Staggered wordmark */}
            <h1 className="preloader-wordmark" aria-label="FREESTYLE">
              {WORDMARK.map((letter, idx) => (
                <motion.span
                  key={`${letter}-${idx}`}
                  className="preloader-letter"
                  initial={{ yPercent: 115 }}
                  animate={{ yPercent: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.08 + idx * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            {/* Hairline progress rail */}
            <div className="preloader-rail" aria-hidden="true">
              <motion.div
                className="preloader-rail-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                style={{ transformOrigin: 'left center' }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            <p className="preloader-tagline">
              EVENTS THAT FEEL DIFFERENT<span className="preloader-dot">.</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
