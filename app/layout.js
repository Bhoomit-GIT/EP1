import { Plus_Jakarta_Sans, Cormorant_Garamond, Caveat } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-primary',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-script',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://freestyle-events.vercel.app'),
  title: 'FREESTYLE — Event Management Studio',
  description: 'Freestyle is an independent event management studio crafting meaningful moments for weddings, festivals, corporate gatherings, and communities.',
  keywords: ['event management', 'luxury weddings', 'event studio', 'curated celebrations', 'freestyle events'],
  authors: [{ name: 'Freestyle Events Studio' }],
  creator: 'Freestyle Events',
  openGraph: {
    title: 'FREESTYLE — Event Management Studio',
    description: 'Crafting meaningful moments for brands, people and communities.',
    url: 'https://freestyle-events.vercel.app',
    siteName: 'FREESTYLE Events Studio',
    images: [
      {
        url: '/assets/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Freestyle Event Studio Showcase',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREESTYLE — Event Management Studio',
    description: 'Crafting meaningful moments for brands, people and communities.',
    images: ['/assets/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${cormorant.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
