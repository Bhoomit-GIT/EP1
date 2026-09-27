'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Maximize2, Sparkles } from 'lucide-react';
import useModalA11y from './useModalA11y';

const SHOWREEL_SRC = '/assets/video/showreel.mp4';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function VideoModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  useModalA11y(isOpen, onClose, videoContainerRef);

  const stopLenis = useCallback(() => {
    window.__lenis?.stop?.();
  }, []);

  const startLenis = useCallback(() => {
    window.__lenis?.start?.();
  }, []);

  // Scroll lock (Lenis-aware)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      stopLenis();
    } else {
      document.body.style.overflow = '';
      startLenis();
    }

    return () => {
      document.body.style.overflow = '';
      startLenis();
    };
  }, [isOpen, stopLenis, startLenis]);

  // Pause + reset playback when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [isOpen]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

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
            tabIndex={-1}
            style={{ outline: 'none' }}
          >
            {/* Modal Header */}
            <div className="video-modal-header">
              <div className="modal-title-group">
                <span className="modal-kicker">
                  <Sparkles size={13} className="kicker-sparkle" />
                  OUR STORY &amp; ARCHIVES
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

            {/* Video Viewport */}
            <div className="video-viewport">
              <video
                ref={videoRef}
                className={`video-backdrop-media ${isPlaying ? 'playing' : 'paused'}`}
                src={SHOWREEL_SRC}
                playsInline
                muted
                loop
                preload="metadata"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => {
                  const video = e.currentTarget;
                  setCurrentTime(video.currentTime);
                  if (Number.isFinite(video.duration) && video.duration > 0) {
                    setProgress((video.currentTime / video.duration) * 100);
                  }
                }}
              />

              {/* Ambient Vignette & Lighting Gradients */}
              <div className="video-vignette-overlay" />

              {/* Central Play/Pause Pulse Button */}
              <motion.button
                className={`center-play-toggle ${isPlaying ? 'is-playing' : ''}`}
                onClick={togglePlay}
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
                <span>OFFICIAL SHOWREEL &bull; 2026</span>
              </div>

              {/* Video Bottom Controls Bar */}
              <div className="video-controls-bar">
                {/* Seek Track */}
                <div className="video-progress-container" onClick={handleSeek}>
                  <div className="video-progress-track">
                    <div className="video-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="controls-row">
                  <div className="controls-left">
                    <button
                      className="control-icon-btn"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                    </button>

                    <span className="timestamp-display">
                      {formatTime(currentTime)} <span className="time-sep">/</span>{' '}
                      {formatTime(duration)}
                    </span>
                  </div>

                  <div className="controls-right">
                    <span className="quality-pill">FREESTYLE FILMS</span>
                    <button
                      className="control-icon-btn"
                      onClick={handleFullscreen}
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
                From bespoke floral architecture to private acoustic sundowners, witness the
                meticulous craftsmanship and raw emotion behind every Freestyle experience.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
