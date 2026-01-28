import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eden Dashboard',
  description: 'AI Employee Work Tracker',
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
