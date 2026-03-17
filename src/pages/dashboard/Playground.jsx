import { useState, useRef, useEffect } from 'react'
import { FadeIn } from '../../components/ui'
import { Send, Brain, Sparkles, Zap, ChevronRight, X } from 'lucide-react'

/* ── Simulated memory store ── */
const MEMORY_STORE = [
  { id: 'm1', text: 'User prefers pytest over unittest for all Python testing', category: 'preference', confidence: 0.95, created: '2 days ago' },
  { id: 'm2', text: 'Project uses PostgreSQL 15 as the primary database', category: 'fact', confidence: 0.98, created: '3 days ago' },
  { id: 'm3', text: 'Always use TypeScript strict mode in frontend projects', category: 'preference', confidence: 0.92, created: '1 day ago' },
  { id: 'm4', text: 'Deployment target is Kubernetes on AWS EKS', category: 'fact', confidence: 0.97, created: '5 days ago' },
  { id: 'm5', text: 'User prefers functional components with hooks over class components', category: 'preference', confidence: 0.94, created: '4 days ago' },
  { id: 'm6', text: 'API follows RESTful conventions with /api/v1 prefix', category: 'fact', confidence: 0.96, created: '3 days ago' },
  { id: 'm7', text: 'Use Tailwind CSS for styling, no CSS modules', category: 'preference', confidence: 0.93, created: '2 days ago' },
  { id: 'm8', text: 'Error handling uses custom AppError class with error codes', category: 'fact', confidence: 0.91, created: '6 days ago' },
  { id: 'm9', text: 'Git workflow: feature branches → PR → squash merge to main', category: 'procedure', confidence: 0.96, created: '1 week ago' },
  { id: 'm10', text: 'Authentication uses JWT with refresh token rotation', category: 'fact', confidence: 0.97, created: '4 days ago' },
]

/* ── Simulated conversations with memory hits ── */
const RESPONSES = [
  {
    triggers: ['test', 'testing', 'pytest', 'unittest'],
    reply: "Based on your preferences, I'll set up the test suite using **pytest** with your standard configuration. I'll include pytest-cov for coverage and pytest-asyncio for any async tests.",
    hits: ['m1'],
  },
  {
    triggers: ['database', 'db', 'postgres', 'sql'],
    reply: "Since your project uses **PostgreSQL 15**, I'll write the migration using standard SQL. I'll also make sure the schema follows your existing `/api/v1` conventions for any related endpoints.",
    hits: ['m2', 'm6'],
  },
  {
    triggers: ['frontend', 'react', 'component', 'ui'],
    reply: "I'll create this as a **functional component with hooks** and style it with **Tailwind CSS**, following your project conventions. I'll use TypeScript strict mode as well.",
    hits: ['m5', 'm7', 'm3'],
  },
  {
    triggers: ['deploy', 'kubernetes', 'k8s', 'aws'],
    reply: "I'll prepare the Kubernetes manifests for **AWS EKS** deployment. I'll follow your git workflow — create a feature branch, and you can squash merge after review.",
    hits: ['m4', 'm9'],
  },
  {
    triggers: ['auth', 'login', 'jwt', 'token'],
    reply: "Your project uses **JWT with refresh token rotation** for authentication. I'll make sure the new endpoint follows this pattern and uses your custom AppError class for error responses.",
    hits: ['m10', 'm8'],
  },
  {
    triggers: ['api', 'endpoint', 'rest', 'route'],
    reply: "I'll add the new endpoint under your **`/api/v1`** prefix following RESTful conventions. Error handling will use your **AppError** class with proper error codes.",
    hits: ['m6', 'm8'],
  },
  {
    triggers: ['style', 'css', 'tailwind', 'design'],
    reply: "I'll use **Tailwind CSS** for all styling — no CSS modules. For the component structure, I'll go with functional components and hooks as you prefer.",
    hits: ['m7', 'm5'],
  },
]

const DEFAULT_RESPONSE = {
  reply: "I can help with that. Let me check what I know about your project to give you the most relevant answer.",
  hits: ['m2', 'm3'],
}

function findResponse(input) {
  const lower = input.toLowerCase()
  const match = RESPONSES.find(r => r.triggers.some(t => lower.includes(t)))
  return match || DEFAULT_RESPONSE
}

const SUGGESTIONS = [
  'Help me write a test for the user service',
  'Create a new API endpoint for orders',
  'Set up the frontend component for settings',
  'How should I deploy this feature?',
]

