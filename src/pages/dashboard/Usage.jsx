import { useState } from 'react'
import { FadeIn, Btn } from '../../components/ui'
import {
  Brain, Zap, Plug, Camera, TrendingUp, Calendar,
  AlertTriangle, ArrowUpRight
} from 'lucide-react'

/* ── Mock usage data ── */
const CURRENT_PLAN = {
  name: 'Free',
  memories: { used: 1247, limit: 5000 },
  apiCalls: { used: 3842, limit: 10000 },
  agents: { used: 3, limit: 3 },
  snapshots: { used: 18, limit: null },
  billingCycle: { start: 'Mar 1, 2026', end: 'Mar 31, 2026', daysLeft: 14 },
}

const DAILY_API = [
  { day: 'Mar 1', calls: 120 }, { day: 'Mar 2', calls: 95 },
  { day: 'Mar 3', calls: 210 }, { day: 'Mar 4', calls: 180 },
  { day: 'Mar 5', calls: 310 }, { day: 'Mar 6', calls: 145 },
  { day: 'Mar 7', calls: 88 },  { day: 'Mar 8', calls: 265 },
  { day: 'Mar 9', calls: 340 }, { day: 'Mar 10', calls: 290 },
  { day: 'Mar 11', calls: 195 }, { day: 'Mar 12', calls: 410 },
  { day: 'Mar 13', calls: 380 }, { day: 'Mar 14', calls: 225 },
  { day: 'Mar 15', calls: 170 }, { day: 'Mar 16', calls: 290 },
  { day: 'Mar 17', calls: 129 },
]

const API_BREAKDOWN = [
  { op: 'memory.search', calls: 1520, pct: 39.5 },
  { op: 'memory.add', calls: 1105, pct: 28.8 },
  { op: 'memory.get', calls: 642, pct: 16.7 },
  { op: 'snapshot.create', calls: 312, pct: 8.1 },
  { op: 'branch.create', calls: 145, pct: 3.8 },
  { op: 'memory.delete', calls: 118, pct: 3.1 },
]

const MEMORY_GROWTH = [
  { day: 'Week 1', count: 820 }, { day: 'Week 2', count: 1050 },
  { day: 'Week 3', count: 1247 },
]

