import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neural PDF Intelligence',
  description: 'AI-powered PDF question answering system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
