import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-900 font-bold text-sm">PP</span>
          </div>
          <span className="text-white font-bold text-xl">ProposalPilot AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-white hover:text-blue-200 transition">
            Login
          </Link>
          <Link href="/login" className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center bg-blue-800 rounded-full px-4 py-2 mb-6">
          <span className="text-blue-200 text-sm">Powered by Ollama + Qwen 2.5 (Local AI)</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Win More Deals with<br />
          <span className="text-yellow-400">AI-Powered Proposals</span>
        </h1>
        <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Upload your RFP, let AI extract requirements, identify risks, and generate
          professional proposal outlines in minutes — not days.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login"
            className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition">
            Start Free Demo
          </Link>
          <a href="#features"
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition">
            See How It Works
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything You Need to Win Proposals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📄", title: "Upload Any RFP", desc: "Support for PDF, DOCX, and TXT formats. AI extracts all requirements automatically." },
            { icon: "🔍", title: "Smart Analysis", desc: "AI identifies requirements, risks, assumptions, and clarification questions instantly." },
            { icon: "📝", title: "Generate Proposals", desc: "Get a complete proposal outline and executive summary ready to present." },
            { icon: "⚠️", title: "Risk Detection", desc: "Automatically identify project risks with severity ratings and mitigation strategies." },
            { icon: "❓", title: "Clarification Q&A", desc: "Generate the right questions to ask clients before writing your proposal." },
            { icon: "📤", title: "Export to Markdown", desc: "Export your complete proposal as Markdown, ready to paste into any document." },
          ].map((feature, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-xl p-6 text-white">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-blue-200 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Starter", price: "SAR 299", period: "/month", features: ["10 documents/month", "1 user", "All AI features", "Markdown export", "Email support"] },
            { name: "Team", price: "SAR 999", period: "/month", features: ["100 documents/month", "5 users", "All AI features", "Priority support", "Custom templates"], popular: true },
            { name: "Enterprise", price: "SAR 3,000+", period: "/month", features: ["Unlimited documents", "Unlimited users", "Custom AI training", "Dedicated support", "SLA guarantee"] },
          ].map((plan, i) => (
            <div key={i} className={`rounded-xl p-6 ${plan.popular ? 'bg-yellow-400 text-blue-900' : 'bg-white bg-opacity-10 text-white'}`}>
              {plan.popular && <div className="text-xs font-bold mb-2 bg-blue-900 text-yellow-400 inline-block px-2 py-1 rounded">MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">{plan.price}<span className="text-sm font-normal">{plan.period}</span></div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <span>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`block text-center py-2 rounded-lg font-semibold ${plan.popular ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-white text-blue-900 hover:bg-blue-50'} transition`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-blue-300 text-sm">
        <p>ProposalPilot AI — Built with Next.js, FastAPI & Ollama | MIT License</p>
        <p className="mt-1">100% Local AI — No paid API keys required | Your data stays private</p>
      </footer>
    </div>
  );
}