function MemoryHitCard({ memory, index }) {
  return (
    <div
      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-cyan-400/[0.04] border border-cyan-400/10 animate-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="w-5 h-5 rounded bg-cyan-400/10 flex items-center justify-center shrink-0 mt-0.5">
        <Zap size={10} className="text-cyan-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-slate-200 leading-relaxed">{memory.text}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            memory.category === 'preference' ? 'bg-violet-400/10 text-violet-400' :
            memory.category === 'procedure' ? 'bg-amber-400/10 text-amber-400' :
            'bg-emerald-400/10 text-emerald-400'
          }`}>
            {memory.category}
          </span>
          <span className="text-[10px] text-slate-500">
            conf: <span className="text-cyan-400">{memory.confidence}</span>
          </span>
          <span className="text-[10px] text-slate-500">{memory.created}</span>
        </div>
      </div>
    </div>
  )
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedHits, setSelectedHits] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text) => {
    const msg = text || input.trim()
    if (!msg || isTyping) return

    const userMsg = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate LLM response with memory retrieval
    setTimeout(() => {
      const { reply, hits } = findResponse(msg)
      const hitMemories = hits.map(id => MEMORY_STORE.find(m => m.id === id)).filter(Boolean)
      const assistantMsg = { role: 'assistant', content: reply, memoryHits: hitMemories }
      setMessages(prev => [...prev, assistantMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto" style={{ height: 'calc(100vh - 48px - 48px)' }}>
      <FadeIn>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold">Playground</h2>
            <p className="text-slate-500 text-xs mt-0.5">Chat with an LLM enhanced by your memory space. See which memories are retrieved in real time.</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Brain size={14} className="text-cyan-400" />
            <span className="font-mono">{MEMORY_STORE.length} memories loaded</span>
          </div>
        </div>
      </FadeIn>

      {/* Chat area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col rounded-xl border border-white/[0.06] bg-dark-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/[0.06] flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-cyan-400" />
                </div>
                <div className="text-sm font-bold mb-1">Memory-Enhanced Chat</div>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Ask anything. Relevant memories from your space will be automatically retrieved and used to personalize responses.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-3 py-1.5 rounded-lg bg-dark-2 border border-white/[0.06] text-[11px] text-slate-400 hover:text-slate-200 hover:border-cyan-400/20 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-400/[0.1] text-slate-200 rounded-br-sm'
                        : 'bg-dark-2 border border-white/[0.06] text-slate-300 rounded-bl-sm'
                    }`}
                  >
                    {msg.content.split('**').map((part, j) =>
                      j % 2 === 1
                        ? <span key={j} className="font-semibold text-slate-100">{part}</span>
                        : <span key={j}>{part}</span>
                    )}
                  </div>
                  {/* Memory hits indicator */}
                  {msg.memoryHits && msg.memoryHits.length > 0 && (
                    <button
                      onClick={() => setSelectedHits(selectedHits === i ? null : i)}
                      className={`mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                        selectedHits === i
                          ? 'bg-cyan-400/[0.1] text-cyan-400 border border-cyan-400/20'
                          : 'text-cyan-400/60 hover:text-cyan-400 border border-transparent'
                      }`}
                    >
                      <Brain size={11} />
                      {msg.memoryHits.length} {msg.memoryHits.length === 1 ? 'memory' : 'memories'} used
                      <ChevronRight size={10} className={`transition-transform ${selectedHits === i ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl bg-dark-2 border border-white/[0.06] rounded-bl-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-dark-2 border border-white/[0.06] focus-within:border-cyan-400/30 transition-colors">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something... memories will be retrieved automatically"
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-200 placeholder:text-slate-600"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center text-dark-0 hover:bg-cyan-300 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Memory hits panel */}
        {selectedHits !== null && messages[selectedHits]?.memoryHits && (
          <div className="w-72 shrink-0 rounded-xl border border-white/[0.06] bg-dark-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Brain size={13} className="text-cyan-400" />
                <span className="text-xs font-bold">Retrieved Memories</span>
              </div>
              <button onClick={() => setSelectedHits(null)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-3 flex flex-col gap-2">
              {messages[selectedHits].memoryHits.map((mem, j) => (
                <MemoryHitCard key={mem.id} memory={mem} index={j} />
              ))}
            </div>
            <div className="px-3.5 py-2.5 border-t border-white/[0.06] text-[10px] text-slate-500">
              Memories are retrieved via semantic similarity search and used as context for the LLM response.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
