'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const DETAIL_ITEMS = [
  {
    id: '03',
    title: 'Tactile Macro Florals & Crystal Glassware',
    tag: 'SCALE 03 • MACRO DETAILS',
    image: '/assets/images/about-oculus-detail.jpg',
    location: 'Zurich Private Estate • Summer Solstice',
    description:
      'Artisanal hand-blown crystal flutes catching evening candlelight alongside freshly gathered gardenias, fragrant sweet peas, and bespoke silk place cards.',
  },
  {
    id: '01',
    title: 'Landscape Floral Canopy Architecture',
    tag: 'SCALE 01 • LANDSCAPE ARCHITECTURE',
    image: '/assets/images/about-arch-main.jpg',
    location: 'Lucerne Mountain Pavilion • Sunset Ceremony',
    description:
      'A bespoke timber pergola enveloped in thousand-bloom garden roses, olive branches, and suspended crystal chandeliers framed by panoramic Alpine peaks.',
  },
  {
    id: '02',
    title: 'Atmospheric Candlelit Tablescape',
    tag: 'SCALE 02 • ATMOSPHERIC SPACES',
    image: '/assets/images/about-arch-detail.jpg',
    location: 'St. Moritz Alpine Lodge • Twilight Gala',
    description:
      'An intimate evening dining arrangement bathed in cascading hurricane glass pillar candles, burnished brass accents, and textured raw linen textiles.',
  },
];

export default function DetailModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, onClose]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % DETAIL_ITEMS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + DETAIL_ITEMS.length) % DETAIL_ITEMS.length);
  };

  const currentItem = DETAIL_ITEMS[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="detail-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detailModalTitle"
        >
          <motion.div
            className="detail-modal-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="detail-modal-header">
              <div className="detail-title-group">
                <span className="detail-modal-kicker">
                  <Sparkles size={12} className="kicker-sparkle" />
                  ARCHITECTURAL ARCHIVES &bull; OCULUS VIEW
                </span>
                <h3 id="detailModalTitle" className="detail-modal-headline">
                  {currentItem.title}
                </h3>
              </div>

              <motion.button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close detail modal"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <X size={18} strokeWidth={2.2} />
              </motion.button>
            </div>

            {/* Modal Media Canvas */}
            <div className="detail-modal-viewport">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentItem.id}
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="detail-modal-image"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                className="detail-nav-btn prev"
                onClick={prevSlide}
                aria-label="Previous detail"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="detail-nav-btn next"
                onClick={nextSlide}
                aria-label="Next detail"
              >
                <ChevronRight size={20} />
              </button>

              {/* Scale pill overlay */}
              <div className="detail-scale-pill">
                <Eye size={12} strokeWidth={2.2} />
                <span>{currentItem.tag}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="detail-modal-footer">
              <div className="detail-footer-info">
                <span className="detail-location-caption">{currentItem.location}</span>
                <p className="detail-desc-text">{currentItem.description}</p>
              </div>

              {/* Pagination Dots / Scale Selector */}
              <div className="detail-pagination-dots">
                {DETAIL_ITEMS.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`detail-dot-btn ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Switch to scale ${item.id}`}
                  >
                    <span>{item.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
