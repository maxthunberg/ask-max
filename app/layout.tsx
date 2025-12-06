import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Max Thunberg – UX Leadership, Design Strategy och Modernisering',
  description: 'Max Thunberg, UX Leader inom Volvo Group. Fokus på UX leadership, modernisering av verktyg för ingenjörer och designbaserad förändring. Fråga mig vad som helst.',
  keywords: ['Max Thunberg', 'UX Design', 'UX Lead', 'Volvo Group', 'Design Leadership', 'UX Portfolio', 'AI Chat', 'Design Systems', 'User Experience'],
  authors: [{ name: 'Max Thunberg' }],
  creator: 'Max Thunberg',
  publisher: 'Max Thunberg',
  openGraph: {
    title: 'Max Thunberg – UX Leadership, Design Strategy och Modernisering',
    description: 'Max Thunberg, UX Leader inom Volvo Group. Fokus på UX leadership, modernisering av verktyg för ingenjörer och designbaserad förändring. Fråga mig vad som helst.',
    url: 'https://maxthunberg.com',
    siteName: 'Max Thunberg Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Max Thunberg – UX Leadership, Design Strategy och Modernisering',
    description: 'Max Thunberg, UX Leader inom Volvo Group. Fokus på UX leadership, modernisering av verktyg för ingenjörer och designbaserad förändring.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}