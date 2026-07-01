'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
    { key: 'requirements', label: '📋 Requirements', data: analysis?.requirements },
    { key: 'questions', label: '❓ Clarifications', data: analysis?.clarification_questions },
    { key: 'risks', label: '⚠️ Risks', data: analysis?.risks },
    { key: 'assumptions', label: '📌 Assumptions', data: analysis?.assumptions },
    { key: 'outline', label: '📝 Outline', data: analysis?.proposal_outline },
    { key: 'summary', label: '✨ Executive Summary', data: analysis?.executive_summary },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">ProposalPilot AI — Analysis</span>
        <div className="flex gap-4">
          {analysis?.status === 'completed' && (
            <button onClick={exportMarkdown} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
              📥 Export Markdown
            </button>
          )}
          <Link href="/dashboard" className="text-blue-200 hover:text-white text-sm">← Dashboard</Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {!analysisId && !analysis && docId && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Ready to Analyze</h2>
            <p className="text-gray-500 mb-6">Click below to start AI analysis (may take 1-3 minutes)</p>
            <button onClick={startAnalysis} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800">
              🤖 Start AI Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-bounce">🤖</div>
            <h2 className="text-xl font-semibold mb-2">AI is analyzing your document...</h2>
            <p className="text-gray-500">This may take 1-3 minutes depending on document size</p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}

        {analysis?.status === 'completed' && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">✅ Analysis Complete</span>
              <span className="text-gray-500 text-sm">Model: {analysis.model_used}</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.key ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-sans">
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
