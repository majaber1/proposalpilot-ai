'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Bot, ClipboardList, HelpCircle, ShieldAlert, StickyNote, FileEdit, Sparkles } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  const docId = searchParams.get('docId');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [activeTab, setActiveTab] = useState('requirements');

  useEffect(() => {
    if (analysisId) {
      setLoading(true);
      pollAnalysis(parseInt(analysisId));
    }
  }, [analysisId]);

  const startAnalysis = async () => {
    if (!docId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/analysis/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ document_id: parseInt(docId) }),
      });
      if (res.ok) {
        const data = await res.json();
        pollAnalysis(data.id);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const pollAnalysis = async (id: number) => {
    setPolling(true);
    const poll = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/analysis/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
          if (data.status === 'processing') {
            setTimeout(poll, 3000);
          } else {
            setLoading(false);
            setPolling(false);
          }
        }
      } catch (e) {
        setLoading(false);
        setPolling(false);
      }
    };
    await poll();
  };

  const exportMarkdown = async () => {
    if (!analysis) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/proposals/${analysis.id}/export/markdown`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'proposal.md';
      a.click();
    }
  };

  const tabs = [
    { key: 'requirements', label: 'Requirements', icon: ClipboardList, data: analysis?.requirements },
    { key: 'questions', label: 'Clarifications', icon: HelpCircle, data: analysis?.clarification_questions },
    { key: 'risks', label: 'Risks', icon: ShieldAlert, data: analysis?.risks },
    { key: 'assumptions', label: 'Assumptions', icon: StickyNote, data: analysis?.assumptions },
    { key: 'outline', label: 'Outline', icon: FileEdit, data: analysis?.proposal_outline },
    { key: 'summary', label: 'Executive Summary', icon: Sparkles, data: analysis?.executive_summary },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="app-nav">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">PP</span>
            </div>
            <span className="font-semibold text-slate-900">Analysis</span>
          </div>
          <div className="flex items-center gap-3">
            {analysis?.status === 'completed' && (
              <button onClick={exportMarkdown} className="btn-primary text-sm bg-emerald-600 hover:bg-emerald-500">
                <Download className="w-4 h-4" /> Export Markdown
              </button>
            )}
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 text-sm font-medium inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!analysisId && !analysis && docId && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Ready to Analyze</h2>
            <p className="text-slate-500 mb-6">Click below to start AI analysis (may take 1-3 minutes)</p>
            <button onClick={startAnalysis} className="btn-primary text-base px-8 py-3">
              <Bot className="w-4 h-4" /> Start AI Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-brand-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">AI is analyzing your document...</h2>
            <p className="text-slate-500">This may take 1-3 minutes depending on document size</p>
            <div className="mt-5 flex justify-center gap-2">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}

        {analysis?.status === 'completed' && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="badge bg-emerald-100 text-emerald-700">Analysis Complete</span>
              <span className="text-slate-500 text-sm">Model: {analysis.model_used}</span>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition inline-flex items-center gap-1.5 ${
                      activeTab === tab.key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="card p-6">
              <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed font-sans">
                {tabs.find(t => t.key === activeTab)?.data || 'No content for this section'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
