import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo, Btn, AgentBadge, MiniTerm, FadeIn } from '../components/ui'
import { ArrowRight, Brain, GitBranch, Shield, Users, Sparkles, Zap } from 'lucide-react'

const DEMO_STEPS = [
  {
    title: 'Your agent remembers everything',
    subtitle: 'Preferences, decisions, and project context persist across sessions.',
    demo: 'conversation',
  },
  {
    title: 'Version-control your memory',
    subtitle: 'Branch, snapshot, and rollback — experiment without risk.',
    demo: 'git',
  },
  {
    title: 'Share across all your agents',
    subtitle: 'Cursor, Claude Code, Kiro, OpenClaw — one shared memory pool.',
    demo: 'agents',
  },
]

const CONVERSATION = [
  { role: 'user', text: 'I always use pytest for testing, never unittest.' },
  { role: 'agent', text: '✓ Stored: User prefers pytest over unittest', type: 'store' },
  { role: 'user', text: 'What testing framework do I use?' },
  { role: 'agent', text: 'You prefer pytest. You\'ve mentioned you never use unittest.', type: 'recall' },
  { role: 'user', text: 'Actually, I switched to vitest for JS projects.' },
  { role: 'agent', text: '✓ Updated: JS projects use vitest, Python still uses pytest', type: 'correct' },
]

export default function ValueDemoPage({ onFinish }) {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (step !== 0 || !autoPlay) return
    if (msgIndex >= CONVERSATION.length) return
    const t = setTimeout(() => setMsgIndex(i => i + 1), 1200)
    return () => clearTimeout(t)
  }, [step, msgIndex, autoPlay])

  const goToDashboard = () => {
    onFinish?.()
    nav('/dashboard')
  }

  return (
    <div className="min-h-screen bg-dark-0 font-sans flex flex-col">
      <div className="flex items-center justify-between px-8 h-14 border-b border-white/[0.06] shrink-0">
        <Logo />
        <Btn ghost small onClick={goToDashboard}>Skip to Dashboard →</Btn>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {DEMO_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setStep(i); if (i === 0) setMsgIndex(0) }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer
                  ${i === step ? 'bg-cyan-400 w-8' : i < step ? 'bg-cyan-400/40' : 'bg-dark-3'}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-extrabold text-center mb-2">
                {DEMO_STEPS[step].title}
              </h2>
              <p className="text-slate-400 text-center mb-8">
                {DEMO_STEPS[step].subtitle}
              </p>

              {/* Demo 0: Conversation */}
              {step === 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-dark-1 p-5 max-w-lg mx-auto">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.04]">
                    <AgentBadge name="Cursor" size={24} glow />
                    <span className="text-xs font-semibold text-slate-400">Cursor + Memoria</span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[280px]">
                    {CONVERSATION.slice(0, msgIndex).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed
                          ${msg.role === 'user'
                            ? 'bg-cyan-400/10 text-slate-200 rounded-br-sm'
                            : msg.type === 'store' ? 'bg-emerald-400/[0.06] text-emerald-400 border border-emerald-400/10 rounded-bl-sm'
                            : msg.type === 'correct' ? 'bg-amber-400/[0.06] text-amber-400 border border-amber-400/10 rounded-bl-sm'
                            : 'bg-dark-2 text-slate-300 border border-white/[0.06] rounded-bl-sm'}`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {msgIndex < CONVERSATION.length && (
                      <div className="flex justify-start">
                        <div className="px-3.5 py-2.5 rounded-xl bg-dark-2 border border-white/[0.06] rounded-bl-sm">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Demo 1: Git for Memory */}
              {step === 1 && (
                <div className="max-w-lg mx-auto">
                  <MiniTerm title="memoria" lines={[
                    { t: 'memoria snapshot "before-refactor"', p: true, c: '#E2E8F0' },
                    { t: '✓ Snapshot created: before-refactor (142 memories)', c: '#34D399' },
                    { t: '', c: '' },
                    { t: 'memoria branch "experiment/sqlite"', p: true, c: '#E2E8F0' },
                    { t: '✓ Branch created from main', c: '#34D399' },
                    { t: '', c: '' },
                    { t: '# ... agent experiments with SQLite ...', c: '#4A5568' },
                    { t: '', c: '' },
                    { t: 'memoria diff experiment/sqlite main', p: true, c: '#E2E8F0' },
                    { t: '  + Project uses SQLite for persistence', c: '#34D399' },
                    { t: '  ~ Database engine: SQLite (was: PostgreSQL)', c: '#FBBF24' },
                    { t: '  - PostgreSQL pool size set to 20', c: '#F87171' },
                    { t: '', c: '' },
                    { t: 'memoria rollback "before-refactor"', p: true, c: '#E2E8F0' },
                    { t: '✓ Rolled back to before-refactor. No data lost.', c: '#34D399' },
                  ]} />
                </div>
              )}

              {/* Demo 2: Multi-agent */}
              {step === 2 && (
                <div className="max-w-lg mx-auto">
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { name: 'Cursor', action: 'stores', detail: '"Deploy uses kubectl"' },
                      { name: 'Claude Code', action: 'recalls', detail: '"How do we deploy?"' },
                      { name: 'Kiro', action: 'corrects', detail: '"Now using ArgoCD"' },
                    ].map(a => (
                      <div key={a.name} className="p-4 rounded-xl bg-dark-2 border border-white/[0.06] text-center">
                        <AgentBadge name={a.name} size={36} glow />
                        <div className="text-xs font-bold mt-2">{a.name}</div>
                        <div className="text-[10px] text-cyan-400 font-semibold mt-1">{a.action}</div>
                        <div className="text-[11px] text-slate-500 mt-1 italic">{a.detail}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-400/[0.04] border border-cyan-400/10 text-center">
                    <Brain className="mx-auto mb-2 text-cyan-400" size={24} />
                    <div className="text-sm font-semibold">Shared Memory Space</div>
                    <div className="text-xs text-slate-400 mt-1">
                      All agents read and write to the same memory pool.
                      <br />Changes from one agent are instantly available to all others.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 max-w-lg mx-auto">
            <Btn
              ghost
              disabled={step === 0}
              onClick={() => { setStep(s => s - 1); if (step === 1) setMsgIndex(0) }}
            >
              ← Back
            </Btn>

            {step < DEMO_STEPS.length - 1 ? (
              <Btn primary onClick={() => setStep(s => s + 1)}>
                Next <ArrowRight size={14} />
              </Btn>
            ) : (
              <Btn primary onClick={goToDashboard}>
                <Sparkles size={16} /> Go to Dashboard
              </Btn>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
