'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  Sparkles,
  ArrowUpRight,
  Mail,
  CheckCircle2,
  Heart,
  Instagram,
  Compass,
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNav = (id) => {
    onNavigate?.(id);
    const target = document.getElementById(id);
    if (target) {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="freestyle-luxury-footer">
      {/* Top Ambient Glow Line */}
      <div className="footer-top-accent-line" />

      <div className="footer-inner-content">
        {/* Top Editorial Journal & Manifesto Banner */}
        <div className="footer-journal-banner">
          <div className="journal-manifesto-block">
            <div className="footer-crest-tag">
              <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
              <span>THE GAZETTE OF WONDER</span>
            </div>
            <h3 className="journal-title">
              Receive Our Private <span className="font-serif-italic">Bridal Chronicles</span>
            </h3>
            <p className="journal-subtitle">
              Intimate retrospective portfolios, architectural palace floorplans, and sacred ritual
              guides curated for the sovereign couple.
            </p>
          </div>

          <div className="journal-form-block">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="journal-subscribe-form">
                <div className="journal-input-wrap">
                  <Mail className="w-4 h-4 journal-icon" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your confidential email..."
                    className="journal-email-input"
                  />
                </div>
                <button type="submit" className="journal-submit-btn">
                  <span>SUBSCRIBE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="journal-subscribed-badge">
                <CheckCircle2 className="w-4 h-4 text-gold-accent" />
                <span>You have been inscribed into our private gazette.</span>
              </div>
            )}
            <span className="journal-privacy-text">Published quarterly. Strictly confidential. Zero solicitation.</span>
          </div>
        </div>

        {/* Master Navigation & Heritage Directory */}
        <div className="footer-directory-grid">
          {/* Column 1: The Atelier & Identity */}
          <div className="footer-column brand-col">
            <h4 className="col-heading">THE ATELIER</h4>
            <p className="brand-statement">
              Freestyle is a global luxury event atelier dedicated to the choreography of
              monumental celebrations, sacred vivah rituals, and transcendent private galas.
            </p>
            <div className="atelier-beacon-row">
              <span className="beacon-indicator" />
              <span>Udaipur · Mumbai · London · Dubai</span>
            </div>
          </div>

          {/* Column 2: Navigation Directory */}
          <div className="footer-column">
            <h4 className="col-heading">NAVIGATION</h4>
            <ul className="footer-nav-list">
              <li>
                <button type="button" onClick={() => handleNav('home')}>
                  Home · Sanctuary
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('about')}>
                  About · The Philosophy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('services')}>
                  Services · Curation
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('journey')}>
                  Hosted Events · Odyssey
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('gallery')}>
                  The Archives · Constellation
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('contact')}>
                  Contact · Private Salon
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Sacred Ceremonies */}
          <div className="footer-column">
            <h4 className="col-heading">SACRED CEREMONIES</h4>
            <ul className="footer-nav-list">
              <li>
                <a href="#journey">The Ring Exchange · Promise</a>
              </li>
              <li>
                <a href="#journey">Haldi Morning · Golden Glow</a>
              </li>
              <li>
                <a href="#journey">Royal Sangeet · Symphony</a>
              </li>
              <li>
                <a href="#journey">Sacred Vivah · The Seven Vows</a>
              </li>
              <li>
                <a href="#journey">Palace Baraat · Grand Procession</a>
              </li>
              <li>
                <a href="#journey">Grand Reception · Sovereign Gala</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Private Concierge */}
          <div className="footer-column">
            <h4 className="col-heading">PRIVATE CONCIERGE</h4>
            <ul className="footer-nav-list">
              <li>
                <a href="tel:+912948839200">+91 (0) 294 883 9200</a>
              </li>
              <li>
                <a
                  href="https://wa.me/919820045781"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp VIP Concierge
                </a>
              </li>
              <li>
                <a href="mailto:atelier@freestyle-events.com">atelier@freestyle-events.com</a>
              </li>
              <li>
                <span className="availability-tag">Accepting 2026/27 Commissions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Monumental Architectural Brand Wordmark */}
        <div className="footer-monumental-wordmark" aria-hidden="true">
          <span className="wordmark-letters">FREESTYLE</span>
        </div>

        {/* Bottom Bar: Copyright & Return to Summit */}
        <div className="footer-bottom-bar">
          <div className="bottom-legal-group">
            <span className="copyright-tag">
              © {new Date().getFullYear()} FREESTYLE LUXURY EVENTS. ALL RIGHTS RESERVED.
            </span>
            <span className="swiss-craft-tag">
              DESIGNED WITH SWISS ARCHITECTURAL HARMONY & DEVOTION
            </span>
          </div>

          <button
            type="button"
            className="return-to-summit-btn"
            onClick={handleScrollToTop}
            title="Return to Top of Page"
          >
            <span>RETURN TO SUMMIT</span>
            <div className="arrow-disc">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
