'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie'

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
    <div>
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* System Health */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">System Health</h2>
          {loading ? <p className="text-slate-400 text-sm">Checking...</p> : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${health?.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-slate-300">Backend API: <span className={`font-medium ${health?.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>{health?.status}</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${health?.ollama_status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-sm text-slate-300">Ollama: <span className="font-medium text-slate-200">{health?.ollama_status || 'unknown'}</span></span>
              </div>
              {health?.model_ready !== undefined && (
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${health.model_ready ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-sm text-slate-300">Model Ready: <span className="font-medium text-slate-200">{health.current_model}</span></span>
                </div>
              )}
              <button onClick={fetchHealth} className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors">↺ Refresh Status</button>
            </div>
          )}
        </div>

        {/* AI Model Settings */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">AI Model Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Active Model</label>
              <select value={settings.model} onChange={e => setSettings({...settings, model: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="qwen2.5:7b-instruct">qwen2.5:7b-instruct (Default)</option>
                <option value="llama3.1:8b">llama3.1:8b</option>
                <option value="mistral:7b">mistral:7b</option>
              </select>
              <p className="text-slate-500 text-xs mt-1">Change via OLLAMA_MODEL in .env file and restart containers</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company Name (for proposals)</label>
              <input value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="Your Company Name" />
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 text-xs">
            <p className="font-medium mb-1">To change models:</p>
            <code className="block bg-slate-900 px-3 py-2 rounded mt-1 text-blue-200">
              ollama pull qwen2.5:7b-instruct<br/>
              ollama pull llama3.1:8b<br/>
              ollama pull mistral:7b
            </code>
          </div>
        </div>

        {/* About */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">About ProposalPilot AI</h2>
          <div className="text-slate-400 text-sm space-y-2">
            <p>Version: 1.0.0 MVP</p>
            <p>AI Runtime: Ollama (Local — No paid APIs)</p>
            <p>Supported Models: Qwen 2.5, Llama 3.1, Mistral 7B</p>
            <p>Built for: IT companies, presales teams, system integrators</p>
          </div>
        </div>
      </main>
    </div>
  )
}
