import { useNavigate } from 'react-router-dom'
import { Logo, Btn, FadeIn } from '../components/ui'
import { Check, ArrowRight, Zap, Star, Building2, Sparkles } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'For individual developers getting started with agent memory.',
    color: 'border-white/[0.06]',
    accent: 'text-slate-400',
    btn: 'ghost',
    cta: 'Get Started',
    icon: Zap,
    features: [
      '1 Memory Space',
      '5,000 memories',
      '10,000 API calls / month',
      '3 connected agents',
      '30-day snapshot retention',
      '1 branch',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    desc: 'For power users who need more capacity and advanced features.',
    color: 'border-cyan-400/30',
    accent: 'text-cyan-400',
    btn: 'primary',
    cta: 'Start Pro Trial',
    popular: true,
    icon: Star,
    features: [
      '5 Memory Spaces',
      '50,000 memories',
      '100,000 API calls / month',
      '10 connected agents',
      'Unlimited snapshots',
      'Unlimited branches',
      'Contradiction detection',
      'Memory governance rules',
      'Priority support',
    ],
  },
  {
    name: 'Team',
    price: '$99',
    period: '/ month',
    desc: 'For teams sharing memory across projects and agents.',
    color: 'border-violet-400/20',
    accent: 'text-violet-400',
    btn: 'ghost',
    cta: 'Start Team Trial',
    icon: Sparkles,
    features: [
      '20 Memory Spaces',
      '200,000 memories',
      '500,000 API calls / month',
      'Unlimited agents',
      'Unlimited snapshots & branches',
      'Team memory sharing',
      'Advanced governance & audit log',
      'Role-based access control',
      'Dedicated support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For organizations with custom requirements and compliance needs.',
    color: 'border-amber-400/20',
    accent: 'text-amber-400',
    btn: 'ghost',
    cta: 'Contact Sales',
    icon: Building2,
    features: [
      'Unlimited Memory Spaces',
      'Unlimited memories',
      'Unlimited API calls',
      'Unlimited agents',
      'Custom data retention',
      'SSO / SAML integration',
      'Private deployment option',
      'SLA guarantee',
      'Dedicated account manager',
    ],
  },
]

const FAQS = [
  {
    q: 'What counts as a "memory"?',
    a: 'A memory is a single piece of information stored by your agent — a preference, a fact, a procedure, or a working note. Each store/update operation creates or modifies one memory.',
  },
  {
    q: 'What counts as an "API call"?',
    a: 'Every interaction with Memoria through MCP counts as one API call — storing a memory, retrieving memories, searching, creating snapshots, or branching. Reads and writes both count.',
  },
  {
    q: 'Can I upgrade or downgrade anytime?',
    a: 'Yes. Upgrades take effect immediately. Downgrades apply at the end of your billing cycle. Your memories are never deleted on downgrade — they become read-only if over the limit.',
  },
  {
    q: 'What happens when I hit my memory limit?',
    a: 'You\'ll get a warning at 80% usage. At 100%, new memory writes are paused but reads continue working. Upgrade or clean up old memories to resume writes.',
  },
  {
    q: 'Is there a self-hosted option?',
    a: 'Yes. Enterprise plans include the option to deploy Memoria on your own infrastructure with MatrixOne. Contact us for details.',
  },
]

export default function PricingPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-dark-0 font-sans">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-dark-0/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <button onClick={() => nav('/')} className="cursor-pointer">
            <Logo />
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => nav('/')} className="text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">Home</button>
            <a href="https://github.com/matrixorigin/Memoria" target="_blank" rel="noreferrer"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors">GitHub</a>
            <Btn small ghost onClick={() => nav('/auth')}>Sign in</Btn>
            <Btn small primary onClick={() => nav('/auth')}>Get Started Free <ArrowRight size={14} /></Btn>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-cyan-400/[0.03] blur-[120px]" />
        </div>
        <div className="relative">
          <FadeIn>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Pay for what you use — memories stored and API calls made.
              No hidden fees for infrastructure, embedding, or compute.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.08}>
              <div className={`relative p-6 rounded-2xl bg-dark-2 border ${plan.color} flex flex-col h-full transition-all hover:border-white/[0.12]`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-400 text-dark-0">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.accent} bg-white/[0.04]`}>
                    <plan.icon size={16} />
                  </div>
                  <span className="text-lg font-bold">{plan.name}</span>
                </div>
                <div className="mb-3">
                  <span className="text-3xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-sm text-slate-500 ml-1">{plan.period}</span>}
                </div>
                <p className="text-[13px] text-slate-400 leading-relaxed mb-6">{plan.desc}</p>

                <div className="flex-1">
                  <div className="flex flex-col gap-2.5 mb-6">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <Check size={14} className={`${plan.accent} shrink-0 mt-0.5`} />
                        <span className="text-[13px] text-slate-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Btn
                  full
                  primary={plan.btn === 'primary'}
                  ghost={plan.btn === 'ghost'}
                  onClick={() => plan.name === 'Enterprise'
                    ? window.location.href = 'mailto:memoria@matrixorigin.io'
                    : nav('/auth')
                  }
                >
                  {plan.cta} {plan.name !== 'Enterprise' && <ArrowRight size={14} />}
                </Btn>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Usage-based note */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="p-6 rounded-2xl bg-dark-2 border border-white/[0.06]">
              <h3 className="text-sm font-bold mb-3">How billing works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-[13px] text-slate-400">
                <div>
                  <div className="text-slate-200 font-semibold mb-1">🧠 Memories</div>
                  <p>Billed by total memories stored. Each store or update counts. Deleting a memory frees up your quota.</p>
                </div>
                <div>
                  <div className="text-slate-200 font-semibold mb-1">📡 API Calls</div>
                  <p>Every MCP interaction counts — store, retrieve, search, snapshot, branch. Resets monthly.</p>
                </div>
                <div>
                  <div className="text-slate-200 font-semibold mb-1">💰 No surprises</div>
                  <p>All embedding, search, and compute costs are included in your plan. No per-token or per-query charges.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 px-6 border-t border-white/[0.04] pt-16">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-extrabold text-center mb-10">Frequently Asked Questions</h2>
          </FadeIn>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 0.05}>
                <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
                  <h4 className="text-[14px] font-bold mb-2">{faq.q}</h4>
                  <p className="text-[13px] text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl font-black mb-4">Start free, scale as you grow</h2>
            <p className="text-slate-400 mb-6">5,000 memories and 10,000 API calls — no credit card required.</p>
            <Btn primary onClick={() => nav('/auth')}>
              <Zap size={16} /> Create Your Memory Space — Free
            </Btn>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="https://github.com/matrixorigin/Memoria" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">GitHub</a>
            <a href="mailto:memoria@matrixorigin.io" className="hover:text-slate-300 transition-colors">Contact</a>
            <span>© 2026 MatrixOrigin</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
