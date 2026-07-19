'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, UploadCloud, X, Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedTypes.includes('.' + ext)) {
      setError('Please upload a PDF, DOCX, DOC, or TXT file');
      return;
    }
    setFile(selectedFile);
    setError('');
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const err = await response.json();
        setError(err.detail || 'Upload failed');
      }
    } catch (e) {
      setError('Connection failed. Make sure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!result) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ document_id: result.id }),
      });

      if (response.ok) {
        const analysis = await response.json();
        router.push(`/analysis?analysisId=${analysis.id}`);
      }
    } catch (e) {
      setError('Failed to start analysis');
    }
  };

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
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 text-sm font-medium inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Upload RFP Document</h1>
        <p className="text-slate-500 mb-8">Upload a PDF, DOCX, or TXT file to analyze with AI</p>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
            dragOver ? 'border-brand-400 bg-brand-50' :
            file ? 'border-emerald-300 bg-emerald-50' :
            'border-slate-300 bg-white hover:border-brand-300'
          }`}
        >
          {file ? (
            <div>
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button
                onClick={() => setFile(null)}
                className="mt-3 text-red-500 hover:text-red-700 text-sm font-medium inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-700">Drag &amp; drop your RFP here</p>
              <p className="text-slate-500 text-sm mb-4">or click to browse</p>
              <label className="btn-primary cursor-pointer inline-flex">
                Choose File
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </label>
              <p className="text-slate-400 text-xs mt-3">Supported: PDF, DOCX, DOC, TXT (max 50MB)</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {file && !result && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary w-full mt-6 py-3 text-base"
          >
            {uploading ? 'Uploading & Extracting Text...' : 'Upload & Extract Text'}
          </button>
        )}

        {result && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Upload Successful!
            </h3>
            <p className="text-emerald-700 text-sm">Document ID: {result.id}</p>
            <p className="text-emerald-700 text-sm">Text extracted: {result.text_length?.toLocaleString()} characters</p>
            <button
              onClick={handleAnalyze}
              className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Analyze with AI
            </button>
          </div>
        )}

        <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4 flex gap-2.5">
          <Lightbulb className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-brand-800 text-sm font-medium">Testing Tip</p>
            <p className="text-brand-600 text-xs mt-1">
              Find a sample RFP at <code>samples/sample-rfp.txt</code> in the repository.
              Copy its contents and save as a .txt file to test quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
