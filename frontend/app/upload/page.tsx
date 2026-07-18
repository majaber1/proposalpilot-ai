'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div>
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload RFP Document</h1>
        <p className="text-gray-500 mb-8">Upload a PDF, DOCX, or TXT file to analyze with AI</p>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
            dragOver ? 'border-blue-500 bg-blue-50' : 
            file ? 'border-green-400 bg-green-50' : 
            'border-gray-300 bg-white hover:border-blue-400'
          }`}
        >
          {file ? (
            <div>
              <div className="text-4xl mb-3">📄</div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button
                onClick={() => setFile(null)}
                className="mt-3 text-red-500 hover:text-red-700 text-sm underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-4">📤</div>
              <p className="text-lg font-medium text-gray-700">Drag & drop your RFP here</p>
              <p className="text-gray-500 text-sm mb-4">or click to browse</p>
              <label className="cursor-pointer bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                Choose File
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </label>
              <p className="text-gray-400 text-xs mt-3">Supported: PDF, DOCX, DOC, TXT (max 50MB)</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Upload button */}
        {file && !result && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-6 bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 transition"
          >
            {uploading ? '⏳ Uploading & Extracting Text...' : '📤 Upload & Extract Text'}
          </button>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Upload Successful!</h3>
            <p className="text-green-700 text-sm">Document ID: {result.id}</p>
            <p className="text-green-700 text-sm">Text extracted: {result.text_length?.toLocaleString()} characters</p>
            <button
              onClick={handleAnalyze}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              🤖 Analyze with AI →
            </button>
          </div>
        )}

        {/* Sample RFP hint */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm font-medium">💡 Testing Tip</p>
          <p className="text-blue-600 text-xs mt-1">
            Find a sample RFP at <code>samples/sample-rfp.txt</code> in the repository.
            Copy its contents and save as a .txt file to test quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
