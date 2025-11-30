import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Ask Max (Light) - Max Thunberg UX Portfolio',
  description: 'Chat with an AI version of Max Thunberg, UX Design Lead',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
