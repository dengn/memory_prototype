import { useState } from 'react'
import { Btn, Input, CopyCmd, FadeIn } from '../../components/ui'
import { Key, Database, Trash2, RefreshCw, Download } from 'lucide-react'

export default function SettingsPage() {
  const [spaceName, setSpaceName] = useState('my-saas-app')

  return (
    <div className="max-w-3xl">
      <FadeIn>
        <h2 className="text-xl font-extrabold mb-6">Settings</h2>
      </FadeIn>

      <FadeIn delay={0.05}>
        <section className="mb-8">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Database size={14} className="text-cyan-400" />
            Memory Space
          </h3>
          <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <Input label="Space name" value={spaceName} onChange={e => setSpaceName(e.target.value)} mono />
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">Free Tier</span>
              <span>·</span>
              <span>1 Memory Space</span>
              <span>·</span>
              <span>5,000 memories</span>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="mb-8">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Key size={14} className="text-amber-400" />
            API Key
          </h3>
          <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-400">Live Key</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <CopyCmd cmd="mk_live_a7f3c2e9d1b048..." />
            </div>
            <Btn small ghost className="mt-3">
              <RefreshCw size={12} /> Regenerate Key
            </Btn>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.15}>
        <section className="mb-8">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Download size={14} className="text-slate-400" />
            Data Management
          </h3>
          <div className="p-5 rounded-xl bg-dark-2 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Btn small ghost>
                <Download size={12} /> Export All Memories
              </Btn>
              <Btn small ghost className="text-red-400 border-red-400/20 hover:bg-red-400/[0.06]">
                <Trash2 size={12} /> Clear All Memories
              </Btn>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Export format: JSON. Includes all memories, snapshots, and branch info.
            </p>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}