function UsageBar({ label, used, limit, icon: Icon, color, warn }) {
  const pct = limit ? Math.min((used / limit) * 100, 100) : 0
  const isHigh = pct >= 80
  return (
    <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="text-xs font-bold">{label}</span>
        </div>
        {isHigh && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
            <AlertTriangle size={10} /> {pct >= 100 ? 'Limit reached' : 'Approaching limit'}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-extrabold font-mono">{used.toLocaleString()}</span>
        {limit && <span className="text-sm text-slate-500">/ {limit.toLocaleString()}</span>}
        {!limit && <span className="text-sm text-slate-500">unlimited</span>}
      </div>
      {limit && (
        <div className="h-2 rounded-full bg-dark-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-amber-400' : 'bg-cyan-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {limit && (
        <div className="text-[10px] text-slate-500 mt-1.5">
          {(limit - used).toLocaleString()} remaining · {pct.toFixed(1)}% used
        </div>
      )}
    </div>
  )
}

function MiniBarChart({ data, maxVal, color = 'bg-cyan-400' }) {
  const max = maxVal || Math.max(...data.map(d => d.calls || d.count))
  return (
    <div className="flex items-end gap-[3px] h-24">
      {data.map((d, i) => {
        const h = max > 0 ? ((d.calls || d.count) / max) * 100 : 0
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className={`w-full rounded-sm ${color} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
              style={{ height: `${Math.max(h, 2)}%` }}
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-dark-3 text-[10px] font-mono text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/[0.06]">
              {d.day}: {(d.calls || d.count).toLocaleString()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function UsagePage() {
  const [period, setPeriod] = useState('current')
  const p = CURRENT_PLAN

  return (
    <div className="max-w-4xl">
      <FadeIn>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold">Usage & Billing</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Billing cycle: {p.billingCycle.start} — {p.billingCycle.end} · {p.billingCycle.daysLeft} days remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-dark-2 px-3 py-1.5 rounded-lg border border-white/[0.06] font-mono">
              {p.name} Plan
            </span>
            <Btn small primary onClick={() => window.location.href = 'mailto:memoria@matrixorigin.io'}>
              Upgrade <ArrowUpRight size={12} />
            </Btn>
          </div>
        </div>
      </FadeIn>

      {/* Usage meters */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <UsageBar label="Memories Stored" used={p.memories.used} limit={p.memories.limit} icon={Brain} color="text-cyan-400" />
          <UsageBar label="API Calls This Month" used={p.apiCalls.used} limit={p.apiCalls.limit} icon={Zap} color="text-violet-400" />
          <UsageBar label="Connected Agents" used={p.agents.used} limit={p.agents.limit} icon={Plug} color="text-emerald-400" />
          <UsageBar label="Snapshots" used={p.snapshots.used} limit={p.snapshots.limit} icon={Camera} color="text-amber-400" />
        </div>
      </FadeIn>

      {/* API calls chart */}
      <FadeIn delay={0.1}>
        <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-violet-400" />
              <span className="text-sm font-bold">Daily API Calls</span>
            </div>
            <div className="flex items-center gap-1">
              {['current', 'last'].map(t => (
                <button
                  key={t}
                  onClick={() => setPeriod(t)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                    period === t ? 'bg-violet-400/10 text-violet-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t === 'current' ? 'This month' : 'Last month'}
                </button>
              ))}
            </div>
          </div>
          <MiniBarChart data={DAILY_API} color="bg-violet-400" />
          <div className="flex justify-between mt-2 text-[10px] text-slate-600 font-mono">
            <span>Mar 1</span>
            <span>Mar 17</span>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* API breakdown */}
        <FadeIn delay={0.15}>
          <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-sm font-bold">API Call Breakdown</span>
            </div>
            <div className="flex flex-col gap-2">
              {API_BREAKDOWN.map(op => (
                <div key={op.op} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 w-28 shrink-0">{op.op}</span>
                  <div className="flex-1 h-2 rounded-full bg-dark-3 overflow-hidden">
                    <div className="h-full rounded-full bg-cyan-400/60" style={{ width: `${op.pct}%` }} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 w-12 text-right">{op.calls}</span>
                  <span className="text-[10px] text-slate-600 w-10 text-right">{op.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Memory growth */}
        <FadeIn delay={0.15}>
          <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={14} className="text-emerald-400" />
              <span className="text-sm font-bold">Memory Growth</span>
            </div>
            <MiniBarChart data={MEMORY_GROWTH} color="bg-emerald-400" />
            <div className="flex justify-between mt-2 text-[10px] text-slate-600 font-mono">
              {MEMORY_GROWTH.map(d => <span key={d.day}>{d.day}</span>)}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-dark-3/50 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">+197</span> memories this week ·
              avg <span className="font-mono">28/day</span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Plan comparison */}
      <FadeIn delay={0.2}>
        <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-sm font-bold">Plan Details</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-dark-3 text-slate-500 text-left">
                  <th className="px-4 py-2.5 font-semibold">Resource</th>
                  <th className="px-4 py-2.5 font-semibold">Used</th>
                  <th className="px-4 py-2.5 font-semibold">Limit</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { res: 'Memory Spaces', used: '1', limit: '1', pct: 100 },
                  { res: 'Memories', used: p.memories.used.toLocaleString(), limit: p.memories.limit.toLocaleString(), pct: (p.memories.used / p.memories.limit) * 100 },
                  { res: 'API Calls / month', used: p.apiCalls.used.toLocaleString(), limit: p.apiCalls.limit.toLocaleString(), pct: (p.apiCalls.used / p.apiCalls.limit) * 100 },
                  { res: 'Connected Agents', used: String(p.agents.used), limit: String(p.agents.limit), pct: (p.agents.used / p.agents.limit) * 100 },
                  { res: 'Snapshots', used: String(p.snapshots.used), limit: '30-day retention', pct: 0 },
                  { res: 'Branches', used: '1', limit: '1', pct: 100 },
                ].map(r => (
                  <tr key={r.res} className="border-t border-white/[0.04]">
                    <td className="px-4 py-2.5 text-slate-200 font-medium">{r.res}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">{r.used}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{r.limit}</td>
                    <td className="px-4 py-2.5">
                      {r.pct >= 100 ? (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">At limit</span>
                      ) : r.pct >= 80 ? (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">High</span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Need more capacity? Upgrade to Pro for 10x limits.
            </span>
            <Btn small ghost onClick={() => window.open('/pricing', '_blank')}>
              Compare Plans <ArrowUpRight size={11} />
            </Btn>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
