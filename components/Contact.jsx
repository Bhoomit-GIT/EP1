'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Heart,
  Compass,
  ShieldCheck,
  MessageCircle,
  Gem,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CELEBRATION_TYPES = [
  { id: 'vivah', label: 'Sacred Vivah & Pheras', icon: Heart },
  { id: 'sangeet', label: 'Royal Sangeet & Soirée', icon: Sparkles },
  { id: 'ring', label: 'Intimate Ring Ceremony', icon: Gem },
  { id: 'reception', label: 'Grand Reception Gala', icon: Users },
  { id: 'destination', label: 'Palace Destination Odyssey', icon: Compass },
];

const GUEST_TIERS = [
  '50 – 150 Intimate',
  '150 – 350 Curated',
  '350 – 750 Grand',
  '750+ Sovereign',
];

const ATELIERS = [
  {
    city: 'Udaipur',
    subtitle: 'The Royal Lake Palace Atelier',
    address: 'Lake Palace Road, Udaipur, Rajasthan 313001',
    tz: 'Asia/Kolkata',
    region: 'IST · UTC+5:30',
  },
  {
    city: 'Mumbai',
    subtitle: 'Marine Drive Waterfront Flagship',
    address: 'Nariman Point, Marine Drive, Mumbai 400021',
    tz: 'Asia/Kolkata',
    region: 'IST · UTC+5:30',
  },
  {
    city: 'London',
    subtitle: 'Mayfair Private Appointment Salon',
    address: 'Berkeley Square, Mayfair, London W1J 6BD',
    tz: 'Europe/London',
    region: 'GMT · UTC+0',
  },
  {
    city: 'Dubai',
    subtitle: 'Downtown Hospitality Pavilion',
    address: 'Burj Crown Boulevard, Downtown Dubai, UAE',
    tz: 'Asia/Dubai',
    region: 'GST · UTC+4',
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const formCardRef = useRef(null);
  const sideCardRef = useRef(null);

  // Live Atelier Clocks
  const [times, setTimes] = useState({});

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const updated = {};
      ATELIERS.forEach((atelier) => {
        try {
          updated[atelier.city] = now.toLocaleTimeString('en-US', {
            timeZone: atelier.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });
        } catch {
          updated[atelier.city] = now.toLocaleTimeString();
        }
      });
      setTimes(updated);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    names: '',
    email: '',
    phone: '',
    eventType: 'Sacred Vivah & Pheras',
    guestTier: '150 – 350 Curated',
    eventDate: '',
    destination: '',
    vision: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCelebration = (label) => {
    setFormData((prev) => ({ ...prev, eventType: label }));
  };

  const handleSelectGuests = (tier) => {
    setFormData((prev) => ({ ...prev, guestTier: tier }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury concierge dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      names: '',
      email: '',
      phone: '',
      eventType: 'Sacred Vivah & Pheras',
      guestTier: '150 – 350 Curated',
      eventDate: '',
      destination: '',
      vision: '',
    });
    setIsSubmitted(false);
  };

  // GSAP Entrance Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (formCardRef.current && sideCardRef.current) {
        gsap.fromTo(
          [formCardRef.current, sideCardRef.current],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.18,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="freestyle-contact-section">
      {/* Ambient luxury radial glow */}
      <div className="contact-ambient-glow" aria-hidden="true" />
      <div className="contact-ambient-arc" aria-hidden="true" />

      <div className="contact-inner-container">
        {/* Editorial Section Header */}
        <header ref={headlineRef} className="contact-header-block">
          <div className="contact-eyebrow-wrapper">
            <span className="contact-eyebrow-pill">
              <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
              <span>THE BESPOKE ATELIER</span>
            </span>
            <span className="contact-live-beacon">
              <span className="beacon-pulse" />
              <span>COMMISSIONS OPEN FOR 2026 / 2027</span>
            </span>
          </div>

          <h2 className="contact-display-headline">
            Let Us Compose Your{' '}
            <span className="font-serif-italic gold-gradient-text">Sacred Reverie</span>
          </h2>

          <p className="contact-manifesto-subline">
            Every sacred union is a sovereign work of architectural art. From royal lakeside palace
            mandaps in Udaipur to candlelit private villas across the globe, our atelier breathes
            life into your most cherished memories.
          </p>
        </header>

        {/* Master Atelier Dual Column Grid */}
        <div className="contact-content-grid">
          {/* LEFT: Interactive Concierge Inquiry Form */}
          <div ref={formCardRef} className="contact-form-glass-card">
            <div className="card-top-accent-bar" />

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="inquiry-form"
                  onSubmit={handleSubmit}
                  className="contact-inquiry-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="form-card-header">
                    <span className="form-legend-tag">PRIVATE CONSULTATION DOSSIER</span>
                    <h3 className="form-card-title">Initiate Your Vision</h3>
                    <p className="form-card-desc">
                      Share your initial thoughts. Our Principal Concierge will contact you within 12
                      hours with bespoke concepts and champagne consultation scheduling.
                    </p>
                  </div>

                  {/* Step 1: Client / Couple Identity */}
                  <div className="form-field-group">
                    <div className="form-input-pair">
                      <div className="custom-input-box">
                        <label htmlFor="names">Couple / Host Name(s) *</label>
                        <input
                          type="text"
                          id="names"
                          name="names"
                          required
                          value={formData.names}
                          onChange={handleChange}
                          placeholder="e.g. Dev & Ananya"
                        />
                      </div>

                      <div className="custom-input-box">
                        <label htmlFor="email">Private Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="concierge@atelier.com"
                        />
                      </div>
                    </div>

                    <div className="custom-input-box">
                      <label htmlFor="phone">Direct Mobile / WhatsApp (With Country Code) *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98200 45781 / +44 7911 123456"
                      />
                    </div>
                  </div>

                  {/* Step 2: Celebration Category (Interactive Pill Selectors) */}
                  <div className="form-field-group">
                    <label className="field-group-label">Celebration Essence</label>
                    <div className="celebration-pill-matrix">
                      {CELEBRATION_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = formData.eventType === type.label;
                        return (
                          <button
                            type="button"
                            key={type.id}
                            className={`celebration-pill-btn ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => handleSelectCelebration(type.label)}
                          >
                            <Icon className="w-4 h-4 pill-icon" />
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Event Horizons (Guests & Date) */}
                  <div className="form-field-group">
                    <label className="field-group-label">Estimated Guest Horizon</label>
                    <div className="guest-tier-matrix">
                      {GUEST_TIERS.map((tier) => {
                        const isSelected = formData.guestTier === tier;
                        return (
                          <button
                            type="button"
                            key={tier}
                            className={`guest-tier-btn ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => handleSelectGuests(tier)}
                          >
                            <span>{tier}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-input-pair">
                    <div className="custom-input-box">
                      <label htmlFor="eventDate">Envisioned Date / Season</label>
                      <div className="input-with-icon">
                        <Calendar className="w-4 h-4 input-affix-icon" />
                        <input
                          type="text"
                          id="eventDate"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          placeholder="e.g. Winter 2026 / Dec 18–21"
                        />
                      </div>
                    </div>

                    <div className="custom-input-box">
                      <label htmlFor="destination">Envisioned Destination / City</label>
                      <div className="input-with-icon">
                        <MapPin className="w-4 h-4 input-affix-icon" />
                        <input
                          type="text"
                          id="destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          placeholder="e.g. Udaipur, Lake Como, Jaipur"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Notes & Vision */}
                  <div className="custom-input-box">
                    <label htmlFor="vision">Sacred Rituals, Floral Scents & Acoustic Vision</label>
                    <textarea
                      id="vision"
                      name="vision"
                      rows={3}
                      value={formData.vision}
                      onChange={handleChange}
                      placeholder="Share any specific cultural ceremonies, palace architectural preferences, bespoke music, or experiential wishes..."
                    />
                  </div>

                  {/* Submission CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-submit-btn"
                  >
                    <span className="submit-btn-shine" />
                    <span className="submit-btn-content">
                      {isSubmitting ? (
                        <span>TRANSMITTING DOSSIER...</span>
                      ) : (
                        <>
                          <span>REQUEST BESPOKE CONSULTATION</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>

                  <div className="form-privacy-note">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-accent" />
                    <span>Your private dossier remains strictly confidential under our non-disclosure protocol.</span>
                  </div>
                </motion.form>
              ) : (
                /* SUCCESS CONFIRMATION CARD */
                <motion.div
                  key="success-card"
                  className="contact-success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="success-icon-badge">
                    <CheckCircle2 className="w-10 h-10 text-gold-accent" />
                  </div>

                  <span className="success-pretitle">COMMISSION TRANSMITTED</span>
                  <h3 className="success-title">Your Reverie Has Been Received</h3>

                  <p className="success-desc">
                    Thank you, <strong className="text-white">{formData.names || 'Esteemed Patron'}</strong>.
                    Our Principal Event Architect has logged your bespoke inquiry for{' '}
                    <span className="text-gold-accent">{formData.eventType}</span>.
                  </p>

                  <div className="success-timeline-box">
                    <div className="timeline-item">
                      <span className="timeline-dot" />
                      <div className="timeline-text">
                        <strong>Within 4 Hours:</strong> Initial dossier review by our Udaipur & Mumbai ateliers.
                      </div>
                    </div>
                    <div className="timeline-item">
                      <span className="timeline-dot" />
                      <div className="timeline-text">
                        <strong>Within 12 Hours:</strong> Private portfolio curation & bespoke telephone consultation.
                      </div>
                    </div>
                  </div>

                  <div className="success-action-row">
                    <button
                      type="button"
                      className="success-reset-btn"
                      onClick={handleReset}
                    >
                      <span>SUBMIT ANOTHER ENQUIRY</span>
                    </button>
                    <a
                      href="#gallery"
                      className="success-explore-btn"
                    >
                      <span>EXPLORE THE ARCHIVES</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Direct Concierge & Global Ateliers with Live World Clocks */}
          <div ref={sideCardRef} className="contact-side-column">
            {/* Direct VIP Concierge Contact Card */}
            <div className="concierge-hotline-card">
              <div className="hotline-badge">
                <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
                <span>DIRECT CONCIERGE DESK</span>
              </div>
              <h4 className="hotline-title">Need Immediate Guidance?</h4>
              <p className="hotline-desc">
                For time-sensitive palace reservations, international bridal party logistics, or confidential inquiries.
              </p>

              <div className="hotline-links-list">
                <a
                  href="tel:+912948839200"
                  className="hotline-link-item"
                >
                  <div className="hotline-icon-box">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="hotline-item-content">
                    <span className="item-label">Telephone Concierge</span>
                    <span className="item-val">+91 (0) 294 883 9200</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 link-arrow" />
                </a>

                <a
                  href="https://wa.me/919820045781?text=Hello%20Freestyle%20Atelier%2C%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hotline-link-item whatsapp-accent"
                >
                  <div className="hotline-icon-box">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="hotline-item-content">
                    <span className="item-label">WhatsApp Private Channel</span>
                    <span className="item-val">+91 98200 45781</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 link-arrow" />
                </a>

                <a
                  href="mailto:atelier@freestyle-events.com"
                  className="hotline-link-item"
                >
                  <div className="hotline-icon-box">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="hotline-item-content">
                    <span className="item-label">Confidential Email</span>
                    <span className="item-val">atelier@freestyle-events.com</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 link-arrow" />
                </a>
              </div>
            </div>

            {/* Global Ateliers Directory with Live World Clocks */}
            <div className="global-ateliers-card">
              <div className="ateliers-card-header">
                <div className="header-left">
                  <span className="ateliers-card-tag">GLOBAL APPOINTMENTS</span>
                  <h4 className="ateliers-card-title">Our Atelier Salons</h4>
                </div>
                <div className="header-clock-indicator">
                  <Clock className="w-3.5 h-3.5 text-gold-accent" />
                  <span>SYNCHRONIZED</span>
                </div>
              </div>

              <div className="ateliers-list">
                {ATELIERS.map((atelier) => {
                  const liveTime = times[atelier.city] || '--:--:--';
                  return (
                    <div key={atelier.city} className="atelier-item">
                      <div className="atelier-item-header">
                        <div className="city-info">
                          <h5 className="city-name">{atelier.city}</h5>
                          <span className="city-subtitle">{atelier.subtitle}</span>
                        </div>
                        <div className="live-clock-pill">
                          <span className="clock-digits">{liveTime}</span>
                          <span className="clock-region">{atelier.region}</span>
                        </div>
                      </div>
                      <p className="atelier-address">{atelier.address}</p>
                    </div>
                  );
                })}
              </div>

              {/* Accreditations / Press Strip */}
              <div className="ateliers-press-strip">
                <span className="press-label">FEATURED IN</span>
                <div className="press-names">
                  <span>VOGUE WEDDINGS</span>
                  <span>·</span>
                  <span>ARCHITECTURAL DIGEST</span>
                  <span>·</span>
                  <span>HARPER’S BAZAAR</span>
                  <span>·</span>
                  <span>CONDÉ NAST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
