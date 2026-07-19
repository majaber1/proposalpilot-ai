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
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:relative z-50 p-2 bg-white text-blue-600 rounded-md">Skip to main content</a>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <header className="bg-white/80 backdrop-blur sticky top-0 z-40 border-b">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">PP</div>
                <span className="font-semibold text-lg">ProposalPilot AI</span>
              </div>

              {/* Responsive nav: details/summary works without client JS */}
              <nav className="hidden md:flex items-center gap-4 text-sm" role="navigation" aria-label="Main navigation">
                <a href="/" className="hover:underline" aria-label="Home">Home</a>
                <a href="/dashboard" className="hover:underline" aria-label="Dashboard">Dashboard</a>
                <a href="/proposal" className="hover:underline" aria-label="Proposals">Proposals</a>
                <a href="/pricing" className="hover:underline" aria-label="Pricing">Pricing</a>
                <a href="/login" className="bg-blue-600 text-white px-3 py-2 rounded-md" aria-label="Get started">Get Started</a>
              </nav>

              <div className="md:hidden">
                <details className="relative">
                  <summary className="list-none cursor-pointer px-3 py-2 rounded-md bg-white/30 hover:bg-white/40">Menu</summary>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</a>
                    <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                    <a href="/proposal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Proposals</a>
                    <a href="/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pricing</a>
                    <a href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Get Started</a>
                  </div>
                </details>
              </div>
            </div>
          </header>

          <main id="main-content" className="container mx-auto px-4 py-8" tabIndex={-1}>
            {children}
          </main>

          <footer className="mt-12 border-t bg-white/60 text-sm text-gray-600">
            <div className="container mx-auto px-4 py-6 text-center">
              <div>ProposalPilot AI — Built with Next.js & FastAPI</div>
              <div className="mt-1">100% Local AI — Your data stays private</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
