import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A11-K Flight Deck | Mind-Reply',
  description: 'A calm operator surface for the Mind-Reply estate: watch, command, gate, dispatch and verify with evidence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
