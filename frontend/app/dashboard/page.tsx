'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, CheckCircle2, Cog, Bot, Plus, LogOut, Settings as SettingsIcon, AlertTriangle, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Document {
  id: number;
  filename: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDocuments();
    checkAIStatus();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/documents/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (e) {
      console.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const checkAIStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/analysis/health`);
      if (res.ok) setAiStatus(await res.json());
    } catch (e) {
      setAiStatus({ status: 'error', message: 'Cannot connect to Ollama' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const stats = [
    { label: 'Total Documents', value: documents.length, icon: FileText, color: 'bg-brand-50 text-brand-600' },
    { label: 'Analyzed', value: documents.filter(d => d.status === 'analyzed').length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Processing', value: documents.filter(d => d.status === 'processing').length, icon: Cog, color: 'bg-amber-50 text-amber-600' },
    { label: 'AI Status', value: aiStatus?.status === 'ok' ? 'Online' : 'Offline', icon: Bot, color: aiStatus?.status === 'ok' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="app-nav">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">PP</span>
            </div>
            <span className="font-semibold text-slate-900">ProposalPilot AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/upload" className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Upload RFP
            </Link>
            <Link href="/settings" className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">
              <SettingsIcon className="w-4 h-4" />
            </Link>
            <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {aiStatus?.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium text-sm">AI Service Offline</p>
              <p className="text-red-600 text-sm mt-1">
                Make sure Ollama is running: <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">ollama pull qwen2.5:7b-instruct</code>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card p-6">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Recent Documents</h2>
            <Link href="/upload" className="text-brand-600 hover:text-brand-700 text-sm font-medium inline-flex items-center gap-1">
              Upload New <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-slate-500 text-center py-8">Loading...</p>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-base font-medium text-slate-900 mb-1">No documents yet</h3>
                <p className="text-slate-500 text-sm mb-5">Upload your first RFP to get started</p>
                <Link href="/upload" className="btn-primary text-sm inline-flex">
                  Upload RFP
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition">
                    <div>
                      <p className="font-medium text-slate-900">{doc.filename}</p>
                      <p className="text-slate-500 text-sm">{new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${
                        doc.status === 'analyzed' ? 'bg-emerald-100 text-emerald-700' :
                        doc.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {doc.status}
                      </span>
                      <Link href={`/analysis?docId=${doc.id}`} className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                        Analyze &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
