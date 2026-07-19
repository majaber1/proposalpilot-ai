'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ArrowLeft, RefreshCw, Info } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function SettingsPage() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    company_name: 'Your Company Name',
    model: 'qwen2.5:7b-instruct',
    ollama_url: 'http://ollama:11434'
  })

  useEffect(() => {
    fetchHealth()
  }, [])

  const fetchHealth = async () => {
    const token = Cookies.get('token')
    try {
      const res = await axios.get(`${API_URL}/health`, { headers: { Authorization: `Bearer ${token || ''}` } })
      setHealth(res.data)
    } catch(e) {
      setHealth({ status: 'unhealthy', error: 'Cannot reach backend' })
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="app-nav">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 text-sm font-medium inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="text-slate-900 font-semibold">Settings</span>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        <div className="card p-6">
          <h2 className="text-slate-900 font-semibold text-lg mb-4">System Health</h2>
          {loading ? <p className="text-slate-500 text-sm">Checking...</p> : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-slate-600">Backend API: <span className={`font-medium ${health?.status === 'healthy' ? 'text-emerald-600' : 'text-red-600'}`}>{health?.status}</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${health?.ollama_status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <span className="text-sm text-slate-600">Ollama: <span className="font-medium text-slate-800">{health?.ollama_status || 'unknown'}</span></span>
              </div>
              {health?.model_ready !== undefined && (
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${health.model_ready ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span className="text-sm text-slate-600">Model Ready: <span className="font-medium text-slate-800">{health.current_model}</span></span>
                </div>
              )}
              <button onClick={fetchHealth} className="text-brand-600 hover:text-brand-700 text-sm mt-2 transition-colors inline-flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
              </button>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-slate-900 font-semibold text-lg mb-4">AI Model Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Active Model</label>
              <select value={settings.model} onChange={e => setSettings({...settings, model: e.target.value})}
                className="input-field">
                <option value="qwen2.5:7b-instruct">qwen2.5:7b-instruct (Default)</option>
                <option value="llama3.1:8b">llama3.1:8b</option>
                <option value="mistral:7b">mistral:7b</option>
              </select>
              <p className="text-slate-400 text-xs mt-1.5">Change via OLLAMA_MODEL in .env file and restart containers</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name (for proposals)</label>
              <input value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})}
                className="input-field"
                placeholder="Your Company Name" />
            </div>
          </div>
          <div className="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-lg text-brand-700 text-xs">
            <p className="font-medium mb-1.5">To change models:</p>
            <code className="block bg-white border border-brand-100 px-3 py-2 rounded mt-1 text-brand-700">
              ollama pull qwen2.5:7b-instruct<br/>
              ollama pull llama3.1:8b<br/>
              ollama pull mistral:7b
            </code>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-slate-900 font-semibold text-lg mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" /> About ProposalPilot AI
          </h2>
          <div className="text-slate-500 text-sm space-y-2">
            <p>Version: 1.0.0 MVP</p>
            <p>AI Runtime: Ollama (Local, no paid APIs)</p>
            <p>Supported Models: Qwen 2.5, Llama 3.1, Mistral 7B</p>
            <p>Built for: IT companies, presales teams, system integrators</p>
          </div>
        </div>
      </main>
    </div>
  )
}
