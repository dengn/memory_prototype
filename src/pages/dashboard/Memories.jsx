import { useState, useRef, useEffect } from 'react'
import { Pill, FadeIn } from '../../components/ui'
import {
  Search, Clock, GitBranch, Eye, Trash2, Edit3, Send,
  AlertTriangle, CheckCircle, XCircle, ShieldCheck, MessageSquare, X, Brain
} from 'lucide-react'

const TYPE_COLORS = {
  semantic: { bg: 'bg-cyan-400/10', text: 'text-cyan-400' },
  profile: { bg: 'bg-violet-400/10', text: 'text-violet-400' },
  procedural: { bg: 'bg-emerald-400/10', text: 'text-emerald-400' },
  working: { bg: 'bg-amber-400/10', text: 'text-amber-400' },
}

const MEMORIES = [
  { id: 'm_7f3a', type: 'semantic', text: 'Project uses Go 1.22 with chi router, sqlc for DB access', conf: 0.95, time: '12m ago', branch: 'main', agent: 'Cursor' },
  { id: 'm_2e9c', type: 'profile', text: 'User prefers tabs, ruff for formatting, pytest for tests', conf: 0.98, time: '1h ago', branch: 'main', agent: 'Claude Code' },
  { id: 'm_a1b4', type: 'procedural', text: 'Deploy: make build → docker push → kubectl apply -f k8s/', conf: 0.92, time: '3h ago', branch: 'main', agent: 'Cursor' },
  { id: 'm_d8f2', type: 'working', text: 'Currently refactoring auth module to session tokens', conf: 0.88, time: '30m ago', branch: 'refactor/auth', agent: 'Kiro' },
  { id: 'm_c5e7', type: 'semantic', text: 'API rate limit: 100 req/min per user, 1000 global', conf: 0.96, time: '2d ago', branch: 'main', agent: 'Cursor' },
  { id: 'm_f1d3', type: 'procedural', text: 'DB migrations use goose, config in migrations/ directory', conf: 0.94, time: '3d ago', branch: 'main', agent: 'Claude Code' },
  { id: 'm_b2a8', type: 'semantic', text: 'Redis used for session storage and caching, pool size 10', conf: 0.91, time: '4d ago', branch: 'main', agent: 'Cursor' },
  { id: 'm_e4c6', type: 'profile', text: 'Code comments in English, commit messages in conventional format', conf: 0.97, time: '5d ago', branch: 'main', agent: 'Kiro' },
]

const QUARANTINED = [
  {
    id: 'q_1', text: 'Project uses MySQL database',
    reason: 'Contradicts: "Project uses Go 1.22 with chi router, sqlc for DB access"',
    conf: 0.42, time: '2h ago', agent: 'Cursor', qtype: 'contradiction',
  },
  {
    id: 'q_2', text: 'API uses REST architecture',
    reason: 'Low confidence — insufficient context from conversation',
    conf: 0.35, time: '1d ago', agent: 'Claude Code', qtype: 'low_confidence',
  },
  {
    id: 'q_3', text: 'Deployed to Heroku',
    reason: 'Contradicts: "Deploy: make build → docker push → kubectl apply"',
    conf: 0.28, time: '3d ago', agent: 'Kiro', qtype: 'contradiction',
  },
]

/* ── Chat-based memory assistant responses ── */
const CHAT_RESPONSES = [
  {
    triggers: ['database', 'db', 'postgres', 'mysql', 'sql'],
    reply: 'Found 3 memories related to databases. Filtered the list for you.',
    action: { type: 'filter', search: 'db' },
  },
  {
    triggers: ['delete working', 'remove working', 'clear working'],
    reply: 'I found 1 working memory. I\'ve highlighted it — click "Forget" to confirm deletion, or say "confirm delete" to remove all.',
    action: { type: 'filter', filter: 'working' },
  },
  {
    triggers: ['contradiction', 'conflict', 'quarantine'],
    reply: 'There are 3 items in quarantine — 2 contradictions and 1 low-confidence memory. I\'ve switched to the quarantine view.',
    action: { type: 'tab', tab: 'quarantine' },
  },
  {
    triggers: ['deploy', 'kubernetes', 'k8s', 'docker'],
    reply: 'Found memories about your deployment pipeline. Showing filtered results.',
    action: { type: 'filter', search: 'deploy' },
  },
  {
    triggers: ['show all', 'reset', 'clear filter'],
    reply: 'Filters cleared. Showing all memories.',
    action: { type: 'reset' },
  },
  {
    triggers: ['low confidence', 'uncertain', 'weak'],
    reply: 'Showing memories with confidence below 0.9. Consider reviewing these for accuracy.',
    action: { type: 'filter', search: '' },
  },
  {
    triggers: ['how many', 'count', 'total', 'stats'],
    reply: `You have ${MEMORIES.length} active memories and ${QUARANTINED.length} in quarantine. Types: ${[...new Set(MEMORIES.map(m => m.type))].join(', ')}.`,
    action: null,
  },
  {
    triggers: ['help', 'what can'],
    reply: 'You can ask me to: filter memories by topic, show contradictions, find low-confidence items, delete memories by type, show stats, or switch between views. Try "show me database memories" or "find contradictions".',
    action: null,
  },
]

