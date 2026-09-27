'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUp, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Check } from 'lucide-react';

const EVENT_TYPES = ['Wedding', 'Corporate Event', 'Live Show', 'Brand Activation', 'Social Gathering', 'Other'];

// Optional: drop a Formspree/endpoint URL here and the form POSTs to it.
// When empty, the form simulates success and offers a direct email fallback.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'hello@freestyle.studio';

export default function Contact() {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const validate = (data) => {
    const next = {};
    if (!data.get('name')?.trim()) next.name = 'Please tell us your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get('email') || '')) next.email = 'Enter a valid email address';
    if (!data.get('message')?.trim()) next.message = 'A few words about your event helps us prepare';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nextErrors = validate(new FormData(form));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');
    try {
      if (FORM_ENDPOINT) {
        await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      } else {
        // Graceful stub: no backend configured — simulate network latency
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('idle');
      setErrors({ form: 'Something went wrong — please email us directly.' });
    }
  };

  // Scroll to top (Lenis-aware)
  const scrollToTop = () => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-ambient" aria-hidden="true" />

      <div className="contact-wrapper">
        {/* Top Header Rail */}
        <div className="contact-top-rail">
          <div className="contact-left-marker">
            <span className="contact-marker-stroke" aria-hidden="true" />
            <span className="contact-marker-label">CONTACT</span>
          </div>
          <div className="contact-right-breadcrumb">
            <span>TELL US YOUR STORY &nbsp;•&nbsp; WE&apos;LL HANDLE THE REST</span>
          </div>
        </div>

        {/* Giant Headline */}
        <motion.h2
          className="contact-headline"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&apos;s craft
          <br />
          <span className="serif-terracotta-italic">your story.</span>
        </motion.h2>

        <div className="contact-grid">
          {/* LEFT: Details */}
          <motion.div
            className="contact-details-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="contact-pitch">
              From the first sketch to the final send-off, our studio plans a limited number of
              events each season so every celebration gets our full obsession.
            </p>

            <div className="contact-availability">
              <span className="availability-dot" aria-hidden="true" />
              <span>Now booking — 2026 / 2027 season</span>
            </div>

            <ul className="contact-info-list">
              <li>
                <span className="contact-info-icon"><Mail size={15} strokeWidth={1.8} /></span>
                <div>
                  <span className="contact-info-label">EMAIL</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="contact-info-value">{CONTACT_EMAIL}</a>
                </div>
              </li>
              <li>
                <span className="contact-info-icon"><Phone size={15} strokeWidth={1.8} /></span>
                <div>
                  <span className="contact-info-label">PHONE</span>
                  <a href="tel:+15551234567" className="contact-info-value">+1 (555) 123-4567</a>
                </div>
              </li>
              <li>
                <span className="contact-info-icon"><MapPin size={15} strokeWidth={1.8} /></span>
                <div>
                  <span className="contact-info-label">STUDIO</span>
                  <span className="contact-info-value">12 Atelier Lane, By Appointment</span>
                </div>
              </li>
            </ul>

            <div className="contact-socials">
              <span className="contact-socials-label">FOLLOW THE JOURNEY</span>
              <div className="contact-social-row">
                <a href="#contact" aria-label="Instagram" className="contact-social-btn" onClick={(e) => e.preventDefault()}>
                  <Instagram size={16} strokeWidth={1.8} />
                </a>
                <a href="#contact" aria-label="Facebook" className="contact-social-btn" onClick={(e) => e.preventDefault()}>
                  <Facebook size={16} strokeWidth={1.8} />
                </a>
                <a href="#contact" aria-label="YouTube" className="contact-social-btn" onClick={(e) => e.preventDefault()}>
                  <Youtube size={16} strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Inquiry Form */}
          <motion.div
            className="contact-form-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="form-success"
                  className="contact-success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="status"
                >
                  <div className="contact-success-mark" aria-hidden="true">
                    <svg viewBox="0 0 52 52" width="56" height="56">
                      <circle className="rsvp-success-circle" cx="26" cy="26" r="24" fill="none" />
                      <path className="rsvp-success-check" d="M14 27 L23 36 L38 19" fill="none" />
                    </svg>
                  </div>
                  <h3 className="contact-success-title">Brief received.</h3>
                  <p className="contact-success-copy">
                    Thank you — our producers will reach out within 48 hours with next steps and a
                    curated moodboard.
                  </p>
                  <button type="button" className="contact-submit-btn" onClick={() => setStatus('idle')}>
                    Send another brief
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  ref={formRef}
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="cf-name">FULL NAME</label>
                      <input id="cf-name" name="name" type="text" placeholder="e.g. Helena Vance" autoComplete="name" />
                      {errors.name && <span className="contact-field-error">{errors.name}</span>}
                    </div>
                    <div className="contact-field">
                      <label htmlFor="cf-email">EMAIL</label>
                      <input id="cf-email" name="email" type="email" placeholder="name@company.com" autoComplete="email" />
                      {errors.email && <span className="contact-field-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="cf-type">EVENT TYPE</label>
                      <select id="cf-type" name="eventType" defaultValue="Wedding">
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="contact-field">
                      <label htmlFor="cf-date">PREFERRED DATE</label>
                      <input id="cf-date" name="date" type="date" />
                    </div>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="cf-message">TELL US EVERYTHING</label>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={4}
                      placeholder="Guest count, venue dreams, the feeling you're after…"
                    />
                    {errors.message && <span className="contact-field-error">{errors.message}</span>}
                  </div>

                  {errors.form && <span className="contact-field-error contact-form-error">{errors.form}</span>}

                  <button type="submit" className="contact-submit-btn" disabled={status === 'sending'}>
                    <span>{status === 'sending' ? 'SENDING…' : 'SEND THE BRIEF'}</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                    >
                      <ArrowRight size={16} strokeWidth={2} />
                    </motion.span>
                  </button>

                  <p className="contact-form-note">
                    Prefer email? Write to us directly at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand-row">
            <span className="footer-wordmark">FREESTYLE</span>
            <button type="button" className="footer-top-btn" onClick={scrollToTop} aria-label="Back to top">
              <ArrowUp size={18} strokeWidth={1.8} />
            </button>
          </div>

          <div className="footer-hairline" aria-hidden="true" />

          <div className="footer-meta-row">
            <span className="footer-copy">© {new Date().getFullYear()} Freestyle Events Studio</span>
            <nav className="footer-nav" aria-label="Footer">
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#journey">Hosted Events</a>
              <a href="#gallery">Gallery</a>
            </nav>
            <span className="footer-tagline">CRAFTED WITH OBSESSION</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
