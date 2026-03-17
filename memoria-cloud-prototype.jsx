import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════
const T = {
  bg0: "#05070A", bg1: "#0A0D14", bg2: "#10141D", bg3: "#161C28", bg4: "#1E2538",
  border: "rgba(255,255,255,0.06)", borderHover: "rgba(255,255,255,0.12)",
  text: "#E2E8F0", text2: "#8494A7", text3: "#4A5568", textInverse: "#0A0D14",
  cyan: "#22D3EE", cyanDim: "rgba(34,211,238,0.08)", cyanBorder: "rgba(34,211,238,0.2)",
  green: "#34D399", greenDim: "rgba(52,211,153,0.08)", greenBorder: "rgba(52,211,153,0.25)",
  amber: "#FBBF24", amberDim: "rgba(251,191,36,0.08)",
  red: "#F87171", redDim: "rgba(248,113,113,0.08)",
  purple: "#A78BFA", purpleDim: "rgba(167,139,250,0.08)",
  white08: "rgba(255,255,255,0.08)", white04: "rgba(255,255,255,0.04)",
};
const mono = "'JetBrains Mono',monospace";
const sans = "'DM Sans',-apple-system,sans-serif";

// ═══════════════════════════════════════
//  SHARED MICRO-COMPONENTS
// ═══════════════════════════════════════
const Logo = ({ size = 20 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: size, height: size, borderRadius: 5, background: `linear-gradient(135deg,${T.cyan},#0891B2)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: size * 0.55, color: "#fff", fontFamily: mono }}>M</div>
    <span style={{ fontSize: size * 0.75, fontWeight: 800, letterSpacing: -0.5, color: T.text }}>Memoria</span>
  </div>
);

const Btn = ({ children, primary, ghost, small, full, disabled, onClick, style: s }) => (
  <button onClick={onClick} disabled={disabled} style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
    padding: small ? "6px 14px" : "10px 20px", borderRadius: 8, fontSize: small ? 12 : 13.5, fontWeight: 650,
    fontFamily: sans, cursor: disabled ? "not-allowed" : "pointer", transition: "all .2s",
    width: full ? "100%" : "auto", opacity: disabled ? 0.4 : 1,
    background: primary ? T.cyan : ghost ? "transparent" : T.white08,
    color: primary ? T.textInverse : T.text,
    border: ghost ? `1px solid ${T.border}` : primary ? "none" : "none", ...s,
  }}>{children}</button>
);

const Input = ({ label, placeholder, type = "text", value, onChange, icon, mono: isMono }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>{label}</label>}
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 13px", borderRadius: 8, background: T.bg1, border: `1px solid ${T.border}`, transition: "border .2s" }}>
      {icon && <span style={{ color: T.text3, fontSize: 14 }}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
        flex: 1, background: "transparent", border: "none", outline: "none", color: T.text,
        fontSize: 13.5, fontFamily: isMono ? mono : sans,
      }} />
    </div>
  </div>
);

const Pill = ({ children, color = T.cyan, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 12px", borderRadius: 6, fontSize: 11.5, fontWeight: 600, fontFamily: mono,
    background: active ? `${color}20` : T.white04, color: active ? color : T.text3,
    border: `1px solid ${active ? `${color}30` : T.border}`, cursor: "pointer", transition: "all .15s",
  }}>{children}</button>
);

const Divider = () => <div style={{ height: 1, background: T.border, margin: "20px 0" }} />;

const CopyCmd = ({ cmd, label }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}` }}>
      {label && <div style={{ padding: "8px 12px", background: T.bg3, fontSize: 11, color: T.text3, fontWeight: 600, borderRight: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{label}</div>}
      <div style={{ flex: 1, padding: "8px 14px", background: T.bg1, fontFamily: mono, fontSize: 12.5, color: T.text, overflowX: "auto", whiteSpace: "nowrap" }}>{cmd}</div>
      <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }} style={{
        padding: "8px 14px", background: T.bg3, border: "none", borderLeft: `1px solid ${T.border}`,
        color: copied ? T.green : T.text3, fontSize: 11, fontFamily: mono, cursor: "pointer", whiteSpace: "nowrap",
      }}>{copied ? "✓ copied" : "copy"}</button>
    </div>
  );
};

