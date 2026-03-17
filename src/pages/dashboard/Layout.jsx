import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../../components/ui'
import {
  LayoutDashboard, Brain, GitBranch, Plug, Settings,
  MessageSquare, ChevronDown, Plus, Lock
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/memories', label: 'Memories', icon: Brain },
  { to: '/dashboard/git', label: 'Git for Memory', icon: GitBranch },
  { to: '/dashboard/playground', label: 'Playground', icon: MessageSquare },
  { to: '/dashboard/agents', label: 'Agents', icon: Plug },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const SPACES = [
  { name: 'My Project', id: 'sp_default', isDefault: true },
]

export default function DashboardLayout() {
  const [spaceOpen, setSpaceOpen] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-dark-0 font-sans">
      {/* Top Bar */}
      <header className="flex items-center px-5 h-12 border-b border-white/[0.06] bg-dark-1 shrink-0">
        <Logo size="sm" />
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono bg-dark-2 px-2.5 py-1 rounded border border-white/[0.06]">
            Free Tier
          </span>
          <div className="w-7 h-7 rounded-full bg-cyan-400/[0.08] flex items-center justify-center text-[11px] font-extrabold text-cyan-400 cursor-pointer">
            U
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 border-r border-white/[0.06] bg-dark-1 flex flex-col shrink-0">
          {/* Memory Space Selector */}
          <div className="px-3 pt-4 pb-3">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2.5 mb-2">
              Memory Space
            </div>
            <div className="relative">
              <button
                onClick={() => setSpaceOpen(!spaceOpen)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-dark-2 border border-white/[0.06] cursor-pointer hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[13px] font-bold font-mono text-slate-200 truncate">My Project</span>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${spaceOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {spaceOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg bg-dark-2 border border-white/[0.06] shadow-xl z-20 overflow-hidden">
                  {SPACES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSpaceOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[13px] font-mono text-slate-200 truncate">{s.name}</span>
                      {s.isDefault && (
                        <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded ml-auto shrink-0">
                          DEFAULT
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-white/[0.04]">
                    <button
                      onClick={() => { setSpaceOpen(false); setShowUpgrade(true) }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.04] transition-colors cursor-pointer text-slate-500"
                    >
                      <Plus size={12} />
                      <span className="text-[12px]">New Memory Space</span>
                      <Lock size={10} className="ml-auto text-amber-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 flex flex-col gap-0.5">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors
                  ${isActive
                    ? 'bg-cyan-400/[0.08] text-cyan-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'}`
                }
              >
                <n.icon size={16} />
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Usage */}
          <div className="px-3 py-3 border-t border-white/[0.06]">
            <div className="text-[11px] text-slate-500">Memory Usage</div>
            <div className="text-xl font-extrabold font-mono mt-0.5">1,247</div>
            <div className="h-1 rounded-full bg-dark-3 mt-2">
              <div className="w-1/4 h-full rounded-full bg-cyan-400" />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">1,247 / 5,000 free</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgrade(false)}>
          <div className="bg-dark-2 border border-white/[0.06] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">Need More Memory Spaces?</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                The free tier includes 1 Memory Space with 5,000 memories.
                For additional spaces, custom limits, or enterprise features, get in touch with our team.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:memoria@matrixorigin.io"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400 text-dark-0 font-semibold text-[13px] hover:bg-cyan-300 transition-colors"
                >
                  Contact Us — memoria@matrixorigin.io
                </a>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer py-2"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
