import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo, Btn, MiniTerm, AgentBadge, FadeIn } from '../components/ui'
import {
  GitBranch, Shield, Search, Zap, Users, Clock,
  ArrowRight, ChevronRight, Database, Lock
} from 'lucide-react'

const FEATURES = [
  {
    icon: <GitBranch size={20} />,
    title: 'Git for Memory',
    desc: 'Manage memories like code. Snapshot, branch, merge, rollback — all zero-copy.',
    color: 'text-cyan-400',
  },
  {
    icon: <Shield size={20} />,
    title: 'Secure & Auditable',
    desc: 'Full provenance chain on every mutation. Contradiction detection and low-confidence quarantine.',
    color: 'text-emerald-400',
  },
  {
    icon: <Search size={20} />,
    title: 'Semantic Retrieval',
    desc: 'Vector + full-text hybrid search. Retrieve memories by meaning, not just keywords.',
    color: 'text-violet-400',
  },
  {
    icon: <Users size={20} />,
    title: 'Multi-Agent Sharing',
    desc: 'Cursor, Claude Code, Kiro, OpenClaw share one memory pool. Context flows seamlessly.',
    color: 'text-amber-400',
  },
  {
    icon: <Clock size={20} />,
    title: 'Time Travel',
    desc: 'Roll back to any point in time. View memory state at any historical snapshot.',
    color: 'text-red-400',
  },
  {
    icon: <Lock size={20} />,
    title: 'Privacy First',
    desc: 'Local embedding model option — no data leaves your machine. Or choose cloud-hosted.',
    color: 'text-cyan-400',
  },
]

const AGENTS = ['Cursor', 'Claude Code', 'Kiro', 'OpenClaw']

