import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProposalPilot AI - AI-Powered Proposal Assistant',
  description: 'Upload RFPs and generate professional proposals with local AI. No paid APIs required.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <header className="bg-white/80 backdrop-blur sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">PP</div>
                <span className="font-semibold text-lg">ProposalPilot AI</span>
              </div>
              <nav className="flex items-center gap-4 text-sm">
                <a href="/" className="hover:underline">Home</a>
                <a href="/dashboard" className="hover:underline">Dashboard</a>
                <a href="/proposal" className="hover:underline">Proposals</a>
                <a href="/pricing" className="hover:underline">Pricing</a>
                <a href="/login" className="bg-blue-600 text-white px-3 py-2 rounded-md">Get Started</a>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-6 py-8">{children}</main>
          <footer className="mt-12 border-t bg-white/60 text-sm text-gray-600">
            <div className="container mx-auto px-6 py-6 text-center">
              <div>ProposalPilot AI — Built with Next.js & FastAPI</div>
              <div className="mt-1">100% Local AI — Your data stays private</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
