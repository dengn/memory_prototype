import { useState } from 'react'
import { CopyCmd, AgentBadge, Btn, MiniTerm, FadeIn } from '../../components/ui'
import { Plus, Wifi, ExternalLink, X, ArrowRight } from 'lucide-react'

const CONNECTED = [
  { name: 'Cursor', category: 'coding', project: 'My Project', last: '12m ago', memories: 523 },
  { name: 'Claude Code', category: 'coding', project: 'My Project', last: '1h ago', memories: 412 },
  { name: 'OpenClaw', category: 'openclaw', project: 'My Project', last: '3h ago', memories: 312 },
]

const AGENT_TEMPLATES = {
  coding: [
    { name: 'Cursor', desc: 'AI code editor' },
    { name: 'Claude Code', desc: 'Anthropic CLI agent' },
    { name: 'Kiro', desc: 'AWS spec-driven IDE' },
    { name: 'Windsurf', desc: 'Codeium AI IDE' },
  ],
  openclaw: [
    { name: 'OpenClaw', desc: 'Autonomous browser agent' },
  ],
  other: [
    { name: 'Custom', desc: 'Any MCP-compatible agent' },
  ],
}

const SETUP_COMMANDS = {
  Cursor: {
    install: 'pip install memoria-lite && memoria init --cloud --api-key YOUR_API_KEY',
    files: ['.cursor/mcp.json', '.cursor/rules/memory.mdc'],
    restart: 'Cmd+Shift+P → Reload Window',
  },
  'Claude Code': {
    install: 'pip install memoria-lite && memoria init --cloud --api-key YOUR_API_KEY --agent claude',
    files: ['.claude/mcp.json', 'CLAUDE.md'],
    restart: 'Restart terminal',
  },
  Kiro: {
    install: 'pip install memoria-lite && memoria init --cloud --api-key YOUR_API_KEY --agent kiro',
    files: ['.kiro/settings/mcp.json', '.kiro/steering/memory.md'],
    restart: 'Restart Kiro',
  },
  OpenClaw: {
    install: 'curl -fsSL https://raw.githubusercontent.com/matrixorigin/openclaw-memoria/main/scripts/install-openclaw-memoria.sh | bash',
    files: ['openclaw.plugin.json'],
    restart: 'Restart OpenClaw',
  },
}

const CATEGORY_LABELS = {
  coding: { label: 'Coding Agents', color: 'text-cyan-400' },
  openclaw: { label: 'OpenClaw', color: 'text-blue-400' },
  other: { label: 'Other Agents', color: 'text-violet-400' },
}

export default function AgentsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [addCategory, setAddCategory] = useState('coding')
  const [selectedAgent, setSelectedAgent] = useState(null)

  const setup = selectedAgent ? (SETUP_COMMANDS[selectedAgent] || SETUP_COMMANDS.Cursor) : null

  return (
    <div className="max-w-4xl">
      <FadeIn>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold">Agents</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage agent connections to this Memory Space</p>
          </div>
          <Btn small primary onClick={() => { setShowAdd(true); setSelectedAgent(null) }}>
            <Plus size={14} /> Connect Agent
          </Btn>
        </div>
      </FadeIn>

      {/* Connected Agents */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-2 mb-3">
          <Wifi size={14} className="text-emerald-400" />
          <span className="text-sm font-bold">Connected ({CONNECTED.length})</span>
        </div>
        <div className="flex flex-col gap-2 mb-8">
          {CONNECTED.map(a => (
            <div
              key={a.name}
              className="flex items-center gap-3 p-4 rounded-xl bg-dark-2 border border-white/[0.06] hover:border-white/[0.1] transition-colors"
            >
              <AgentBadge name={a.name} size={36} glow />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{a.name}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded
                    ${a.category === 'coding' ? 'bg-cyan-400/10 text-cyan-400'
                      : a.category === 'openclaw' ? 'bg-blue-400/10 text-blue-400'
                      : 'bg-violet-400/10 text-violet-400'}`}>
                    {a.category === 'coding' ? 'CODING' : a.category === 'openclaw' ? 'OPENCLAW' : 'OTHER'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {a.memories} memories · Last active: {a.last}
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Quick Setup */}
      <FadeIn delay={0.1}>
        <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Setup</div>
          <p className="text-xs text-slate-400 mb-3">
            Connect any agent with one command. Your API key is all you need.
          </p>
          <CopyCmd label="Install" cmd="pip install memoria-lite && memoria init --cloud --api-key mk_live_a7f3..." />
          <p className="text-[11px] text-slate-500 mt-2">
            This auto-detects your agent and generates the right config files.
          </p>
        </div>
      </FadeIn>

      {/* Add Agent Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <div className="bg-dark-2 border border-white/[0.06] rounded-2xl max-w-lg w-full mx-4 shadow-2xl max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
              <h3 className="text-lg font-extrabold">
                {selectedAgent ? `Connect ${selectedAgent}` : 'Connect an Agent'}
              </h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {!selectedAgent ? (
                <>
                  {/* Category tabs */}
                  <div className="flex gap-1 mb-5 p-1 bg-dark-3 rounded-lg">
                    {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
                      <button
                        key={key}
                        onClick={() => setAddCategory(key)}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer
                          ${addCategory === key ? 'bg-dark-1 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Agent list */}
                  <div className="flex flex-col gap-2">
                    {AGENT_TEMPLATES[addCategory].map(a => (
                      <button
                        key={a.name}
                        onClick={() => setSelectedAgent(a.name)}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-1 border border-white/[0.06] hover:border-cyan-400/20 transition-colors cursor-pointer text-left"
                      >
                        <AgentBadge name={a.name} size={32} />
                        <div className="flex-1">
                          <div className="text-sm font-bold">{a.name}</div>
                          <div className="text-[11px] text-slate-500">{a.desc}</div>
                        </div>
                        <ArrowRight size={14} className="text-slate-500" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Setup instructions */}
                  <div className="flex items-center gap-3 mb-5">
                    <AgentBadge name={selectedAgent} size={36} glow />
                    <div>
                      <div className="text-sm font-bold">{selectedAgent}</div>
                      <div className="text-[11px] text-slate-500">
                        {CATEGORY_LABELS[addCategory]?.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-2">1. Run this command in your project</span>
                      <CopyCmd cmd={setup.install} />
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-2">2. This creates</span>
                      <div className="p-3 rounded-lg bg-dark-0 border border-white/[0.04] text-xs font-mono text-cyan-400 leading-relaxed">
                        {setup.files.map(f => <div key={f}>✓ {f}</div>)}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-2">3. Restart your agent</span>
                      <p className="text-xs text-slate-400">{setup.restart}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <Btn ghost small onClick={() => setSelectedAgent(null)}>← Back</Btn>
                    <Btn primary small onClick={() => setShowAdd(false)} className="ml-auto">Done</Btn>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
