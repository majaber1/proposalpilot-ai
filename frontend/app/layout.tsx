import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProposalPilot AI - AI-Powered Proposal Assistant',
  description: 'Upload RFPs and generate professional proposals with local AI. No paid APIs required.',
  keywords: ['RFP', 'proposal generator', 'AI', 'presales', 'tender response'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className={inter.className + ' antialiased text-slate-900'}>{children}</body>
    </html>
    );
}
