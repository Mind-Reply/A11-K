import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'The Sofia Tech Ledger | Софийски Технологичен Регистър', description: 'Evidence-led intelligence on Sofia SME digitalisation and the Bulgarian technology ecosystem.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
