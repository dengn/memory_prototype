import { useState } from 'react'
import { StatCard, FadeIn, AgentBadge, CopyCmd } from '../../components/ui'
import { Brain, GitBranch, Camera, Plug, Activity, Key, Copy } from 'lucide-react'

const ACTIVITY = [
  { action: 'memory_store', detail: 'API rate limit: 100 req/min...', agent: 'Cursor', time: '12m ago', c: 'text-emerald-400' },
  { action: 'memory_correct', detail: 'black → ruff for formatting', agent: 'Claude Code', time: '1h ago', c: 'text-amber-400' },
  { action: 'memory_snapshot', detail: '"before_db_refactor"', agent: 'Cursor', time: '2h ago', c: 'text-violet-400' },
  { action: 'memory_merge', detail: '"eval_sqlite" → main', agent: 'Cursor', time: '1d ago', c: 'text-emerald-400' },
  { action: 'memory_branch', detail: 'Created "experiment/redis"', agent: 'Kiro', time: '1d ago', c: 'text-cyan-400' },
]

const MEMORY_TYPES = [
  { type: 'semantic', count: 523, pct: 42, color: 'bg-cyan-400' },
  { type: 'profile', count: 187, pct: 15, color: 'bg-violet-400' },
  { type: 'procedural', count: 312, pct: 25, color: 'bg-emerald-400' },
  { type: 'working', count: 225, pct: 18, color: 'bg-amber-400' },
]

export default function OverviewPage() {
  return (
    <div className="max-w-5xl">
      <FadeIn>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold">My Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">Memory Space · Created 2 weeks ago</p>
          </div>
        </div>
      </FadeIn>

      {/* API Key Card */}
      <FadeIn delay={0.05}>
        <div className="p-4 rounded-xl bg-dark-2 border border-white/[0.06] mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Key size={14} className="text-amber-400" />
            <span className="text-xs font-semibold text-slate-400">API Key</span>
            <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-semibold ml-1">LIVE</span>
          </div>
          <CopyCmd cmd="mk_live_a7f3c2e9d1b048..." />
          <p className="text-[11px] text-slate-500 mt-2">
            Use this key with <span className="font-mono text-cyan-400">memoria init --cloud --api-key</span> to connect any agent.
          </p>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Memories" value="1,247" sub="+38 this week" color="#22D3EE" icon={<Brain size={14} />} />
        <StatCard label="Branches" value="4" sub="2 active" color="#34D399" icon={<GitBranch size={14} />} />
        <StatCard label="Snapshots" value="12" sub="Latest: 2h ago" color="#A78BFA" icon={<Camera size={14} />} />
        <StatCard label="Agents" value="3" sub="Connected" color="#FBBF24" icon={<Plug size={14} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-slate-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Activity</span>
            </div>
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 ${i ? 'border-t border-white/[0.04]' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.c.replace('text-', 'bg-')}`} />
                  <span className={`text-xs font-mono font-semibold w-36 shrink-0 ${a.c}`}>{a.action}</span>
                  <span className="text-xs text-slate-400 flex-1 truncate">{a.detail}</span>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap shrink-0">
                    via <span className="text-cyan-400">{a.agent}</span> · {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Right column */}
        <FadeIn delay={0.15}>
          <div className="flex flex-col gap-4">
            {/* Memory Breakdown */}
            <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Memory Breakdown</span>
              <div className="flex flex-col gap-3 mt-3">
                {MEMORY_TYPES.map(m => (
                  <div key={m.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-slate-400">{m.type}</span>
                      <span className="text-xs font-mono text-slate-500">{m.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-dark-3">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Agents */}
            <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connected Agents</span>
              <div className="flex flex-col gap-2 mt-3">
                {[
                  { name: 'Cursor', type: 'Coding Agent', last: '12m ago' },
                  { name: 'Claude Code', type: 'Coding Agent', last: '1h ago' },
                  { name: 'OpenClaw', type: 'Browser Agent', last: '3h ago' },
                ].map(a => (
                  <div key={a.name} className="flex items-center gap-2">
                    <AgentBadge name={a.name} size={24} glow />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{a.name}</div>
                      <div className="text-[10px] text-slate-500">{a.type}</div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
