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

export const metadata = {
  title: 'FREESTYLE — Event Management Studio',
  description: 'Freestyle is an independent event management studio crafting meaningful moments for brands, people and communities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${cormorant.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