const COMPARISONS = [
  { cap: 'Git-level version control', memoria: 'Native zero-copy snapshots & branches', others: 'File-level or none' },
  { cap: 'Isolated experimentation', memoria: 'One-click branch, merge after validation', others: 'Manual data duplication' },
  { cap: 'Audit trail', memoria: 'Full snapshot + provenance on every mutation', others: 'Limited logging' },
  { cap: 'Semantic retrieval', memoria: 'Vector + full-text hybrid search', others: 'Vector only' },
  { cap: 'Multi-agent sharing', memoria: 'Shared trusted memory pool per user', others: 'Siloed per agent' },
]

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-dark-0 font-sans">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-dark-0/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <Logo />
          <div className="flex items-center gap-6">
            <a href="https://github.com/matrixorigin/Memoria" target="_blank" rel="noreferrer"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors">GitHub</a>
            <a href="https://github.com/matrixorigin/Memoria#api-reference" target="_blank" rel="noreferrer"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Docs</a>
            <Btn small ghost onClick={() => nav('/auth')}>Sign in</Btn>
            <Btn small primary onClick={() => nav('/auth')}>Get Started Free <ArrowRight size={14} /></Btn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-400/[0.03] blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-400/[0.02] blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <FadeIn>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold font-mono bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                Powered by MatrixOne
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold font-mono bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                MCP Compatible
              </span>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn delay={0.1}>
                <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                  Your agent's memory,
                  <br />
                  <span className="text-gradient">version-controlled.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                  Persistent memory for Cursor, Claude Code, Kiro, and any MCP agent.
                  Snapshot, branch, merge, rollback — like Git, but for what your agent knows.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex items-center gap-4 mb-10">
                  <Btn primary onClick={() => nav('/auth')}>
                    <Zap size={16} /> Create Memory Space in 60s
                  </Btn>
                  <Btn ghost onClick={() => window.open('https://github.com/matrixorigin/Memoria', '_blank')}>
                    View Source <ChevronRight size={14} />
                  </Btn>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex items-center gap-5">
                  {AGENTS.map(a => (
                    <div key={a} className="flex items-center gap-2">
                      <AgentBadge name={a} size={24} />
                      <span className="text-xs text-slate-500">{a}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.3}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-cyan-400/[0.06] to-transparent blur-xl" />
                <MiniTerm title="memoria setup" lines={[
                  { t: 'pip install memoria-lite', p: true, c: '#E2E8F0' },
                  { t: 'memoria init --cloud', p: true, c: '#E2E8F0' },
                  { t: '' },
                  { t: '✓ Connected to Memoria Cloud', c: '#34D399' },
                  { t: '✓ Created .cursor/mcp.json', c: '#34D399' },
                  { t: '✓ Created .cursor/rules/memory.mdc', c: '#34D399' },
                  { t: '' },
                  { t: '🧠 Ready. Your agent will now remember.', c: '#22D3EE' },
                ]} />
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                  <Database size={12} />
                  <span>5,000 memories free · ∞ snapshots · 3 agents</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-center mb-4">Get Started in 60 Seconds</h2>
            <p className="text-slate-400 text-center mb-14 max-w-lg mx-auto">
              Three steps to give your agent persistent memory. No database provisioning required.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Your Agent',
                desc: 'Pick your coding tool — Cursor, Claude Code, Kiro, or OpenClaw. We generate the right config automatically.',
                color: 'text-cyan-400',
              },
              {
                step: '02',
                title: 'One-Line Install',
                desc: 'A single command sets up everything: MCP server, steering rules, and embedding provider.',
                color: 'text-emerald-400',
              },
              {
                step: '03',
                title: 'Start Chatting',
                desc: 'Restart your agent and start talking. It will remember your preferences, decisions, and project context.',
                color: 'text-violet-400',
              },
            ].map((s, i) => (
              <FadeIn key={s.step} delay={i * 0.1}>
                <div className="p-6 rounded-xl bg-dark-2 border border-white/[0.06] hover:border-white/[0.1] transition-colors h-full">
                  <div className={`text-3xl font-black font-mono ${s.color} mb-3`}>{s.step}</div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-center mb-4">Why Memoria</h2>
            <p className="text-slate-400 text-center mb-14 max-w-lg mx-auto">
              Not just memory storage. Memoria makes memory version-controlled, auditable, and governable.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}>
                <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06] hover:border-white/[0.1] transition-all group">
                  <div className={`${f.color} mb-3`}>{f.icon}</div>
                  <h3 className="text-[15px] font-bold mb-1.5">{f.title}</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-center mb-4">Comparison</h2>
            <p className="text-slate-400 text-center mb-10">Memoria vs Mem0 / Letta / Traditional RAG</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="grid grid-cols-3 bg-dark-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="px-5 py-3">Capability</div>
                <div className="px-5 py-3 text-cyan-400">Memoria</div>
                <div className="px-5 py-3">Others</div>
              </div>
              {COMPARISONS.map((r) => (
                <div key={r.cap} className="grid grid-cols-3 border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <div className="px-5 py-3 text-sm font-medium">{r.cap}</div>
                  <div className="px-5 py-3 text-sm text-cyan-400">{r.memoria}</div>
                  <div className="px-5 py-3 text-sm text-slate-500">{r.others}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-center mb-4">Connect Your Agents</h2>
            <p className="text-slate-400 text-center mb-14 max-w-lg mx-auto">
              Whether it's a coding agent, OpenClaw automation, or enterprise agent — Memoria integrates seamlessly.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Coding Agents',
                agents: ['Cursor', 'Claude Code', 'Kiro'],
                desc: 'Remember project architecture, coding preferences, and deploy workflows. Maintain context across sessions.',
                color: 'from-cyan-400/10 to-transparent',
              },
              {
                title: 'OpenClaw Agent',
                agents: ['OpenClaw'],
                desc: 'Persistent memory for browser automation agents. Remember workflows, user preferences, and page structures.',
                color: 'from-blue-400/10 to-transparent',
              },
              {
                title: 'Enterprise Agents',
                agents: ['Custom'],
                desc: 'Connect any agent via MCP protocol. Multi-agent shared memory pool with unified governance.',
                color: 'from-violet-400/10 to-transparent',
              },
            ].map((uc, i) => (
              <FadeIn key={uc.title} delay={i * 0.1}>
                <div className={`p-6 rounded-xl bg-gradient-to-b ${uc.color} border border-white/[0.06] h-full`}>
                  <div className="flex items-center gap-2 mb-4">
                    {uc.agents.map(a => <AgentBadge key={a} name={a} size={28} />)}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{uc.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{uc.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-400/[0.04] blur-[100px]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative">
          <FadeIn>
            <h2 className="text-4xl font-black tracking-tight mb-4">
              Let your agent <span className="text-gradient">remember everything</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Free to start. 5,000 memories, unlimited snapshots, 3 agent connections.
            </p>
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
            <a href="https://github.com/matrixorigin/openclaw-memoria" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">OpenClaw Plugin</a>
            <span>© 2026 MatrixOrigin</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
