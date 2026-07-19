'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Connection failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.35),rgba(255,255,255,0))]" />

      <div className="relative w-full max-w-md">
        <div className="card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
              <span className="text-white font-bold text-xl">PP</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">ProposalPilot AI</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-lg p-3 mb-6 flex gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-brand-800 text-sm font-medium">Demo Mode</p>
              <p className="text-brand-600 text-xs mt-0.5">Email: admin@demo.com &middot; Password: demo123</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
