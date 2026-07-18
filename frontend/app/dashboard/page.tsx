'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    { label: 'Total Documents', value: documents.length, icon: '📄', color: 'bg-blue-500' },
    { label: 'Analyzed', value: documents.filter(d => d.status === 'analyzed').length, icon: '✅', color: 'bg-green-500' },
    { label: 'Processing', value: documents.filter(d => d.status === 'processing').length, icon: '⚙️', color: 'bg-yellow-500' },
    { label: 'AI Status', value: aiStatus?.status === 'ok' ? 'Online' : 'Offline', icon: '🤖', color: aiStatus?.status === 'ok' ? 'bg-green-500' : 'bg-red-500' },
  ];

  return (
    <div>

      <div className="container mx-auto px-6 py-8">
        {/* AI Status Banner */}
        {aiStatus?.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">⚠️ AI Service Offline</p>
            <p className="text-red-600 text-sm mt-1">
              Make sure Ollama is running: <code className="bg-red-100 px-1 rounded">ollama pull qwen2.5:7b-instruct</code>
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
            <Link href="/upload" className="text-blue-600 hover:underline text-sm">Upload New →</Link>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-500 mb-4">Upload your first RFP to get started</p>
                <Link href="/upload" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                  Upload RFP
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{doc.filename}</p>
                      <p className="text-gray-500 text-sm">{new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'analyzed' ? 'bg-green-100 text-green-700' :
                        doc.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.status}
                      </span>
                      <Link href={`/analysis?docId=${doc.id}`} className="text-blue-600 hover:underline text-sm">
                        Analyze →
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
