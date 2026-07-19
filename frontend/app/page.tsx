import Link from 'next/link';
import { FileText, Search, ClipboardList, ShieldAlert, HelpCircle, Download, ArrowRight, Sparkles, Check } from 'lucide-react';

const features = [
  { icon: FileText, title: 'Upload Any RFP', desc: 'Support for PDF, DOCX, and TXT formats. AI extracts all requirements automatically.' },
  { icon: Search, title: 'Smart Analysis', desc: 'AI identifies requirements, risks, assumptions, and clarification questions instantly.' },
  { icon: ClipboardList, title: 'Generate Proposals', desc: 'Get a complete proposal outline and executive summary ready to present.' },
  { icon: ShieldAlert, title: 'Risk Detection', desc: 'Automatically identify project risks with severity ratings and mitigation strategies.' },
  { icon: HelpCircle, title: 'Clarification Q&A', desc: 'Generate the right questions to ask clients before writing your proposal.' },
  { icon: Download, title: 'Export to Markdown', desc: 'Export your complete proposal as Markdown, ready to paste into any document.' },
];

const plans = [
  { name: 'Starter', price: 'SAR 299', period: '/month', features: ['10 documents/month', '1 user', 'All AI features', 'Markdown export', 'Email support'] },
  { name: 'Team', price: 'SAR 999', period: '/month', features: ['100 documents/month', '5 users', 'All AI features', 'Priority support', 'Custom templates'], popular: true },
  { name: 'Enterprise', price: 'SAR 3,000+', period: '/month', features: ['Unlimited documents', 'Unlimited users', 'Custom AI training', 'Dedicated support', 'SLA guarantee'] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.35),rgba(255,255,255,0))]" />

      <nav className="relative border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-xs">PP</span>
            </div>
            <span className="text-white font-semibold text-lg">ProposalPilot AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-slate-300 hover:text-white transition text-sm font-medium px-3 py-2">
              Login
            </Link>
            <Link href="/login" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-slate-300 text-xs font-medium">Powered by Ollama + Qwen 2.5 (Local AI)</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          Win More Deals with<br />
          <span className="bg-gradient-to-r from-brand-400 to-indigo-300 bg-clip-text text-transparent">AI-Powered Proposals</span>
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your RFP, let AI extract requirements, identify risks, and generate
          professional proposal outlines in minutes, not days.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login" className="btn-primary px-8 py-3.5 text-base">
            Start Free Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="btn px-8 py-3.5 text-base bg-white/5 text-white border border-white/10 hover:bg-white/10">
            See How It Works
          </a>
        </div>
        <p className="mt-8 text-slate-500 text-xs">No paid APIs required &middot; 100% local AI &middot; Your data stays private</p>
      </div>

      <div id="features" className="relative max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Everything You Need to Win Proposals</h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">A complete toolkit that takes you from raw RFP to polished proposal.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:bg-white/[0.06] transition-colors">
                <div className="w-11 h-11 bg-brand-600/20 border border-brand-500/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-xl p-6 border ${plan.popular ? 'bg-brand-600 border-brand-500 shadow-soft scale-105' : 'bg-white/[0.03] border-white/10'}`}>
              {plan.popular && (
                <div className="text-[11px] font-bold mb-3 bg-white text-brand-700 inline-block px-2.5 py-1 rounded-full tracking-wide">
                  MOST POPULAR
                </div>
              )}
              <h3 className={`text-lg font-semibold mb-1 ${plan.popular ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
              <div className={`text-3xl font-bold mb-5 ${plan.popular ? 'text-white' : 'text-white'}`}>
                {plan.price}<span className="text-sm font-normal opacity-70">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm ${plan.popular ? 'text-white/90' : 'text-slate-400'}`}>
                    <Check className="w-4 h-4 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition ${plan.popular ? 'bg-white text-brand-700 hover:bg-slate-100' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-slate-500 text-sm">
          <p>ProposalPilot AI, built with Next.js, FastAPI &amp; Ollama. MIT License</p>
          <p className="mt-1">100% Local AI, no paid API keys required. Your data stays private.</p>
        </div>
      </footer>
    </div>
  );
}
