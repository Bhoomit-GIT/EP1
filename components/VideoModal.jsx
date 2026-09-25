'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(28); // Simulated or active progress percentage
  const videoContainerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
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
  }, [isOpen, onClose]);

  // Simulated playback time advancement
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="video-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="videoModalTitle"
        >
          {/* Modal Container */}
          <motion.div
            className="video-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            ref={videoContainerRef}
          >
            {/* Modal Header */}
            <div className="video-modal-header">
              <div className="modal-title-group">
                <span className="modal-kicker">
                  <Sparkles size={13} className="kicker-sparkle" />
                  OUR STORY & ARCHIVES
                </span>
                <h3 id="videoModalTitle" className="modal-headline">
                  Watch How We Create Magic
                </h3>
              </div>

              <motion.button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close video preview"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} strokeWidth={2.2} />
              </motion.button>
            </div>

            {/* Video Viewport / Showcase Canvas */}
            <div className="video-viewport">
              <img
                src="/assets/images/about-arch-main.jpg"
                alt="Story backdrop showing atmospheric mountain canopy wedding"
                className={`video-backdrop-media ${isPlaying ? 'playing' : 'paused'}`}
              />

              {/* Ambient Vignette & Lighting Gradients */}
              <div className="video-vignette-overlay" />

              {/* Central Play/Pause Pulse Button */}
              <motion.button
                className="center-play-toggle"
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause size={28} fill="#FFFFFF" color="#FFFFFF" />
                ) : (
                  <Play size={28} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: 3 }} />
                )}
              </motion.button>

              {/* Live Status Tag */}
              <div className="video-meta-badge">
                <span className="live-dot" />
                <span>DIRECTOR'S CUT &bull; 4K 60FPS</span>
              </div>

              {/* Video Bottom Controls Bar */}
              <div className="video-controls-bar">
                {/* Scrub Track */}
                <div
                  className="video-progress-container"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setProgress((clickX / rect.width) * 100);
                  }}
                >
                  <div className="video-progress-track">
                    <motion.div
                      className="video-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="controls-row">
                  <div className="controls-left">
                    <button
                      className="control-icon-btn"
                      onClick={() => setIsPlaying(!isPlaying)}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                    </button>

                    <button
                      className="control-icon-btn"
                      onClick={() => setIsMuted(!isMuted)}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    </button>

                    <span className="timestamp-display">
                      01:14 <span className="time-sep">/</span> 03:42
                    </span>
                  </div>

                  <div className="controls-right">
                    <span className="quality-pill">4K UHD</span>
                    <button
                      className="control-icon-btn"
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          videoContainerRef.current?.requestFullscreen?.();
                        } else {
                          document.exitFullscreen?.();
                        }
                      }}
                      aria-label="Full screen"
                    >
                      <Maximize2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Footer Caption */}
            <div className="video-modal-footer">
              <p className="footer-caption">
                From bespoke floral architecture to private acoustic sundowners, witness the meticulous craftsmanship and raw emotion behind every Freestyle experience.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
