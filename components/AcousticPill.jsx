'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

const PLAYLIST = [
  {
    id: 'guitar',
    title: 'Spanish Romance',
    tag: 'ACOUSTIC GUITAR',
    src: '/assets/audio/romance-acoustic.mp3',
    description: 'Intimate classical Spanish guitar — romantic, heartwarming, and deeply emotional.',
  },
  {
    id: 'piano',
    title: 'Gymnopédie No. 1',
    tag: 'SATIE PIANO',
    src: '/assets/audio/gymnopedie-piano.mp3',
    description: 'Erik Satie’s timeless piano masterpiece — serene, reflective, and warm.',
  },
];

export default function AcousticPill({ containerRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [barScales, setBarScales] = useState([0.3, 0.5, 0.7, 0.4, 0.3]);

  const audioRef = useRef(null);
  const fadeAnimRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameRef = useRef(null);

  const currentTrack = PLAYLIST[trackIndex];

  // Initialize Audio instance on mount
  useEffect(() => {
    const audio = new Audio();
    audio.src = currentTrack.src;
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeAnimRef.current) cancelAnimationFrame(fadeAnimRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Update track source when trackIndex changes
  useEffect(() => {
    if (!audioRef.current) return;
    const wasPlaying = isPlaying;

    if (wasPlaying) {
      fadeAudio(0, 400, () => {
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        audioRef.current.play().then(() => {
          fadeAudio(0.52, 1200);
        }).catch(() => {});
      });
    } else {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
    }
  }, [trackIndex]);

  // Connect Web Audio Analyser for real-time frequency-driven equalizer
  const setupAnalyser = () => {
    if (audioContextRef.current || !audioRef.current) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch {
      // Fallback silently to CSS animations if Web Audio routing is restricted
    }
  };

  // Real-time animation loop reading audio frequencies
  const startVisualizerLoop = () => {
    const update = () => {
      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Sample 5 distinct frequency bands (sub-bass, low-mid, mid, upper-mid, treble)
        const b1 = Math.max(0.2, (dataArray[2] || 0) / 255);
        const b2 = Math.max(0.25, (dataArray[5] || 0) / 255);
        const b3 = Math.max(0.35, (dataArray[9] || 0) / 255);
        const b4 = Math.max(0.25, (dataArray[14] || 0) / 255);
        const b5 = Math.max(0.2, (dataArray[20] || 0) / 255);

        setBarScales([b1, b2, b3, b4, b5]);
      }
      animFrameRef.current = requestAnimationFrame(update);
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(update);
  };

  const stopVisualizerLoop = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setBarScales([0.3, 0.5, 0.7, 0.4, 0.3]);
  };

  // Strictly clamp volume between 0 and 1 to prevent DOMException
  const clamp = (val) => {
    const n = Number(val);
    if (isNaN(n) || n <= 0) return 0;
    if (n >= 1) return 1;
    return n;
  };

  const setVolumeSafe = (val) => {
    if (!audioRef.current) return;
    try {
      audioRef.current.volume = clamp(val);
    } catch {
      // Safely ignore boundary issues
    }
  };

  // Smooth Volume Fader (no harsh cuts or clicks)
  const fadeAudio = (targetVolume, durationMs, callback) => {
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    if (!audioRef.current) return;
    const startVolume = clamp(audioRef.current.volume);
    const endVolume = clamp(targetVolume);
    const startTime = performance.now();

    const tick = (now) => {
      if (!audioRef.current) return;
      const elapsed = now - startTime;
      const progress = Math.max(0, Math.min(1, elapsed / durationMs));
      const nextVol = clamp(startVolume + (endVolume - startVolume) * progress);

      setVolumeSafe(nextVol);

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(tick);
      } else {
        setVolumeSafe(endVolume);
        callback?.();
      }
    };

    fadeAnimRef.current = requestAnimationFrame(tick);
  };

  const handleToggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      fadeAudio(0, 500, () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setVolumeSafe(0);
        }
        setIsPlaying(false);
        stopVisualizerLoop();
      });
    } else {
      setupAnalyser();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      setVolumeSafe(0);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        fadeAudio(0.55, 1200);
        startVisualizerLoop();
      }).catch((err) => {
        console.warn('Audio play request error:', err);
      });
    }
  };

  const handleTrackSwitch = (e) => {
    e.stopPropagation();
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  return (
    <motion.div
      ref={containerRef}
      className="arch-soundwave-portal"
      onClick={handleToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24 }}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
      title={isPlaying ? `Now Playing: ${currentTrack.title} (Click to pause)` : `Click to play heartwarming acoustic music (${currentTrack.title})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {/* Expanding Acoustic Resonance Waves (When Playing) */}
      {isPlaying && (
        <>
          <div className="soundwave-ripple-ring ripple-1" aria-hidden="true" />
          <div className="soundwave-ripple-ring ripple-2" aria-hidden="true" />
        </>
      )}

      {/* Rotating Hairline Circular Text Stamp on Path */}
      <div className={`soundwave-rotating-stamp ${isPlaying ? 'playing' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 160 160" width="144" height="144">
          <defs>
            <path
              id="soundwaveCirclePath"
              d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
            />
          </defs>
          <text className="soundwave-stamp-text">
            <textPath href="#soundwaveCirclePath" startOffset="0%">
              • LIVE SOUNDSCAPES • {currentTrack.tag} • FREESTYLE •
            </textPath>
          </text>
        </svg>
      </div>

      {/* Core Glassmorphic Acoustic Disc */}
      <div className={`soundwave-glass-disc ${isPlaying ? 'active' : ''}`}>
        {/* Subtle Ambient Radial Warm Glow */}
        <div className="soundwave-ambient-glow" aria-hidden="true" />

        {/* Dynamic Equalizer Frequency Bars with Real/Idle Animation */}
        <div className="soundwave-equalizer-bars" aria-hidden="true">
          {barScales.map((scale, i) => (
            <span
              key={i}
              className={`eq-bar eq-${i + 1} ${isPlaying ? 'animate-real' : 'idle'}`}
              style={{
                transform: isPlaying ? `scaleY(${scale * 2.2 + 0.3})` : undefined,
                height: isPlaying ? '24px' : undefined,
              }}
            />
          ))}
        </div>

        {/* Micro Playback & Music Note Icon */}
        <div className="soundwave-toggle-indicator">
          {isPlaying ? (
            <Volume2 size={13} strokeWidth={2.4} className="icon-playing" />
          ) : (
            <VolumeX size={13} strokeWidth={2.4} className="icon-paused" />
          )}
        </div>
      </div>

      {/* Architectural Metadata Badge with Track Switcher */}
      <div className={`soundwave-caption-pill ${isPlaying ? 'live' : ''}`}>
        <span className={`soundwave-indicator-dot ${isPlaying ? 'pulsing' : ''}`} />
        <span className="caption-track-text">{isPlaying ? `LIVE • ${currentTrack.tag}` : currentTrack.tag}</span>

        {/* Subtle switch button to cycle track */}
        <button
          className="soundwave-switch-track-btn"
          onClick={handleTrackSwitch}
          title="Switch ambiance track (Guitar / Piano)"
          aria-label="Switch soundtrack"
        >
          <Music size={9} />
        </button>
      </div>
    </motion.div>
  );
}
