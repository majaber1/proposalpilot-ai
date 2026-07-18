import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 mb-6">
          <span className="text-blue-700 text-sm">Powered by Ollama + Qwen 2.5 (Local AI)</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Win More Deals with<br />
          <span className="text-blue-600">AI-Powered Proposals</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your RFP, let AI extract requirements, identify risks, and generate professional proposal outlines in minutes.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            aria-label="Start free demo">
            Start Free Demo
          </Link>
          <a href="#features"
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-50 transition"
            aria-label="See how it works">
            See How It Works
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Everything You Need to Win Proposals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📄", title: "Upload Any RFP", desc: "Support for PDF, DOCX, and TXT formats. AI extracts all requirements automatically." },
            { icon: "🔍", title: "Smart Analysis", desc: "AI identifies requirements, risks, assumptions, and clarification questions instantly." },
            { icon: "📝", title: "Generate Proposals", desc: "Get a complete proposal outline and executive summary ready to present." },
            { icon: "⚠️", title: "Risk Detection", desc: "Automatically identify project risks with severity ratings and mitigation strategies." },
            { icon: "❓", title: "Clarification Q&A", desc: "Generate the right questions to ask clients before writing your proposal." },
            { icon: "📤", title: "Export to Markdown", desc: "Export your complete proposal as Markdown, ready to paste into any document." },
          ].map((feature, i) => (
            <div key={i} className="bg-white shadow-sm rounded-xl p-6">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Starter", price: "SAR 299", period: "/month", features: ["10 documents/month", "1 user", "All AI features", "Markdown export", "Email support"] },
            { name: "Team", price: "SAR 999", period: "/month", features: ["100 documents/month", "5 users", "All AI features", "Priority support", "Custom templates"], popular: true },
            { name: "Enterprise", price: "SAR 3,000+", period: "/month", features: ["Unlimited documents", "Unlimited users", "Custom AI training", "Dedicated support", "SLA guarantee"] },
          ].map((plan, i) => (
            <div key={i} className={`rounded-xl p-6 ${plan.popular ? 'bg-blue-600 text-white' : 'bg-white'} shadow` }>
              {plan.popular && <div className="text-xs font-bold mb-2 inline-block px-2 py-1 rounded">MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="text-2xl font-bold mb-4">{plan.price}<span className="text-sm font-normal">{plan.period}</span></div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <span>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`block text-center py-2 rounded-lg font-semibold ${plan.popular ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} transition`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
