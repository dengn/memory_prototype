import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo, Btn, Input, MiniTerm, FadeIn } from '../components/ui'
import { Github, Mail, Lock, ArrowRight } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function AuthPage({ onAuth }) {
  const nav = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  const handleSubmit = () => {
    onAuth?.()
    nav('/welcome')
  }

  return (
    <div className="min-h-screen flex bg-dark-0 font-sans">
      {/* Left: Branding */}
      <div className="flex-1 hidden lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-400/[0.03] blur-[120px]" />
        </div>

        <div className="w-full max-w-md px-12 relative">
          <FadeIn>
            <Logo size="lg" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-black tracking-tight leading-[1.15] mt-10">
              Your agent's memory,
              <br />
              <span className="text-gradient">version-controlled.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-slate-400 text-[15px] leading-relaxed mt-4">
              Persistent memory for Cursor, Claude Code, Kiro, and any MCP agent.
              Snapshot, branch, merge, rollback — like Git, but for what your agent knows.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex gap-5 mt-8">
              {[['5,000', 'memories free'], ['∞', 'snapshots'], ['3', 'agents']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-xl font-extrabold font-mono text-cyan-400">{v}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-12">
              <MiniTerm title="setup" lines={[
                { t: 'pip install memoria-lite', p: true, c: '#E2E8F0' },
                { t: 'memoria init --cloud', p: true, c: '#E2E8F0' },
                { t: '✓ Connected to Memoria Cloud', c: '#34D399' },
                { t: '✓ Cursor configured. Restart to activate.', c: '#34D399' },
              ]} />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="w-full lg:w-[440px] flex flex-col justify-center px-8 lg:px-12 border-l border-white/[0.06] bg-dark-1">
        <FadeIn>
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <h2 className="text-2xl font-extrabold mb-1.5">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-slate-400 text-[13px] mb-7">
            {mode === 'login'
              ? 'Sign in to your Memoria Cloud account'
              : 'Free tier includes 5,000 memories and 3 agent connections'}
          </p>

          {/* SSO Buttons */}
          <div className="flex flex-col gap-2.5 mb-4">
            <Btn full ghost onClick={handleSubmit}>
              <Github size={18} />
              Continue with GitHub
            </Btn>
            <Btn full ghost onClick={handleSubmit}>
              <GoogleIcon />
              Continue with Google
            </Btn>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-slate-500">or continue with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            <Input
              label="Email"
              placeholder="you@company.com"
              icon={<Mail size={14} />}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              icon={<Lock size={14} />}
              value={pw}
              onChange={e => setPw(e.target.value)}
            />
            {mode === 'register' && (
              <Input
                label="Confirm password"
                placeholder="••••••••"
                type="password"
                icon={<Lock size={14} />}
              />
            )}
          </div>

          <Btn primary full onClick={handleSubmit} className="mt-5">
            {mode === 'login' ? 'Sign in' : 'Create account'}
            <ArrowRight size={14} />
          </Btn>

          <p className="text-xs text-slate-500 mt-4 text-center">
            {mode === 'login' ? "Don't have an account?" : 'Already have one?'}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-cyan-400 font-semibold ml-1 cursor-pointer bg-transparent border-none"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </FadeIn>
      </div>
    </div>
  )
}
