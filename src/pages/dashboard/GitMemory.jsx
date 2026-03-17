import { useState } from 'react'
import { Btn, FadeIn } from '../../components/ui'
import { GitBranch, Camera, GitMerge, RotateCcw, Plus, ArrowRight } from 'lucide-react'

const BRANCHES = [
  { name: 'main', color: '#34D399', count: 47, status: 'HEAD' },
  { name: 'eval_sqlite', color: '#22D3EE', count: 5, status: 'merged' },
  { name: 'refactor/auth', color: '#FBBF24', count: 12, status: 'active' },
  { name: 'experiment/redis', color: '#A78BFA', count: 3, status: 'active' },
]

const SNAPSHOTS = [
  { name: 'before_db_refactor', time: '2h ago', count: 142, desc: 'Pre-refactor state' },
  { name: 'v0.3.0_release', time: '3d ago', count: 138, desc: 'Stable release' },
  { name: 'auth_migration', time: '1w ago', count: 125, desc: 'After auth migration' },
  { name: 'initial_setup', time: '2w ago', count: 89, desc: 'Initial configuration' },
]

const DIFF = [
  { op: 'ADD', text: 'Project uses SQLite for persistence', color: 'text-emerald-400', bg: 'bg-emerald-400/[0.04]' },
  { op: 'UPDATE', text: 'Database engine: SQLite (was: PostgreSQL)', color: 'text-amber-400', bg: 'bg-amber-400/[0.04]' },
  { op: 'DELETE', text: 'PostgreSQL pool size set to 20', color: 'text-red-400', bg: 'bg-red-400/[0.04]' },
]

export default function GitMemoryPage() {
  const [tab, setTab] = useState('branches')

  return (
    <div className="max-w-5xl">
      <FadeIn>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold">Git for Memory</h2>
          <div className="flex gap-2">
            <Btn small ghost><Camera size={14} /> Snapshot</Btn>
            <Btn small primary><Plus size={14} /> New Branch</Btn>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex gap-0 border-b border-white/[0.06] mb-5">
          {[
            { id: 'branches', label: 'Branches', icon: GitBranch },
            { id: 'snapshots', label: 'Snapshots', icon: Camera },
            { id: 'diff', label: 'Diff', icon: GitMerge },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer
                ${tab === t.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-500 border-b-2 border-transparent hover:text-slate-300'}`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {tab === 'branches' && (
        <FadeIn delay={0.1}>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            {BRANCHES.map((b, i) => (
              <div
                key={b.name}
                className={`flex items-center gap-3 px-4 py-3 bg-dark-2 hover:bg-dark-3/50 transition-colors
                  ${i < BRANCHES.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: b.color, boxShadow: b.name === 'main' ? `0 0 8px ${b.color}60` : 'none' }}
                />
                <span className="font-mono text-[13px] font-bold w-44 shrink-0" style={{ color: b.color }}>
                  {b.name}
                </span>
                <span className="text-[11px] text-slate-500">{b.count} memories</span>
                <div className="flex-1" />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded
                  ${b.status === 'HEAD' ? 'bg-emerald-400/10 text-emerald-400'
                    : b.status === 'merged' ? 'bg-emerald-400/[0.06] text-emerald-400/60'
                    : 'bg-cyan-400/10 text-cyan-400'}`}
                >
                  {b.status}
                </span>
                {b.status === 'active' && (
                  <div className="flex gap-1">
                    <button className="text-[11px] text-slate-500 hover:text-cyan-400 px-1.5 py-0.5 rounded hover:bg-white/[0.04] transition-colors cursor-pointer">
                      merge
                    </button>
                    <button className="text-[11px] text-slate-500 hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-white/[0.04] transition-colors cursor-pointer">
                      delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Branch Graph</div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400">main</span>
              </div>
              <span className="text-slate-600">──────</span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-slate-600">├──</span>
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-400">refactor/auth</span>
                  <span className="text-slate-600">(12 memories)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-600">├──</span>
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="text-violet-400">experiment/redis</span>
                  <span className="text-slate-600">(3 memories)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-600">└──</span>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-50" />
                  <span className="text-cyan-400/50 line-through">eval_sqlite</span>
                  <span className="text-slate-600">(merged)</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {tab === 'snapshots' && (
        <FadeIn delay={0.1}>
          <div className="pl-5 relative">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-400 to-dark-3" />
            {SNAPSHOTS.map((s, i) => (
              <div key={s.name} className="flex gap-4 mb-5 relative">
                <div className={`w-3.5 h-3.5 rounded-full border-2 absolute -left-3 top-0.5 z-10
                  ${i === 0 ? 'border-cyan-400 bg-cyan-400/20' : 'border-dark-3 bg-dark-2'}`} />
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] text-cyan-400 font-bold">{s.name}</span>
                    <span className="text-[10px] text-slate-500">{s.count} memories · {s.time}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                  <div className="flex gap-1.5 mt-2">
                    <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors cursor-pointer border border-white/[0.06]">
                      <RotateCcw size={10} /> Rollback
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors cursor-pointer border border-white/[0.06]">
                      <GitBranch size={10} /> Branch from here
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {tab === 'diff' && (
        <FadeIn delay={0.1}>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-2.5 bg-dark-3 border-b border-white/[0.04] text-xs text-slate-500">
              Comparing <span className="text-cyan-400 font-mono">eval_sqlite</span>
              <ArrowRight size={10} className="inline mx-1" />
              <span className="text-emerald-400 font-mono">main</span> · 3 changes
            </div>
            {DIFF.map((d, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 ${d.bg}
                  ${i < DIFF.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <span className={`font-mono text-[11px] font-extrabold w-16 text-center ${d.color}`}>
                  {d.op}
                </span>
                <span className={`text-[13px] ${d.op === 'DELETE' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {d.text}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  )
}
