import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Orbitron, Rajdhani, Share_Tech_Mono } from 'next/font/google';
import '../styles/tailwind.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Ba Guru Game Adu — Play Now',
  description: 'Ba Guru Game Adu is a hyper-modern arcade experience. Jump in, play 3D mini-games instantly, and join the most electric gaming community online.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${orbitron.variable} ${shareTechMono.variable}`}>
      <body className={rajdhani.className}>
        {children}
      </body>
    </html>
  );
}
