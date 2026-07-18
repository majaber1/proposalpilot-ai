'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ProposalPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [outline, setOutline] = useState('')
  const [assumptions, setAssumptions] = useState('')
  const [activeTab, setActiveTab] = useState<'outline' | 'assumptions'>('outline')

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) return
    const token = Cookies.get('token')
    if (!token) return
    axios.get(`${API_URL}/analysis/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const generateContent = async (type: 'outline' | 'assumptions') => {
    const id = searchParams.get('id')
    const token = Cookies.get('token')
    if (!id || !token) return
    setGenerating(true)
    try {
      const res = await axios.post(`${API_URL}/proposals/${id}/${type}`, {}, {
        headers: { Authorization: `Bearer ${token}` }, timeout: 300000
      })
      if (type === 'outline') setOutline(res.data.content || res.data.outline || JSON.stringify(res.data, null, 2))
      else setAssumptions(res.data.content || res.data.assumptions || JSON.stringify(res.data, null, 2))
    } catch(e: any) {
      const msg = e.response?.data?.detail || 'Generation failed'
      if (type === 'outline') setOutline(msg)
      else setAssumptions(msg)
    } finally { setGenerating(false) }
  }

  const exportMarkdown = () => {
    const id = searchParams.get('id')
    window.open(`${API_URL}/proposals/${id}/export`, '_blank')
  }

  return (
    <div>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {data && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">{data.title || 'Proposal Generator'}</h1>
            <p className="text-slate-400 mt-1">{data.document?.original_filename}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('outline')}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'outline' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            📋 Proposal Outline
          </button>
          <button onClick={() => setActiveTab('assumptions')}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'assumptions' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            📌 Assumptions
          </button>
        </div>

        {activeTab === 'outline' && (
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Proposal Outline</h2>
              <button onClick={() => generateContent('outline')} disabled={generating}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {generating ? '🤖 Generating...' : '✨ Generate Outline'}
              </button>
            </div>
            {outline ? (
              <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed font-mono bg-slate-900/50 p-4 rounded-lg overflow-y-auto max-h-[600px]">
                {outline}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-3">📋</p>
                <p>Click "Generate Outline" to create a proposal structure based on the RFP</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assumptions' && (
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Project Assumptions</h2>
              <button onClick={() => generateContent('assumptions')} disabled={generating}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {generating ? '🤖 Generating...' : '✨ Generate Assumptions'}
              </button>
            </div>
            {assumptions ? (
              <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed bg-slate-900/50 p-4 rounded-lg overflow-y-auto max-h-[600px]">
                {assumptions}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-3">📌</p>
                <p>Click "Generate Assumptions" to create project assumptions list</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
