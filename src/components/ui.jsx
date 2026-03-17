import { useState } from 'react'
import { motion } from 'framer-motion'

// ── Logo ──
export function Logo({ size = 'md' }) {
  const s = size === 'lg' ? 'w-8 h-8 text-sm' : size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'
  const t = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'
  return (
    <div className="flex items-center gap-2">
      <div className={`${s} rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center font-black text-white font-mono`}>
        M
      </div>
      <span className={`${t} font-extrabold tracking-tight`}>Memoria</span>
    </div>
  )
}

// ── Button ──
export function Btn({ children, primary, ghost, small, full, disabled, onClick, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
  const sz = small ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2.5 text-[13px]'
  const variant = primary
    ? 'bg-cyan-400 text-dark-0 hover:bg-cyan-300'
    : ghost
      ? 'border border-white/[0.06] text-slate-200 hover:border-white/[0.12] hover:bg-white/[0.04]'
      : 'bg-white/[0.08] text-slate-200 hover:bg-white/[0.12]'
  const w = full ? 'w-full' : ''
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${sz} ${variant} ${w} ${className}`}>
      {children}
    </button>
  )
}

// ── Input ──
export function Input({ label, placeholder, type = 'text', value, onChange, icon, mono }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-400">{label}</label>}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-dark-1 border border-white/[0.06] focus-within:border-cyan-400/30 transition-colors">
        {icon && <span className="text-slate-500 text-sm">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`flex-1 bg-transparent border-none outline-none text-slate-200 text-[13px] ${mono ? 'font-mono' : 'font-sans'}`}
        />
      </div>
    </div>
  )
}

// ── Pill / Tag ──
export function Pill({ children, color = 'cyan', active, onClick }) {
  const colors = {
    cyan: active ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' : 'bg-white/[0.04] text-slate-500 border-white/[0.06]',
    green: active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-white/[0.04] text-slate-500 border-white/[0.06]',
    purple: active ? 'bg-violet-400/10 text-violet-400 border-violet-400/20' : 'bg-white/[0.04] text-slate-500 border-white/[0.06]',
    amber: active ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-white/[0.04] text-slate-500 border-white/[0.06]',
    red: active ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-white/[0.04] text-slate-500 border-white/[0.06]',
  }
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-[11px] font-semibold font-mono border transition-all ${colors[color] || colors.cyan} cursor-pointer`}
    >
      {children}
    </button>
  )
}

// ── Copy Command ──
export function CopyCmd({ cmd, label }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center rounded-lg overflow-hidden border border-white/[0.06]">
      {label && (
        <div className="px-3 py-2 bg-dark-3 text-[11px] text-slate-500 font-semibold border-r border-white/[0.06] whitespace-nowrap">
          {label}
        </div>
      )}
      <div className="flex-1 px-3.5 py-2 bg-dark-1 font-mono text-[12px] text-slate-200 overflow-x-auto whitespace-nowrap">
        {cmd}
      </div>
      <button
        onClick={handleCopy}
        className="px-3.5 py-2 bg-dark-3 border-l border-white/[0.06] text-[11px] font-mono text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors whitespace-nowrap"
      >
        {copied ? '✓ copied' : 'copy'}
      </button>
    </div>
  )
}

// ── Agent Badge ──
const AGENT_COLORS = {
  Cursor: ['#7C3AED', 'C'],
  'Claude Code': ['#D97706', 'CC'],
  Kiro: ['#059669', 'K'],
  OpenClaw: ['#2563EB', 'OC'],
  Windsurf: ['#0EA5E9', 'W'],
  Custom: ['#22D3EE', '{}'],
}

export function AgentBadge({ name, size = 32, glow }) {
  const [bg, letter] = AGENT_COLORS[name] || AGENT_COLORS.Custom
  return (
    <div
      className="rounded-lg flex items-center justify-center font-extrabold text-white font-mono shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.38,
        boxShadow: glow ? `0 0 20px ${bg}50` : 'none',
      }}
    >
      {letter}
    </div>
  )
}

// ── Mini Terminal ──
export function MiniTerm({ lines, title }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06]">
      <div className="flex items-center gap-2 px-3 py-2 bg-dark-3 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[11px] text-slate-500 font-mono">{title}</span>
      </div>
      <div className="px-3.5 py-3 bg-dark-0 font-mono text-[12px] leading-7">
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.c || '#8494A7' }}>
            {l.p && <span className="text-emerald-400">❯ </span>}
            {l.t}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stat Card ──
export function StatCard({ label, value, sub, color = '#22D3EE', icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-dark-2 border border-white/[0.06] hover:border-white/[0.1] transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{label}</span>
        {icon && <span className="text-sm opacity-50">{icon}</span>}
      </div>
      <div className="text-2xl font-extrabold font-mono" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}
    </motion.div>
  )
}

// ── Fade-in wrapper ──
export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