function findChatResponse(input) {
  const lower = input.toLowerCase()
  const match = CHAT_RESPONSES.find(r => r.triggers.some(t => lower.includes(t)))
  return match || {
    reply: `Searching memories for "${input}"... Filtered results shown below.`,
    action: { type: 'filter', search: input },
  }
}

export default function MemoriesPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('memories') // 'memories' | 'quarantine'
  const [quarantine, setQuarantine] = useState(QUARANTINED)

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'I can help you find, filter, and manage your memories. Try "show database memories", "find contradictions", or "how many memories do I have".' }
  ])
  const [chatInput, setChatInput] = useState('')
  const chatBottomRef = useRef(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleChatSend = () => {
    const msg = chatInput.trim()
    if (!msg) return
    setChatMessages(prev => [...prev, { role: 'user', content: msg }])
    setChatInput('')

    setTimeout(() => {
      const { reply, action } = findChatResponse(msg)
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (action) {
        if (action.type === 'filter') {
          setTab('memories')
          if (action.filter) setFilter(action.filter)
          if (action.search !== undefined) setSearch(action.search)
        } else if (action.type === 'tab') {
          setTab(action.tab)
        } else if (action.type === 'reset') {
          setFilter('all')
          setSearch('')
          setTab('memories')
        }
      }
    }, 400)
  }

  const handleChatKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend() }
  }

  const dismissQuarantine = (id) => setQuarantine(prev => prev.filter(q => q.id !== id))

  const filtered = MEMORIES.filter(m =>
    (filter === 'all' || m.type === filter) &&
    (!search || m.text.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-5xl relative">
      <FadeIn>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold">Memory Explorer</h2>
            <p className="text-xs text-slate-500 mt-0.5">Browse, search, and manage all memories in this space</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-dark-2 border border-white/[0.06] rounded-lg focus-within:border-cyan-400/30 transition-colors">
              <Search size={14} className="text-slate-500" />
              <input
                placeholder="Semantic search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-200 w-44 font-sans"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Tabs: Memories / Quarantine */}
      <FadeIn delay={0.03}>
        <div className="flex items-center gap-1 mb-4 border-b border-white/[0.06] pb-3">
          <button
            onClick={() => setTab('memories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
              tab === 'memories' ? 'bg-cyan-400/[0.08] text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Brain size={13} /> Memories <span className="text-[10px] font-mono ml-1 opacity-60">{MEMORIES.length}</span>
          </button>
          <button
            onClick={() => setTab('quarantine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
              tab === 'quarantine' ? 'bg-amber-400/[0.08] text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <AlertTriangle size={13} /> Quarantine
            {quarantine.length > 0 && (
              <span className="text-[10px] font-mono bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded ml-1">
                {quarantine.length}
              </span>
            )}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <GitBranch size={12} />
            <span>Branch: <span className="text-emerald-400 font-mono">main</span></span>
          </div>
        </div>
      </FadeIn>

      {/* ── Memories Tab ── */}
      {tab === 'memories' && (
        <>
          <FadeIn delay={0.05}>
            <div className="flex items-center gap-2 mb-4">
              {['all', 'semantic', 'profile', 'procedural', 'working'].map(f => (
                <Pill
                  key={f}
                  color={f === 'semantic' ? 'cyan' : f === 'profile' ? 'purple' : f === 'procedural' ? 'green' : f === 'working' ? 'amber' : 'cyan'}
                  active={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Pill>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No memories match your search. Try a different query or ask the assistant below.
                </div>
              ) : filtered.map((m, i) => {
                const tc = TYPE_COLORS[m.type] || TYPE_COLORS.semantic
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelected(selected === m.id ? null : m.id)}
                    className={`flex items-start gap-3 px-4 py-3 bg-dark-2 cursor-pointer transition-colors hover:bg-dark-3/50
                      ${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''}
                      ${selected === m.id ? 'bg-dark-3/30' : ''}`}
                  >
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tc.bg} ${tc.text} font-mono mt-0.5 shrink-0`}>
                      {m.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-slate-200 leading-relaxed">{m.text}</div>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-[11px] text-slate-500 font-mono">{m.id}</span>
                        <span className="text-[11px] text-slate-500">conf: {m.conf}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> {m.time}
                        </span>
                        <span className="text-[11px] text-slate-500">via {m.agent}</span>
                      </div>
                      {selected === m.id && (
                        <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2">
                          <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer">
                            <Eye size={11} /> View history
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer">
                            <Edit3 size={11} /> Correct
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-red-400/60 hover:text-red-400 hover:bg-red-400/[0.06] transition-colors cursor-pointer">
                            <Trash2 size={11} /> Forget
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">{m.branch}</span>
                  </div>
                )
              })}
            </div>
          </FadeIn>

          <div className="mt-4 text-center text-xs text-slate-500">
            Showing {filtered.length} / 1,247 memories
          </div>
        </>
      )}

      {/* ── Quarantine Tab ── */}
      {tab === 'quarantine' && (
        <FadeIn delay={0.05}>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Pending Review', value: quarantine.length, icon: AlertTriangle, color: 'text-amber-400' },
              { label: 'Resolved', value: 12, icon: CheckCircle, color: 'text-emerald-400' },
              { label: 'Discarded', value: 5, icon: XCircle, color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl bg-dark-2 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={14} className={s.color} />
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</span>
                </div>
                <div className={`text-2xl font-extrabold font-mono ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Governance rules summary */}
          <div className="mb-5 p-3.5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={13} className="text-cyan-400" />
              <span className="text-xs font-bold">Active Governance Rules</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Contradiction Detection', 'Low Confidence Filter (< 0.5)', 'Duplicate Merge (> 0.95 similarity)', 'Sensitive Data Redaction'].map(r => (
                <span key={r} className="text-[10px] px-2 py-1 rounded bg-emerald-400/[0.06] text-emerald-400 border border-emerald-400/10 font-semibold">
                  ✓ {r}
                </span>
              ))}
            </div>
          </div>

          {/* Quarantine items */}
          {quarantine.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-white/[0.06] bg-dark-2">
              <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-semibold">All clear</div>
              <div className="text-xs text-slate-500 mt-1">No items pending review</div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              {quarantine.map((q, i) => (
                <div
                  key={q.id}
                  className={`p-4 bg-dark-2 ${i < quarantine.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 mt-0.5
                      ${q.qtype === 'contradiction' ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'}`}>
                      {q.qtype === 'contradiction' ? 'conflict' : 'low conf'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-slate-200">{q.text}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{q.reason}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-slate-500">conf: <span className="text-red-400">{q.conf}</span></span>
                        <span className="text-[11px] text-slate-500">{q.time}</span>
                        <span className="text-[11px] text-slate-500">via {q.agent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-3 ml-16">
                    <button
                      onClick={() => dismissQuarantine(q.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] text-emerald-400 bg-emerald-400/[0.06] hover:bg-emerald-400/[0.12] transition-colors cursor-pointer border border-emerald-400/10"
                    >
                      <CheckCircle size={10} /> Accept
                    </button>
                    <button className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer border border-white/[0.06]">
                      <Eye size={10} /> Compare
                    </button>
                    <button
                      onClick={() => dismissQuarantine(q.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] text-red-400/60 hover:text-red-400 hover:bg-red-400/[0.06] transition-colors cursor-pointer border border-red-400/10"
                    >
                      <Trash2 size={10} /> Discard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      )}

      {/* ── Floating Chat Toggle ── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-cyan-400 text-dark-0 flex items-center justify-center shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition-colors cursor-pointer z-40"
        >
          <MessageSquare size={20} />
        </button>
      )}

      {/* ── Chat Panel ── */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[28rem] rounded-2xl bg-dark-1 border border-white/[0.06] shadow-2xl flex flex-col overflow-hidden z-40">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-dark-2">
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-cyan-400" />
              <span className="text-[13px] font-bold">Memory Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-3 flex flex-col gap-2.5">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[12px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-400/[0.1] text-slate-200 rounded-br-sm'
                    : 'bg-dark-2 border border-white/[0.06] text-slate-300 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-2 border border-white/[0.06] focus-within:border-cyan-400/30 transition-colors">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={handleChatKey}
                placeholder="Ask about your memories..."
                className="flex-1 bg-transparent border-none outline-none text-[12px] text-slate-200 placeholder:text-slate-600"
              />
              <button
                onClick={handleChatSend}
                disabled={!chatInput.trim()}
                className="w-7 h-7 rounded-lg bg-cyan-400 flex items-center justify-center text-dark-0 hover:bg-cyan-300 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={12} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['find contradictions', 'show stats', 'clear filters'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setChatMessages(prev => [...prev, { role: 'user', content: s }])
                    setTimeout(() => {
                      const { reply, action } = findChatResponse(s)
                      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }])
                      if (action) {
                        if (action.type === 'filter') { setTab('memories'); if (action.filter) setFilter(action.filter); if (action.search !== undefined) setSearch(action.search) }
                        else if (action.type === 'tab') setTab(action.tab)
                        else if (action.type === 'reset') { setFilter('all'); setSearch(''); setTab('memories') }
                      }
                    }, 400)
                  }}
                  className="px-2 py-0.5 rounded text-[10px] text-slate-500 bg-dark-2 border border-white/[0.06] hover:text-slate-300 hover:border-white/[0.1] cursor-pointer transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