// Agent icon blocks
const AgentBadge = ({ name, size = 32, glow }) => {
  const c = { Cursor: ["#7C3AED", "C"], "Claude Code": ["#D97706", "CC"], Kiro: ["#059669", "K"], OpenClaw: ["#2563EB", "OC"], Custom: [T.cyan, "{}"] };
  const [bg, letter] = c[name] || c.Custom;
  return (
    <div style={{
      width: size, height: size, borderRadius: 7, background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 800, color: "#fff", fontFamily: mono, flexShrink: 0,
      boxShadow: glow ? `0 0 20px ${bg}50` : "none",
    }}>{letter}</div>
  );
};

// Tiny terminal
const MiniTerm = ({ lines, title }) => (
  <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", background: T.bg3, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", gap: 5 }}>{["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}</div>
      <span style={{ fontSize: 11, color: T.text3, fontFamily: mono }}>{title}</span>
    </div>
    <div style={{ padding: "12px 14px", background: T.bg0, fontFamily: mono, fontSize: 12, lineHeight: 1.9 }}>
      {lines.map((l, i) => <div key={i} style={{ color: l.c || T.text2 }}>{l.p && <span style={{ color: T.green }}>❯ </span>}{l.t}</div>)}
    </div>
  </div>
);

// ═══════════════════════════════════════
//  VIEW: AUTH (Login / Register)
// ═══════════════════════════════════════
function AuthView({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: T.bg0, fontFamily: sans }}>
      {/* Left: branding panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 30% 40%, rgba(34,211,238,0.04) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <Logo size={26} />
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.15, marginTop: 40, maxWidth: 440 }}>
          Your agent's memory,<br /><span style={{ background: `linear-gradient(135deg,${T.cyan},${T.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>version-controlled.</span>
        </h1>
        <p style={{ color: T.text2, fontSize: 15, lineHeight: 1.7, marginTop: 16, maxWidth: 400 }}>
          Persistent memory for Cursor, Claude Code, Kiro, and any MCP agent. Snapshot, branch, merge, rollback — like Git, but for what your agent knows.
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 32 }}>
          {[["5,000", "memories free"], ["∞", "snapshots"], ["3", "agents"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: mono, color: T.cyan }}>{v}</div>
              <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Floating code block */}
        <div style={{ marginTop: 48, maxWidth: 380 }}>
          <MiniTerm title="setup" lines={[
            { t: "pip install memoria-lite", p: true, c: T.text },
            { t: "memoria init --cloud", p: true, c: T.text },
            { t: "✓ Connected to Memoria Cloud", c: T.green },
            { t: "✓ Cursor configured. Restart to activate.", c: T.green },
          ]} />
        </div>
      </div>

      {/* Right: auth form */}
      <div style={{ width: 440, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", borderLeft: `1px solid ${T.border}`, background: T.bg1 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p style={{ color: T.text2, fontSize: 13, marginBottom: 28 }}>
          {mode === "login" ? "Sign in to your Memoria Cloud account" : "Free tier includes 5,000 memories and 3 agent connections"}
        </p>

        {/* GitHub OAuth */}
        <Btn full ghost onClick={onAuth} style={{ marginBottom: 12, padding: "11px 20px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
          Continue with GitHub
        </Btn>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 16px" }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 11, color: T.text3 }}>or</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Email" placeholder="you@company.com" icon="✉" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" placeholder="••••••••" type="password" icon="🔑" />
          {mode === "register" && <Input label="Confirm password" placeholder="••••••••" type="password" icon="🔑" />}
        </div>

        <Btn primary full onClick={onAuth} style={{ marginTop: 20 }}>{mode === "login" ? "Sign in" : "Create account"}</Btn>

        <p style={{ fontSize: 12, color: T.text3, marginTop: 16, textAlign: "center" }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: T.cyan, cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Create one" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  VIEW: ONBOARDING (post-signup wizard)
// ═══════════════════════════════════════
function OnboardingView({ onFinish }) {
  const [step, setStep] = useState(0);
  const [agent, setAgent] = useState(null);
  const [deploy, setDeploy] = useState("cloud");
  const [embed, setEmbed] = useState("openai");
  const [projName, setProjName] = useState("my-project");
  const apiKey = "mk_live_a7f3c2e9d1b048...";

  const agents = [
    { id: "cursor", name: "Cursor", desc: "AI code editor", hot: true },
    { id: "claude", name: "Claude Code", desc: "Anthropic CLI agent" },
    { id: "kiro", name: "Kiro", desc: "AWS spec-driven IDE" },
    { id: "openclaw", name: "OpenClaw", desc: "Autonomous browser agent" },
    { id: "custom", name: "Custom", desc: "Any MCP agent" },
  ];

  const agentConfig = {
    cursor: { file: ".cursor/mcp.json", rules: ".cursor/rules/memory.mdc", restart: "Cmd+Shift+P → Reload Window" },
    claude: { file: ".claude/mcp.json", rules: "CLAUDE.md", restart: "Restart terminal" },
    kiro: { file: ".kiro/settings/mcp.json", rules: ".kiro/steering/memory.md", restart: "Restart Kiro" },
    openclaw: { file: "openclaw config", rules: "plugin config", restart: "Restart OpenClaw" },
    custom: { file: "mcp.json", rules: "steering rules", restart: "Restart agent" },
  };

  const ac = agentConfig[agent] || agentConfig.custom;
  const setupCmd = `pip install memoria-lite && cd ${projName} && memoria init --cloud --api-key ${apiKey}${embed === "openai" ? " --embedding-provider openai --embedding-api-key sk-..." : embed === "silicon" ? " --embedding-provider openai --embedding-base-url https://api.siliconflow.cn/v1 --embedding-api-key sk-... --embedding-model BAAI/bge-m3 --embedding-dim 1024" : ""}`;

  return (
    <div style={{ minHeight: "100vh", background: T.bg0, fontFamily: sans, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: `1px solid ${T.border}` }}>
        <Logo size={20} />
        <Btn ghost small onClick={onFinish}>Skip to Dashboard →</Btn>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 640 }}>
          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
            {["Agent", "Embedding", "Connect", "Verify"].map((s, i) => (
              <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 3, borderRadius: 2, background: i <= step ? T.cyan : T.bg3, transition: "background .3s" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: i === step ? T.cyan : T.text3, fontFamily: mono }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Step 0: Choose agent */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Connect your first agent</h2>
              <p style={{ color: T.text2, fontSize: 14, marginBottom: 24 }}>Which tool do you code with? We'll generate the right config.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {agents.map(a => (
                  <button key={a.id} onClick={() => setAgent(a.id)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 10, cursor: "pointer",
                    background: agent === a.id ? T.cyanDim : T.bg2, border: `1px solid ${agent === a.id ? T.cyanBorder : T.border}`,
                    textAlign: "left", transition: "all .15s", position: "relative",
                  }}>
                    <AgentBadge name={a.name} glow={agent === a.id} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: T.text3 }}>{a.desc}</div>
                    </div>
                    {a.hot && <span style={{ position: "absolute", top: 8, right: 10, fontSize: 9, fontWeight: 700, color: T.amber, background: T.amberDim, padding: "1px 6px", borderRadius: 4 }}>POPULAR</span>}
                  </button>
                ))}
              </div>
              <Input label="Project name" placeholder="my-project" value={projName} onChange={e => setProjName(e.target.value)} mono />
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <Btn primary disabled={!agent} onClick={() => setStep(1)}>Next →</Btn>
              </div>
            </div>
          )}

          {/* Step 1: Embedding */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Choose embedding provider</h2>
              <p style={{ color: T.text2, fontSize: 14, marginBottom: 24 }}>
                Embedding converts memories into vectors for semantic search.
                <span style={{ display: "block", marginTop: 6, color: T.amber, fontSize: 12, fontWeight: 600 }}>⚠ This choice is locked after first use. Choose carefully.</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { id: "local", name: "Local (free)", desc: "all-MiniLM-L6-v2 · ~900MB download · data never leaves your machine", dim: 384 },
                  { id: "openai", name: "OpenAI", desc: "text-embedding-3-small · best quality · requires API key", dim: 1536 },
                  { id: "silicon", name: "SiliconFlow", desc: "BAAI/bge-m3 · great for Chinese+English · requires API key", dim: 1024 },
                ].map(e => (
                  <button key={e.id} onClick={() => setEmbed(e.id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                    background: embed === e.id ? T.cyanDim : T.bg2, border: `1px solid ${embed === e.id ? T.cyanBorder : T.border}`,
                    textAlign: "left",
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: T.bg3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {e.id === "local" ? "🖥" : e.id === "openai" ? "🔮" : "🌊"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{e.name}</div>
                      <div style={{ fontSize: 11.5, color: T.text3 }}>{e.desc}</div>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: mono, color: T.text3 }}>dim={e.dim}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
                <Btn ghost onClick={() => setStep(0)}>← Back</Btn>
                <Btn primary onClick={() => setStep(2)}>Next →</Btn>
              </div>
            </div>
          )}

          {/* Step 2: Connect */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Run this in your project</h2>
              <p style={{ color: T.text2, fontSize: 14, marginBottom: 20 }}>One command configures everything. Copy, paste, done.</p>

              {/* API Key */}
              <div style={{ padding: 16, borderRadius: 10, background: T.bg2, border: `1px solid ${T.border}`, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Your API Key</span>
                  <Pill color={T.green} active>Live</Pill>
                </div>
                <CopyCmd cmd={apiKey} />
              </div>

              {/* Setup command */}
              <div style={{ padding: 16, borderRadius: 10, background: T.bg2, border: `1px solid ${T.border}`, marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.text2, display: "block", marginBottom: 8 }}>Setup Command</span>
                <MiniTerm title={projName} lines={[
                  { t: "pip install memoria-lite", p: true, c: T.text },
                  { t: `cd ${projName}`, p: true, c: T.text },
                  { t: `memoria init --cloud --api-key ${apiKey.slice(0, 20)}...`, p: true, c: T.text },
                  { t: `✓ Created ${ac.file}`, c: T.green },
                  { t: `✓ Created ${ac.rules}`, c: T.green },
                  { t: "ℹ Connected to Memoria Cloud (us-west-2)", c: T.cyan },
                ]} />
              </div>

              {/* What it creates */}
              <div style={{ padding: 14, borderRadius: 8, background: T.white04, border: `1px solid ${T.border}`, fontSize: 12, color: T.text2, lineHeight: 1.7 }}>
                <strong style={{ color: T.text }}>This creates:</strong><br />
                <span style={{ fontFamily: mono, color: T.cyan }}>{ac.file}</span> — MCP server config<br />
                <span style={{ fontFamily: mono, color: T.cyan }}>{ac.rules}</span> — Agent steering rules (when to store/retrieve)
              </div>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
                <Btn ghost onClick={() => setStep(1)}>← Back</Btn>
                <Btn primary onClick={() => setStep(3)}>I've run the command →</Btn>
              </div>
            </div>
          )}

          {/* Step 3: Verify */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Verify connection</h2>
              <p style={{ color: T.text2, fontSize: 14, marginBottom: 20 }}>
                Restart <strong style={{ color: T.text }}>{agents.find(a => a.id === agent)?.name || "your agent"}</strong> ({ac.restart}), then run:
              </p>

              <MiniTerm title="verification" lines={[
                { t: "memoria status", p: true, c: T.text },
                { t: "" },
                { t: "Memoria Status", c: T.cyan },
                { t: "  Database:    ✓ connected (memoria-cloud://us-west-2)", c: T.green },
                { t: "  Tables:      ✓ 8 tables OK", c: T.green },
                { t: `  Embedding:   ✓ ${embed === "openai" ? "openai (text-embedding-3-small, dim=1536)" : embed === "silicon" ? "openai (BAAI/bge-m3, dim=1024)" : "local (all-MiniLM-L6-v2, dim=384)"}`, c: T.green },
                { t: `  ${agents.find(a => a.id === agent)?.name}:     ✓ ${ac.file}  |  ${ac.rules}`, c: T.green },
              ]} />

              <div style={{ marginTop: 24, padding: 20, borderRadius: 10, background: T.greenDim, border: `1px solid ${T.greenBorder}`, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>Ready to go!</div>
                <div style={{ fontSize: 13, color: T.text2 }}>Start chatting with your agent. It will remember.</div>
              </div>

              {/* Quick prompts to try */}
              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["💬", "Store a preference", '"I always use pytest, never unittest"'],
                  ["📸", "Create a snapshot", '"Take a snapshot called v1-stable"'],
                  ["🔀", "Try branching", '"Branch my memory to test SQLite"'],
                  ["🔍", "Retrieve memory", '"What do you know about my project?"'],
                ].map(([emoji, title, cmd]) => (
                  <div key={title} style={{ padding: 12, borderRadius: 8, background: T.bg2, border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 3 }}>{emoji} {title}</div>
                    <div style={{ fontSize: 11, color: T.text3, fontStyle: "italic" }}>{cmd}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
                <Btn primary onClick={onFinish}>Go to Dashboard →</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  VIEW: DASHBOARD (post-setup)
// ═══════════════════════════════════════
function DashboardView({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [gitSub, setGitSub] = useState("branches");

  const memories = [
    { id: "m_7f3a", type: "semantic", text: "Project uses Go 1.22 with chi router, sqlc for DB access", conf: 0.95, time: "12m ago", branch: "main" },
    { id: "m_2e9c", type: "profile", text: "User prefers tabs, ruff for formatting, pytest for tests", conf: 0.98, time: "1h ago", branch: "main" },
    { id: "m_a1b4", type: "procedural", text: "Deploy: make build → docker push → kubectl apply -f k8s/", conf: 0.92, time: "3h ago", branch: "main" },
    { id: "m_d8f2", type: "working", text: "Currently refactoring auth module to session tokens", conf: 0.88, time: "30m ago", branch: "refactor/auth" },
    { id: "m_c5e7", type: "semantic", text: "API rate limit: 100 req/min per user, 1000 global", conf: 0.96, time: "2d ago", branch: "main" },
  ];

  const tc = { semantic: T.cyan, profile: T.purple, procedural: T.green, working: T.amber, tool_result: T.text3 };

  const navItems = [
    { id: "overview", label: "Overview", icon: "◎" },
    { id: "memories", label: "Memories", icon: "🧠" },
    { id: "git", label: "Git for Memory", icon: "⑂" },
    { id: "connect", label: "Connect", icon: "⚡" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.bg0, fontFamily: sans }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 20px", height: 48, borderBottom: `1px solid ${T.border}`, background: T.bg1, flexShrink: 0 }}>
        <Logo size={18} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 5, background: T.greenDim }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
          <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>3 agents</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.cyanDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: T.cyan, marginLeft: 12 }}>N</div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 190, borderRight: `1px solid ${T.border}`, padding: "14px 8px", display: "flex", flexDirection: "column", gap: 2, background: T.bg1, flexShrink: 0 }}>
          <div style={{ padding: "6px 10px", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 1 }}>Project</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: mono, color: T.text, marginTop: 2 }}>my-saas-app</div>
          </div>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer",
              background: tab === n.id ? T.cyanDim : "transparent", color: tab === n.id ? T.cyan : T.text3,
              fontSize: 13, fontWeight: tab === n.id ? 650 : 400, fontFamily: sans, textAlign: "left", width: "100%",
            }}><span style={{ fontSize: 14 }}>{n.icon}</span>{n.label}</button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: 10, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.text3 }}>Memories</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: mono, marginTop: 2 }}>1,247</div>
            <div style={{ height: 4, borderRadius: 2, background: T.bg3, marginTop: 6 }}>
              <div style={{ width: "25%", height: "100%", borderRadius: 2, background: T.cyan }} />
            </div>
            <div style={{ fontSize: 10, color: T.text3, marginTop: 3 }}>1,247 / 5,000 free</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div style={{ maxWidth: 900 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Dashboard</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Memories", value: "1,247", sub: "+38 this week", color: T.cyan },
                  { label: "Branches", value: "4", sub: "2 active", color: T.green },
                  { label: "Snapshots", value: "12", sub: "Latest: 2h ago", color: T.purple },
                  { label: "Agents", value: "3", sub: "Cursor · CC · Kiro", color: T.amber },
                ].map(s => (
                  <div key={s.label} style={{ padding: "14px 16px", borderRadius: 8, background: T.bg2, border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 11, color: T.text3, textTransform: "uppercase", letterSpacing: .5, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, fontFamily: mono, color: T.text, marginTop: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Activity feed */}
              <div style={{ padding: 18, borderRadius: 8, background: T.bg2, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>Recent Activity</div>
                {[
                  { action: "memory_store", detail: "API rate limit: 100 req/min...", agent: "Cursor", time: "12m ago", c: T.green },
                  { action: "memory_correct", detail: "black → ruff for formatting", agent: "Claude Code", time: "1h ago", c: T.amber },
                  { action: "memory_snapshot", detail: '"before_db_refactor"', agent: "Cursor", time: "2h ago", c: T.purple },
                  { action: "memory_branch", detail: '"refactor/auth" created', agent: "Kiro", time: "3h ago", c: T.cyan },
                  { action: "memory_merge", detail: '"eval_sqlite" → main', agent: "Cursor", time: "1d ago", c: T.green },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.c, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontFamily: mono, color: a.c, fontWeight: 600, width: 130 }}>{a.action}</span>
                    <span style={{ fontSize: 12, color: T.text2, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</span>
                    <span style={{ fontSize: 11, color: T.text3, whiteSpace: "nowrap" }}>via <span style={{ color: T.cyan }}>{a.agent}</span> · {a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMORIES */}
          {tab === "memories" && (
            <div style={{ maxWidth: 900 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Memory Explorer</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 7 }}>
                  <span style={{ color: T.text3, fontSize: 13 }}>🔍</span>
                  <input placeholder="Semantic search..." style={{ background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 13, width: 200, fontFamily: sans }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {["all", "semantic", "profile", "procedural", "working"].map(f => (
                  <Pill key={f} color={tc[f] || T.cyan} active={f === "all"}>{f}</Pill>
                ))}
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: T.text3, display: "flex", alignItems: "center", gap: 4 }}>
                  Branch: <span style={{ color: T.green, fontFamily: mono }}>main</span>
                </span>
              </div>
              <div style={{ borderRadius: 8, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {memories.map((m, i) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderBottom: i < memories.length - 1 ? `1px solid ${T.border}` : "none", background: T.bg2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: `${tc[m.type]}18`, color: tc[m.type], fontFamily: mono }}>{m.type}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{m.text}</div>
                      <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: T.text3, fontFamily: mono }}>{m.id}</span>
                        <span style={{ fontSize: 11, color: T.text3 }}>conf: {m.conf}</span>
                        <span style={{ fontSize: 11, color: T.text3 }}>{m.time}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: T.text3, fontFamily: mono }}>{m.branch}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GIT FOR MEMORY */}
          {tab === "git" && (
            <div style={{ maxWidth: 900 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Git for Memory</h2>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn small ghost>📸 Snapshot</Btn>
                  <Btn small primary>⑂ New Branch</Btn>
                </div>
              </div>
              <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 16 }}>
                {["branches", "snapshots", "diff"].map(s => (
                  <button key={s} onClick={() => setGitSub(s)} style={{
                    padding: "8px 16px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    background: "transparent", color: gitSub === s ? T.cyan : T.text3, fontFamily: sans,
                    borderBottom: gitSub === s ? `2px solid ${T.cyan}` : "2px solid transparent",
                  }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                ))}
              </div>

              {gitSub === "branches" && (
                <div style={{ borderRadius: 8, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                  {[
                    { name: "main", color: T.green, count: 47, status: "HEAD" },
                    { name: "eval_sqlite", color: T.cyan, count: 5, status: "merged" },
                    { name: "refactor/auth", color: T.amber, count: 12, status: "active" },
                    { name: "experiment/redis", color: T.purple, count: 3, status: "active" },
                  ].map((b, i) => (
                    <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: i < 3 ? `1px solid ${T.border}` : "none", background: T.bg2 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.color, boxShadow: b.name === "main" ? `0 0 8px ${b.color}60` : "none" }} />
                      <span style={{ fontFamily: mono, fontSize: 13, color: b.color, fontWeight: 700, width: 180 }}>{b.name}</span>
                      <span style={{ fontSize: 11, color: T.text3 }}>{b.count} memories</span>
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: b.status === "HEAD" ? T.greenDim : b.status === "merged" ? `${T.green}15` : T.cyanDim, color: b.status === "HEAD" ? T.green : b.status === "merged" ? T.green : T.cyan }}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {gitSub === "snapshots" && (
                <div style={{ paddingLeft: 16, position: "relative" }}>
                  <div style={{ position: "absolute", left: 7, top: 6, bottom: 6, width: 2, background: `linear-gradient(${T.cyan},${T.bg3})` }} />
                  {[
                    { name: "before_db_refactor", time: "2h ago", count: 142, desc: "Pre-refactor state" },
                    { name: "v0.3.0_release", time: "3d ago", count: 138, desc: "Stable release" },
                    { name: "auth_migration", time: "1w ago", count: 125, desc: "After auth migration" },
                  ].map((s, i) => (
                    <div key={s.name} style={{ display: "flex", gap: 14, marginBottom: 18, position: "relative" }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${i === 0 ? T.cyan : T.bg3}`, background: i === 0 ? T.cyanDim : T.bg2, position: "absolute", left: -16, top: 2, zIndex: 1 }} />
                      <div style={{ marginLeft: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: mono, fontSize: 13, color: T.cyan, fontWeight: 700 }}>{s.name}</span>
                          <span style={{ fontSize: 10, color: T.text3 }}>{s.count} memories · {s.time}</span>
                        </div>
                        <div style={{ fontSize: 12, color: T.text3, marginTop: 2 }}>{s.desc}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                          <Btn small ghost style={{ padding: "3px 8px", fontSize: 11 }}>↩ rollback</Btn>
                          <Btn small ghost style={{ padding: "3px 8px", fontSize: 11 }}>⑂ branch</Btn>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {gitSub === "diff" && (
                <div style={{ borderRadius: 8, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", background: T.bg3, borderBottom: `1px solid ${T.border}`, fontSize: 12, color: T.text3 }}>
                    Comparing <span style={{ color: T.cyan, fontFamily: mono }}>eval_sqlite</span> → <span style={{ color: T.green, fontFamily: mono }}>main</span> · 3 changes
                  </div>
                  {[
                    { op: "ADD", text: "Project uses SQLite for persistence", color: T.green },
                    { op: "UPDATE", text: "Database engine: SQLite (was: PostgreSQL)", color: T.amber },
                    { op: "DELETE", text: "PostgreSQL pool size set to 20", color: T.red },
                  ].map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: i < 2 ? `1px solid ${T.border}` : "none", background: `${d.color}04` }}>
                      <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 800, color: d.color, width: 56, textAlign: "center" }}>{d.op}</span>
                      <span style={{ fontSize: 13, color: d.op === "DELETE" ? T.text3 : T.text, textDecoration: d.op === "DELETE" ? "line-through" : "none" }}>{d.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONNECT */}
          {tab === "connect" && (
            <div style={{ maxWidth: 700 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Connect Agents</h2>
              <p style={{ color: T.text2, fontSize: 13, marginBottom: 20 }}>One command per agent. All share the same memory pool.</p>

              <CopyCmd label="API Key" cmd="mk_live_a7f3c2e9d1b048..." />

              <div style={{ marginTop: 16 }}>
                <CopyCmd label="Setup" cmd="pip install memoria-lite && cd your-project && memoria init --cloud --api-key mk_live_a7f3..." />
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 28, marginBottom: 12 }}>Connected Agents</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "Cursor", project: "my-saas-app", last: "12m ago", active: true },
                  { name: "Claude Code", project: "my-saas-app", last: "1h ago", active: true },
                  { name: "Kiro", project: "my-saas-app", last: "3h ago", active: true },
                ].map(a => (
                  <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, background: T.bg2, border: `1px solid ${a.active ? T.greenBorder : T.border}` }}>
                    <AgentBadge name={a.name} size={28} glow={a.active} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: T.text3, fontFamily: mono }}>{a.project}</div>
                    </div>
                    <div style={{ fontSize: 11, color: T.text3 }}>Last: {a.last}</div>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 28, marginBottom: 12 }}>Add More Agents</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {["Windsurf", "VS Code Copilot", "Custom MCP"].map(a => (
                  <div key={a} style={{ padding: 14, borderRadius: 8, background: T.bg2, border: `1px dashed ${T.border}`, textAlign: "center", cursor: "pointer" }}>
                    <AgentBadge name={a.includes("Custom") ? "Custom" : a} size={28} />
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>{a}</div>
                    <div style={{ fontSize: 11, color: T.cyan, marginTop: 4 }}>+ Connect</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button:hover:not(:disabled) { filter: brightness(1.08); }
        input::placeholder { color: ${T.text3}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.bg0}; }
        ::-webkit-scrollbar-thumb { background: ${T.bg3}; border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════
//  APP ROUTER
// ═══════════════════════════════════════
export default function MemoriaCloudApp() {
  const [view, setView] = useState("auth"); // "auth" | "onboarding" | "dashboard"

  if (view === "auth") return <AuthView onAuth={() => setView("onboarding")} />;
  if (view === "onboarding") return <OnboardingView onFinish={() => setView("dashboard")} />;
  return <DashboardView onLogout={() => setView("auth")} />;
}
