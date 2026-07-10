import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hermès — Blog Nouvelle Génération',
  description:
    'L\'art du message à l\'ère numérique. Blog nouvelle génération par Hermès, messager des idées.',
  openGraph: {
    title: 'Hermès — Blog Nouvelle Génération',
    description:
      'L\'art du message à l\'ère numérique. Blog nouvelle génération par Hermès, messager des idées.',
    type: 'website',
    siteName: 'Hermès Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hermès — Blog Nouvelle Génération',
    description:
      'L\'art du message à l\'ère numérique. Blog nouvelle génération par Hermès.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
