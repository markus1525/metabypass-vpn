import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const countries = [
  { name: "Singapore",     code: "SG", flag: "🇸🇬", basePing: 12,  region: "Asia",        metaOptimized: true  },
  { name: "Thailand",      code: "TH", flag: "🇹🇭", basePing: 18,  region: "Asia",        metaOptimized: true  },
  { name: "Malaysia",      code: "MY", flag: "🇲🇾", basePing: 22,  region: "Asia",        metaOptimized: true  },
  { name: "Vietnam",       code: "VN", flag: "🇻🇳", basePing: 28,  region: "Asia",        metaOptimized: true  },
  { name: "Indonesia",     code: "ID", flag: "🇮🇩", basePing: 35,  region: "Asia",        metaOptimized: true  },
  { name: "Hong Kong",     code: "HK", flag: "🇭🇰", basePing: 38,  region: "Asia",        metaOptimized: true  },
  { name: "Philippines",   code: "PH", flag: "🇵🇭", basePing: 42,  region: "Asia",        metaOptimized: true  },
  { name: "Japan",         code: "JP", flag: "🇯🇵", basePing: 45,  region: "Asia",        metaOptimized: true  },
  { name: "South Korea",   code: "KR", flag: "🇰🇷", basePing: 52,  region: "Asia",        metaOptimized: false },
  { name: "Taiwan",        code: "TW", flag: "🇹🇼", basePing: 55,  region: "Asia",        metaOptimized: true  },
  { name: "India",         code: "IN", flag: "🇮🇳", basePing: 60,  region: "Asia",        metaOptimized: false },
  { name: "Australia",     code: "AU", flag: "🇦🇺", basePing: 90,  region: "Asia-Pacific", metaOptimized: false },
  { name: "United States", code: "US", flag: "🇺🇸", basePing: 180, region: "Americas",    metaOptimized: true  },
  { name: "Canada",        code: "CA", flag: "🇨🇦", basePing: 195, region: "Americas",    metaOptimized: false },
  { name: "United Kingdom",code: "GB", flag: "🇬🇧", basePing: 210, region: "Europe",      metaOptimized: false },
  { name: "Netherlands",   code: "NL", flag: "🇳🇱", basePing: 218, region: "Europe",      metaOptimized: false },
  { name: "France",        code: "FR", flag: "🇫🇷", basePing: 220, region: "Europe",      metaOptimized: false },
  { name: "Germany",       code: "DE", flag: "🇩🇪", basePing: 225, region: "Europe",      metaOptimized: false },
  { name: "Sweden",        code: "SE", flag: "🇸🇪", basePing: 230, region: "Europe",      metaOptimized: false },
  { name: "Switzerland",   code: "CH", flag: "🇨🇭", basePing: 235, region: "Europe",      metaOptimized: false },
];

const metaApps = [
  { name: "Facebook",  icon: "f", color: "#1877F2" },
  { name: "Messenger", icon: "✉", color: "#00B2FF" },
  { name: "Instagram", icon: "▣", color: "#E1306C" },
  { name: "WhatsApp",  icon: "w", color: "#25D366" },
];

const getPingColor = (p) => p < 40 ? "#00e87a" : p < 100 ? "#ffc107" : "#ff5252";
const getPingLabel = (p) => p < 40 ? "Excellent" : p < 100 ? "Good" : "Fair";
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080c14;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }

  #root {
    min-height: 100dvh;
    min-height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
  }

  ::-webkit-scrollbar { width: 0; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
  @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse     { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.08);opacity:0.3} }
  @keyframes radar     { 0%{transform:translate(-50%,-50%) scale(0.2);opacity:1} 100%{transform:translate(-50%,-50%) scale(2.4);opacity:0} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.15} }
  @keyframes unlockPop { 0%{transform:scale(0.4);opacity:0} 65%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
  @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes sheetUp   { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes alertPop  { from{opacity:0;transform:scale(0.86)} to{opacity:1;transform:scale(1)} }
  @keyframes onboardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 32px rgba(24,119,242,0.4)} 50%{box-shadow:0 0 56px rgba(24,119,242,0.75)} }
  @keyframes shimmer   { 0%,100%{opacity:0.4} 50%{opacity:1} }

  .btn-connect {
    transition: transform 0.15s ease, box-shadow 0.3s ease;
  }
  .btn-connect:active { transform: scale(0.96); }

  input::placeholder { color: rgba(255,255,255,0.25); }
  input:focus { outline: none; }
`;

// ─── Overlay Dialog ────────────────────────────────────────────────────────────
const Overlay = ({ children }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 300,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(12px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "overlayIn 0.2s ease",
    padding: "0 20px",
  }}>
    {children}
  </div>
);

const AlertBox = ({ icon, iconBg, title, body, actions }) => (
  <Overlay>
    <div style={{
      width: "100%", maxWidth: 320,
      background: "#111827",
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.1)",
      overflow: "hidden",
      animation: "alertPop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
    }}>
      <div style={{ padding: "28px 24px 20px", textAlign: "center" }}>
        {icon && (
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: iconBg || "rgba(24,119,242,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px",
          }}>{icon}</div>
        )}
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7 }}>{body}</div>
      </div>
      <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {actions.map((a, i) => (
          <button key={i} onClick={a.onPress} style={{
            flex: 1, padding: "15px 8px",
            background: "none", border: "none",
            borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
            color: a.primary ? "#4da3ff" : "rgba(255,255,255,0.4)",
            fontSize: 14, fontWeight: a.primary ? 700 : 400,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.04)"}
            onMouseLeave={e => e.target.style.background = "none"}
          >{a.label}</button>
        ))}
      </div>
    </div>
  </Overlay>
);

// ─── Profile Sheet ─────────────────────────────────────────────────────────────
const ProfileSheet = ({ onInstall, onCancel }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 300,
    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
    display: "flex", alignItems: "flex-end",
    animation: "overlayIn 0.2s ease",
  }}>
    <div style={{
      width: "100%", background: "#111827",
      borderRadius: "24px 24px 0 0",
      border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none",
      animation: "sheetUp 0.35s cubic-bezier(0.32,0.72,0,1)",
      paddingBottom: "env(safe-area-inset-bottom, 24px)",
    }}>
      <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 4, margin: "14px auto 0" }} />
      <div style={{ padding: "20px 24px 0", display: "flex", gap: 16, alignItems: "center" }}>
        <img src={process.env.PUBLIC_URL + "/master-icon.png"} alt="MetaBypass" style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0 }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Install VPN Profile</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>MetaBypass VPN · Configuration Profile</div>
        </div>
      </div>
      <div style={{ margin: "18px 24px 0", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        {[
          ["Signed by", "Min Thu Kyaw Khaung (Markus)"],
          ["Type", "VPN Configuration"],
          ["Protocol", "WireGuard / IKEv2"],
          ["Contains", "VPN Payload, DNS Settings"],
        ].map(([l, v], i, arr) => (
          <div key={l} style={{
            display: "flex", justifyContent: "space-between", padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{l}</span>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, textAlign: "right", maxWidth: 200 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onInstall} style={{
          width: "100%", padding: "15px",
          borderRadius: 14, border: "none",
          background: "linear-gradient(135deg,#1877F2,#00B2FF)",
          color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 6px 24px rgba(24,119,242,0.4)",
          fontFamily: "'DM Sans', sans-serif",
        }}>Install Profile</button>
        <button onClick={onCancel} style={{
          width: "100%", padding: "14px",
          borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent", color: "rgba(255,255,255,0.45)",
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>Cancel</button>
      </div>
    </div>
  </div>
);

// ─── Onboarding ────────────────────────────────────────────────────────────────
const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      emoji: null, useIcon: true,
      title: "Welcome to\nMetaBypass VPN",
      sub: "Bypass Myanmar's Facebook & Meta app restrictions with one tap. Free. Fast. Secure.",
      cta: "Get Started",
    },
    {
      emoji: "🌐", bg: "rgba(0,200,150,0.12)", borderColor: "rgba(0,200,150,0.2)",
      title: "Full Device\nProtection",
      sub: "Route all your traffic through a secure server — every app, browser, and service stays protected automatically.",
      cta: "Continue",
    },
    {
      emoji: "⚡", bg: "rgba(255,180,0,0.12)", borderColor: "rgba(255,180,0,0.2)",
      title: "Auto Best\nServer Finder",
      sub: "Our scanner tests servers worldwide in real time and auto-connects you to the fastest one.",
      cta: "Continue",
    },
    {
      emoji: "🔒", bg: "rgba(24,119,242,0.12)", borderColor: "rgba(24,119,242,0.2)",
      title: "Private &\nNo-Log",
      sub: "WireGuard encryption. Zero logs. Kill switch. Your activity is never recorded or shared.",
      cta: "Allow Permissions →",
      last: true,
    },
  ];
  const s = steps[step];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#080c14",
      display: "flex", flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Top bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "env(safe-area-inset-top, 16px) 24px 0" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: 4, width: i === step ? 24 : 6,
              borderRadius: 4,
              background: i === step ? "#1877F2" : "rgba(255,255,255,0.12)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
        {step < steps.length - 1 && (
          <button onClick={onDone} style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.3)", fontSize: 13,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Skip</button>
        )}
      </div>

      {/* Content */}
      <div key={step} style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 32px", maxWidth: 480, width: "100%",
        animation: "onboardIn 0.4s ease",
      }}>
        {/* Icon */}
        {s.useIcon ? (
          <img src={process.env.PUBLIC_URL + "/master-icon.png"} alt="MetaBypass" style={{
            width: 100, height: 100, borderRadius: 26,
            marginBottom: 36, objectFit: "contain",
            filter: "drop-shadow(0 8px 32px rgba(24,119,242,0.4))",
          }} />
        ) : (
          <div style={{
            width: 100, height: 100, borderRadius: 28,
            background: s.bg, border: `1px solid ${s.borderColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48, marginBottom: 36,
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          }}>{s.emoji}</div>
        )}

        <h1 style={{
          color: "#fff", fontSize: 30, fontWeight: 700,
          textAlign: "center", lineHeight: 1.25,
          marginBottom: 16, whiteSpace: "pre-line",
        }}>{s.title}</h1>

        <p style={{
          color: "rgba(255,255,255,0.45)", fontSize: 15,
          textAlign: "center", lineHeight: 1.75,
          maxWidth: 320,
        }}>{s.sub}</p>

        {s.last && (
          <div style={{
            marginTop: 28, padding: "16px 18px",
            background: "rgba(24,119,242,0.07)",
            border: "1px solid rgba(24,119,242,0.18)",
            borderRadius: 14, width: "100%",
          }}>
            <div style={{ color: "#4da3ff", fontSize: 10, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>REQUIRED PERMISSIONS</div>
            {[
              ["🔔", "Notifications — connection status alerts"],
              ["🌐", "VPN Config — shown in app, set up manually"],
            ].map(([ic, t]) => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{ic}</span>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ width: "100%", maxWidth: 480, padding: "0 24px 32px" }}>
        <button
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onDone()}
          className="btn-connect"
          style={{
            width: "100%", padding: "17px",
            borderRadius: 16, border: "none",
            background: "linear-gradient(135deg,#1877F2,#00B2FF)",
            color: "#fff", fontSize: 16, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 8px 32px rgba(24,119,242,0.45)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >{s.cta}</button>
        <div style={{ textAlign: "center", marginTop: 14, color: "rgba(255,255,255,0.18)", fontSize: 11 }}>
          by Min Thu Kyaw Khaung (Markus)
        </div>
      </div>
    </div>
  );
};

// ─── Globe Visual ──────────────────────────────────────────────────────────────
const Globe = ({ phase, scanResults, activeApps }) => {
  const isConnected  = phase === "connected";
  const isScanning   = phase === "scanning";
  const isConnecting = phase === "connecting";
  const size = 160;

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      {/* Radar rings */}
      {isScanning && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: size, height: size, borderRadius: "50%",
          border: "1.5px solid rgba(100,181,246,0.5)",
          animation: `radar 2s ease-out ${i * 0.66}s infinite`,
        }} />
      ))}
      {/* Pulse rings */}
      {isConnected && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute",
          width: size + i * 50, height: size + i * 50,
          borderRadius: "50%",
          border: `1px solid rgba(24,119,242,${0.2 - i * 0.06})`,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          animation: `pulse ${2.5 + i * 0.6}s ease-in-out ${i * 0.3}s infinite`,
        }} />
      ))}

      {/* Globe sphere */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: isConnected
          ? "radial-gradient(circle at 35% 30%,#64b5f6,#1877F2,#0d47a1)"
          : isScanning
            ? "radial-gradient(circle at 35% 30%,#1a3a5c,#0d2040,#050e1a)"
            : "radial-gradient(circle at 35% 30%,#1a1f2e,#12151f,#080a12)",
        boxShadow: isConnected
          ? "0 0 60px rgba(24,119,242,0.6), inset 0 0 40px rgba(255,255,255,0.08)"
          : isScanning
            ? "0 0 40px rgba(100,181,246,0.3)"
            : "0 4px 30px rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
        transition: "all 0.6s ease",
        position: "relative", overflow: "hidden",
        animation: isConnected ? "glowPulse 2.5s ease infinite" : "none",
      }}>
        <svg width={size} height={size} style={{ position: "absolute", opacity: isConnected ? 0.2 : 0.06 }}>
          <ellipse cx={size/2} cy={size/2} rx={size/2-2} ry={size*0.22} fill="none" stroke="white" strokeWidth="0.8"/>
          <ellipse cx={size/2} cy={size/2} rx={size/2-2} ry={size*0.38} fill="none" stroke="white" strokeWidth="0.8"/>
          <line x1={size/2} y1={2} x2={size/2} y2={size-2} stroke="white" strokeWidth="0.8"/>
          <line x1={2} y1={size/2} x2={size-2} y2={size/2} stroke="white" strokeWidth="0.8"/>
        </svg>

        {isScanning ? (
          <>
            <div style={{ fontSize: 28, position: "relative", zIndex: 1, animation: "spin 2s linear infinite" }}>🔍</div>
            <div style={{ fontSize: 8, color: "rgba(100,181,246,0.9)", letterSpacing: 2, marginTop: 6, position: "relative", zIndex: 1, animation: "shimmer 1s ease infinite", fontFamily: "'DM Mono', monospace" }}>SCANNING</div>
          </>
        ) : isConnecting ? (
          <>
            <div style={{ fontSize: 28, position: "relative", zIndex: 1, animation: "pulse 0.8s ease infinite" }}>⚡</div>
            <div style={{ fontSize: 8, color: "rgba(255,180,0,0.9)", letterSpacing: 2, marginTop: 6, position: "relative", zIndex: 1, fontFamily: "'DM Mono', monospace" }}>TUNNELING</div>
          </>
        ) : (
          <>
            {isConnected ? (
              <img src={process.env.PUBLIC_URL + "/master-icon.png"} alt="" style={{ width: 52, height: 52, objectFit: "contain", position: "relative", zIndex: 1, filter: "brightness(1.3)" }} />
            ) : (
              <img src={process.env.PUBLIC_URL + "/master-icon.png"} alt="" style={{ width: 52, height: 52, objectFit: "contain", position: "relative", zIndex: 1, filter: "grayscale(1) brightness(0.3)" }} />
            )}
            <div style={{ fontSize: 8, color: isConnected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)", letterSpacing: 2, marginTop: 6, position: "relative", zIndex: 1, fontFamily: "'DM Mono', monospace" }}>
              {isConnected ? (activeApps.length === 4 ? "SECURED" : "BYPASSED") : "NOT CONNECTED"}
            </div>
          </>
        )}
      </div>

      {/* Floating app icons when connected */}
      {isConnected && activeApps.map((app, i) => {
        const angles = [320, 50, 140, 230];
        const angle = (angles[i % 4] * Math.PI) / 180;
        const r = 112;
        return (
          <div key={app.name} style={{
            position: "absolute", width: 36, height: 36,
            borderRadius: 10, background: app.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14, fontWeight: 900,
            top: "50%", left: "50%",
            transform: `translate(calc(-50% + ${Math.cos(angle) * r}px), calc(-50% + ${Math.sin(angle) * r}px))`,
            animation: `unlockPop 0.5s ease ${i * 0.12}s both, floatY 3.5s ease-in-out ${i * 0.5}s infinite`,
            boxShadow: `0 4px 18px ${app.color}70`,
          }}>{app.icon}</div>
        );
      })}

      {/* Ping bubbles while scanning */}
      {isScanning && scanResults.slice(-5).map((c, i) => {
        const angle = (i * 72 + 15) * Math.PI / 180;
        const r = 100 + (i % 2) * 20;
        return (
          <div key={c.code + i} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(calc(-50% + ${Math.cos(angle) * r}px), calc(-50% + ${Math.sin(angle) * r}px))`,
            animation: "unlockPop 0.3s ease both",
            background: getPingColor(c.ping) + "18",
            border: `1px solid ${getPingColor(c.ping)}60`,
            borderRadius: 8, padding: "3px 7px",
            fontSize: 9, color: getPingColor(c.ping),
            whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace",
          }}>{c.flag} {c.ping}ms</div>
        );
      })}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function VPNApp() {
  const [appStage, setAppStage]         = useState("onboarding");
  const [permNotifGranted, setPermNotif] = useState(false);
  const [profileInstalled, setProfile]  = useState(false);
  const [permVPNgranted, setPermVPN]    = useState(false);

  const [phase, setPhase]               = useState("idle");
  const [selectedCountry, setSel]       = useState(null);
  const [autoMode, setAutoMode]         = useState(true);
  const [manualCountry, setManual]      = useState(countries[0]);
  const [tunnelMode, setTunnelMode]     = useState("full");
  const [splitEnabled, setSplit]        = useState({ Facebook:true, Messenger:true, Instagram:true, WhatsApp:true });

  const [tab, setTab]                   = useState("home");
  const [filter, setFilter]             = useState("All");
  const [search, setSearch]             = useState("");
  const [dataUp, setDataUp]             = useState("0.0");
  const [dataDown, setDataDown]         = useState("0.0");
  const [timer, setTimer]               = useState(0);
  const [showBadge, setShowBadge]       = useState(false);
  const [scanResults, setScanResults]   = useState([]);
  const [scanLog, setScanLog]           = useState([]);
  const [dialog, setDialog]             = useState(null);

  const intervalRef = useRef(null);
  const scanRef     = useRef(null);

  const isIdle       = phase === "idle";
  const isScanning   = phase === "scanning";
  const isConnecting = phase === "connecting";
  const isConnected  = phase === "connected";

  const activeApps = tunnelMode === "full"
    ? metaApps
    : metaApps.filter(a => splitEnabled[a.name]);

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setTimer(t => t + 1);
        setDataUp(d => (parseFloat(d) + Math.random() * 0.25).toFixed(1));
        setDataDown(d => (parseFloat(d) + (tunnelMode === "full" ? Math.random() * 1.8 : Math.random() * 0.8)).toFixed(1));
      }, 1000);
      setTimeout(() => setShowBadge(true), 600);
    } else {
      clearInterval(intervalRef.current);
      setTimer(0); setDataUp("0.0"); setDataDown("0.0"); setShowBadge(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isConnected, tunnelMode]);

  // ── Real notification permission request ─────────────────────────────────────
  const requestRealNotifPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      // Browser doesn't support notifications — just mark granted for UI
      setPermNotif(true);
      setDialog(null);
      return;
    }
    if (Notification.permission === "granted") {
      setPermNotif(true);
      setDialog(null);
      return;
    }
    if (Notification.permission === "denied") {
      alert("Notifications are blocked. Please enable them in your browser/device settings.");
      setDialog(null);
      return;
    }
    // Actually request from browser/OS — this shows the real iOS/browser prompt
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setPermNotif(true);
      // Send a test notification
      new Notification("MetaBypass VPN", {
        body: "Notifications enabled! You'll be alerted on connection changes.",
        icon: window.location.origin + "/metabypass-vpn/master-icon.png",
      });
    }
    setDialog(null);
  }, []);

  // ── Onboarding done ──────────────────────────────────────────────────────────
  const finishOnboarding = () => {
    setAppStage("ready");
    setTimeout(() => setDialog("notif"), 500);
  };

  // ── Permission handlers ───────────────────────────────────────────────────────
  const handleNotifRequest = () => {
    requestRealNotifPermission();
  };

  const handleVPNAllow = () => {
    setPermVPN(true);
    setDialog(null);
    setTimeout(() => setDialog("profile"), 400);
  };

  const handleProfileInstall = () => {
    setProfile(true);
    setDialog(null);
  };

  // ── Connect ───────────────────────────────────────────────────────────────────
  const handleConnect = () => {
    if (isConnected) {
      clearInterval(scanRef.current);
      setPhase("idle"); setSel(null); setScanResults([]); setScanLog([]);
      return;
    }
    autoMode ? runAutoScan() : connectManual();
  };

  const connectManual = () => {
    setPhase("connecting");
    setTimeout(() => {
      const c = { ...manualCountry, ping: manualCountry.basePing + rand(-4, 10) };
      setSel(c); setPhase("connected");
      if (permNotifGranted && "Notification" in window && Notification.permission === "granted") {
        new Notification("MetaBypass VPN Connected", {
          body: `Secured via ${c.flag} ${c.name} — ${c.ping}ms`,
          icon: window.location.origin + "/metabypass-vpn/master-icon.png",
        });
      }
    }, 2000);
  };

  const runAutoScan = () => {
    setPhase("scanning"); setScanResults([]); setScanLog([]);
    const shuffled = [...countries].sort(() => Math.random() - 0.5).slice(0, 12);
    const scanned = shuffled.map(c => ({ ...c, ping: c.basePing + rand(-5, 18) }));
    let i = 0;
    scanRef.current = setInterval(() => {
      if (i >= scanned.length) {
        clearInterval(scanRef.current);
        const best = [...scanned].sort((a, b) => a.ping - b.ping)[0];
        setScanLog(prev => [...prev, `✓ Best: ${best.flag} ${best.name} — ${best.ping}ms`]);
        setTimeout(() => {
          setPhase("connecting");
          setTimeout(() => {
            setSel(best); setPhase("connected");
            if (permNotifGranted && "Notification" in window && Notification.permission === "granted") {
              new Notification("MetaBypass VPN Connected", {
                body: `Best server: ${best.flag} ${best.name} — ${best.ping}ms`,
                icon: window.location.origin + "/metabypass-vpn/master-icon.png",
              });
            }
          }, 1800);
        }, 600);
        return;
      }
      const c = scanned[i];
      setScanResults(prev => [...prev, c]);
      setScanLog(prev => [...prev.slice(-5), `${c.flag} ${c.name.padEnd(14)} ${c.ping}ms`]);
      i++;
    }, 200);
  };

  const formatTime = s =>
    `${Math.floor(s / 3600).toString().padStart(2, "0")}:${Math.floor((s % 3600) / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const regions = ["All", "Asia", "Europe", "Americas", "Asia-Pacific"];
  const filtered = countries.filter(c =>
    (filter === "All" || c.region === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Shared section header style ───────────────────────────────────────────────
  const sectionLabel = {
    color: "rgba(255,255,255,0.25)", fontSize: 10,
    letterSpacing: 2.5, fontWeight: 600, marginBottom: 10,
    fontFamily: "'DM Mono', monospace",
  };

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>

      {/* ── ONBOARDING ── */}
      {appStage === "onboarding" && <Onboarding onDone={finishOnboarding} />}

      {/* ── MAIN APP ── */}
      {appStage === "ready" && (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#080c14" }}>

          {/* ── HEADER ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "env(safe-area-inset-top, 12px) 20px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(8,12,20,0.95)", backdropFilter: "blur(20px)",
            flexShrink: 0, zIndex: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={process.env.PUBLIC_URL + "/master-icon.png"} alt="MetaBypass" style={{ width: 32, height: 32, borderRadius: 9, objectFit: "contain" }} />
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MetaBypass VPN</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 2 }}>Myanmar Free Access</div>
              </div>
            </div>
            {/* Status chip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 20,
              background: isConnected ? "rgba(0,232,122,0.12)" : "rgba(255,82,82,0.1)",
              border: `1px solid ${isConnected ? "rgba(0,232,122,0.3)" : "rgba(255,82,82,0.2)"}`,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: isConnected ? "#00e87a" : isScanning || isConnecting ? "#ffc107" : "#ff5252",
                animation: isScanning || isConnecting ? "blink 0.6s infinite" : "none",
              }} />
              <span style={{
                fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace",
                color: isConnected ? "#00e87a" : isScanning || isConnecting ? "#ffc107" : "#ff5252",
              }}>
                {isConnected ? "SECURED" : isScanning ? "SCANNING" : isConnecting ? "CONNECTING" : "OFF"}
              </span>
            </div>
          </div>

          {/* ── CONTENT AREA ── */}
          <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>

            {/* ═══ HOME TAB ═══ */}
            {tab === "home" && (
              <div style={{ padding: "20px 20px 100px", animation: "fadeUp 0.3s ease" }}>

                {/* Globe section */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Globe phase={phase} scanResults={scanResults} activeApps={activeApps} />
                  </div>

                  {/* Timer */}
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 28, letterSpacing: 6,
                    color: isConnected ? "#fff" : "rgba(255,255,255,0.1)",
                    transition: "color 0.5s", marginTop: -8,
                  }}>{formatTime(timer)}</div>

                  {/* Connected server info */}
                  {isConnected && (
                    <div style={{ marginTop: 12, textAlign: "center", animation: "fadeUp 0.4s ease" }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{selectedCountry?.flag}</div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{selectedCountry?.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
                        <span style={{ color: getPingColor(selectedCountry?.ping || 0) }}>{selectedCountry?.ping}ms</span>
                        {" · "}{getPingLabel(selectedCountry?.ping || 0)}{" · WireGuard"}
                        {autoMode && <span style={{ color: "#00e87a", marginLeft: 6 }}>AUTO BEST</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan log */}
                {(isScanning || isConnecting) && (
                  <div style={{
                    padding: "12px 16px", marginBottom: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(100,181,246,0.15)",
                    borderRadius: 14, animation: "fadeUp 0.3s ease",
                  }}>
                    <div style={{ color: "#64b5f6", fontSize: 9, letterSpacing: 2, marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
                      {isScanning ? "SCANNING SERVERS..." : "ESTABLISHING TUNNEL..."}
                    </div>
                    {scanLog.map((line, i) => (
                      <div key={i} style={{
                        fontSize: 11, marginBottom: 3,
                        color: line.startsWith("✓") ? "#00e87a" : "rgba(255,255,255,0.4)",
                        fontWeight: line.startsWith("✓") ? 600 : 400,
                        fontFamily: "'DM Mono', monospace",
                      }}>{line}</div>
                    ))}
                    {isScanning && <div style={{ color: "rgba(100,181,246,0.5)", animation: "blink 0.6s infinite", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>▍</div>}
                  </div>
                )}

                {/* Stats when connected */}
                {isConnected && (
                  <div style={{ display: "flex", gap: 10, marginBottom: 16, animation: "slideUp 0.4s ease" }}>
                    {[
                      { label: "DOWNLOAD", value: `${dataDown} MB`, color: "#1877F2" },
                      { label: "UPLOAD",   value: `${dataUp} MB`,   color: "#00B2FF" },
                      { label: "PING",     value: `${selectedCountry?.ping}ms`, color: getPingColor(selectedCountry?.ping || 0) },
                    ].map(s => (
                      <div key={s.label} style={{
                        flex: 1, textAlign: "center",
                        padding: "12px 4px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 12,
                      }}>
                        <div style={{ color: s.color, fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
                        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 9, letterSpacing: 1.5, marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto / Manual toggle (idle only) */}
                {isIdle && (
                  <div style={{
                    display: "flex", background: "rgba(255,255,255,0.04)",
                    borderRadius: 12, padding: 3,
                    border: "1px solid rgba(255,255,255,0.06)",
                    marginBottom: 12,
                  }}>
                    {[{ val: true, label: "⚡ Auto Best" }, { val: false, label: "📍 Manual" }].map(opt => (
                      <button key={String(opt.val)} onClick={() => setAutoMode(opt.val)} style={{
                        flex: 1, padding: "10px",
                        borderRadius: 10, border: "none",
                        background: autoMode === opt.val ? "rgba(24,119,242,0.25)" : "transparent",
                        color: autoMode === opt.val ? "#4da3ff" : "rgba(255,255,255,0.28)",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                )}

                {/* Manual server selector */}
                {isIdle && !autoMode && (
                  <div onClick={() => setTab("servers")} style={{
                    padding: "14px 16px", marginBottom: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14, display: "flex",
                    alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 26 }}>{manualCountry.flag}</span>
                      <div>
                        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                          <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{manualCountry.name}</span>
                          {manualCountry.metaOptimized && (
                            <span style={{ background: "#1877F215", border: "1px solid #1877F225", borderRadius: 5, padding: "1px 6px", fontSize: 9, color: "#4da3ff" }}>META ✓</span>
                          )}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
                          <span style={{ color: getPingColor(manualCountry.basePing) }}>{manualCountry.basePing}ms</span> · {getPingLabel(manualCountry.basePing)}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>›</span>
                  </div>
                )}

                {/* Connect button */}
                <button
                  onClick={handleConnect}
                  disabled={isScanning || isConnecting}
                  className="btn-connect"
                  style={{
                    width: "100%", padding: "17px",
                    borderRadius: 16, border: "none",
                    background: isConnected
                      ? "linear-gradient(135deg,#ff4444,#c0392b)"
                      : isScanning || isConnecting
                        ? "linear-gradient(135deg,#ffc107,#ff7000)"
                        : "linear-gradient(135deg,#1877F2,#00B2FF)",
                    color: "#fff", fontSize: 16, fontWeight: 700,
                    letterSpacing: 1, cursor: isScanning || isConnecting ? "not-allowed" : "pointer",
                    opacity: isScanning || isConnecting ? 0.8 : 1,
                    boxShadow: isConnected
                      ? "0 8px 28px rgba(255,68,68,0.35)"
                      : "0 8px 32px rgba(24,119,242,0.45)",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 16,
                    animation: isConnected ? "glowPulse 2.5s ease infinite" : "none",
                  }}
                >
                  {isConnected ? "Disconnect" : isScanning ? "Scanning..." : isConnecting ? "Connecting..." : "Connect"}
                </button>

                {/* Meta app status cards */}
                {!isScanning && !isConnecting && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
                    {metaApps.map((app, idx) => {
                      const active = isConnected && (tunnelMode === "full" || splitEnabled[app.name]);
                      return (
                        <div key={app.name} style={{
                          background: active ? `${app.color}14` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? app.color + "30" : "rgba(255,255,255,0.06)"}`,
                          borderRadius: 14, padding: "12px 6px",
                          textAlign: "center", transition: "all 0.4s",
                          animation: active && showBadge ? `unlockPop 0.4s ease ${idx * 0.1}s both` : "none",
                        }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 9,
                            margin: "0 auto",
                            background: active ? app.color : "rgba(255,255,255,0.05)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: active ? "#fff" : "rgba(255,255,255,0.1)",
                            fontSize: 13, fontWeight: 900, transition: "all 0.4s",
                            boxShadow: active ? `0 4px 14px ${app.color}55` : "none",
                          }}>{app.icon}</div>
                          <div style={{ fontSize: 9, color: active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)", marginTop: 6, fontWeight: 600 }}>{app.name}</div>
                          <div style={{ fontSize: 8, marginTop: 3, fontFamily: "'DM Mono', monospace", color: active ? "#00e87a" : "#ff5252" }}>
                            {active ? "FREE" : isConnected && tunnelMode === "split" && !splitEnabled[app.name] ? "SKIP" : "BLOCKED"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Info box */}
                {isIdle && (
                  <div style={{
                    padding: "13px 15px",
                    background: "rgba(24,119,242,0.05)",
                    border: "1px solid rgba(24,119,242,0.1)",
                    borderRadius: 13, display: "flex", gap: 10,
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>🇲🇲</span>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 1.7 }}>
                      Facebook, Messenger, Instagram & WhatsApp are restricted in Myanmar. Connect to bypass all restrictions.
                    </div>
                  </div>
                )}

                <div style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.12)", fontSize: 11 }}>
                  Developed by Min Thu Kyaw Khaung (Markus)
                </div>
              </div>
            )}

            {/* ═══ SERVERS TAB ═══ */}
            {tab === "servers" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setTab("home")} style={{ background: "none", border: "none", color: "#4da3ff", fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1 }}>←</button>
                  <h2 style={{ color: "#fff", fontSize: 19, fontWeight: 700 }}>Select Server</h2>
                </div>

                {/* Auto option */}
                <div onClick={() => { setAutoMode(true); setTab("home"); }} style={{
                  margin: "16px 20px 0",
                  padding: "14px 16px",
                  background: autoMode ? "rgba(24,119,242,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${autoMode ? "rgba(24,119,242,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: "linear-gradient(135deg,#1877F2,#00B2FF)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>⚡</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Auto Best Server</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 3 }}>Scans worldwide · picks lowest ping</div>
                  </div>
                  {autoMode && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1877F2", boxShadow: "0 0 10px #1877F2" }} />}
                </div>

                <div style={{ padding: "20px 20px 0" }}>
                  <div style={sectionLabel}>★ META-OPTIMIZED</div>
                  {countries.filter(c => c.metaOptimized).map((c, i) => (
                    <div key={c.code} onClick={() => { setManual(c); setAutoMode(false); setTab("home"); }} style={{
                      padding: "12px 14px", marginBottom: 8,
                      background: !autoMode && manualCountry.code === c.code ? "rgba(24,119,242,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${!autoMode && manualCountry.code === c.code ? "rgba(24,119,242,0.4)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 13, display: "flex", alignItems: "center", gap: 12,
                      cursor: "pointer", animation: `slideUp 0.25s ease ${i * 0.04}s both`,
                    }}>
                      <span style={{ fontSize: 22 }}>{c.flag}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                          <span style={{ color: !autoMode && manualCountry.code === c.code ? "#4da3ff" : "#fff", fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                          <span style={{ background: "#1877F215", border: "1px solid #1877F225", borderRadius: 4, padding: "1px 5px", fontSize: 9, color: "#4da3ff" }}>FB</span>
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, marginTop: 2 }}>{c.region}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: getPingColor(c.basePing), fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>~{c.basePing}ms</div>
                        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, marginTop: 2 }}>{getPingLabel(c.basePing)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "4px 20px 100px" }}>
                  <div style={sectionLabel}>ALL SERVERS</div>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search country..."
                    style={{
                      width: "100%", padding: "12px 16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12, color: "#fff",
                      fontSize: 13, marginBottom: 10,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                  <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, paddingBottom: 4 }}>
                    {regions.map(r => (
                      <button key={r} onClick={() => setFilter(r)} style={{
                        padding: "6px 12px", borderRadius: 20,
                        border: `1px solid ${filter === r ? "rgba(24,119,242,0.5)" : "rgba(255,255,255,0.07)"}`,
                        background: filter === r ? "rgba(24,119,242,0.15)" : "transparent",
                        color: filter === r ? "#4da3ff" : "rgba(255,255,255,0.3)",
                        fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>{r}</button>
                    ))}
                  </div>
                  {filtered.map(c => (
                    <div key={c.code} onClick={() => { setManual(c); setAutoMode(false); setTab("home"); }} style={{
                      padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                      display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                    }}>
                      <span style={{ fontSize: 20 }}>{c.flag}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                          <span style={{ color: !autoMode && manualCountry.code === c.code ? "#4da3ff" : "#fff", fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                          {c.metaOptimized && <span style={{ background: "#1877F212", border: "1px solid #1877F220", borderRadius: 4, padding: "1px 5px", fontSize: 9, color: "#4da3ff" }}>META</span>}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, marginTop: 1 }}>{c.region}</div>
                      </div>
                      <div style={{ color: getPingColor(c.basePing), fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>~{c.basePing}ms</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ APPS TAB ═══ */}
            {tab === "apps" && (
              <div style={{ padding: "20px 20px 100px", animation: "fadeUp 0.3s ease" }}>
                <h2 style={{ color: "#fff", fontSize: 19, fontWeight: 700, marginBottom: 4 }}>App Control</h2>
                <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 12, marginBottom: 20 }}>Choose how traffic is routed through the VPN</p>

                <div style={sectionLabel}>TUNNEL MODE</div>

                {/* Full Device */}
                <div onClick={() => setTunnelMode("full")} style={{
                  padding: "16px", marginBottom: 10, cursor: "pointer",
                  background: tunnelMode === "full" ? "rgba(24,119,242,0.1)" : "rgba(255,255,255,0.03)",
                  border: `2px solid ${tunnelMode === "full" ? "#1877F2" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 18, transition: "all 0.25s",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: tunnelMode === "full" ? "linear-gradient(135deg,#1877F2,#0d47a1)" : "rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                    }}>🌐</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ color: tunnelMode === "full" ? "#4da3ff" : "#fff", fontWeight: 700, fontSize: 14 }}>Full Device</span>
                        <span style={{
                          background: tunnelMode === "full" ? "#1877F2" : "transparent",
                          border: `1px solid ${tunnelMode === "full" ? "#1877F2" : "rgba(255,255,255,0.15)"}`,
                          borderRadius: 20, padding: "2px 8px", fontSize: 9,
                          color: tunnelMode === "full" ? "#fff" : "rgba(255,255,255,0.3)", fontWeight: 700,
                        }}>DEFAULT</span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.7 }}>
                        Routes <strong style={{ color: "rgba(255,255,255,0.7)" }}>all traffic</strong> — every app, browser, service — through VPN. Meta apps work automatically.
                      </p>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                      border: `2px solid ${tunnelMode === "full" ? "#1877F2" : "rgba(255,255,255,0.2)"}`,
                      background: tunnelMode === "full" ? "#1877F2" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {tunnelMode === "full" && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </div>
                </div>

                {/* Split tunnel */}
                <div onClick={() => setTunnelMode("split")} style={{
                  padding: "16px", cursor: "pointer",
                  background: tunnelMode === "split" ? "rgba(0,178,255,0.08)" : "rgba(255,255,255,0.03)",
                  border: `2px solid ${tunnelMode === "split" ? "#00B2FF" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 18, transition: "all 0.25s", marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: tunnelMode === "split" ? "linear-gradient(135deg,#00B2FF,#0077aa)" : "rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                    }}>▦</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: tunnelMode === "split" ? "#7dd8ff" : "#fff", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Meta Apps Only</div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.7 }}>
                        Split tunneling — only selected Meta apps use VPN. Other apps stay on normal internet.
                      </p>
                      {tunnelMode === "split" && (
                        <div style={{ marginTop: 14 }}>
                          {metaApps.map(app => (
                            <div key={app.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: 10,
                                background: splitEnabled[app.name] ? app.color : "rgba(255,255,255,0.06)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 14, fontWeight: 900, transition: "all 0.3s",
                              }}>{app.icon}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{app.name}</div>
                                <div style={{ fontSize: 10, color: splitEnabled[app.name] ? "#00e87a" : "#ff5252", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
                                  {splitEnabled[app.name] ? "✓ TUNNELED" : "✗ BLOCKED"}
                                </div>
                              </div>
                              <div onClick={e => { e.stopPropagation(); setSplit(s => ({ ...s, [app.name]: !s[app.name] })); }} style={{
                                width: 46, height: 26, borderRadius: 13,
                                background: splitEnabled[app.name] ? app.color : "rgba(255,255,255,0.1)",
                                position: "relative", cursor: "pointer", transition: "background 0.3s", flexShrink: 0,
                              }}>
                                <div style={{
                                  width: 20, height: 20, borderRadius: "50%", background: "#fff",
                                  position: "absolute", top: 3,
                                  left: splitEnabled[app.name] ? 23 : 3,
                                  transition: "left 0.25s",
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                                }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                      border: `2px solid ${tunnelMode === "split" ? "#00B2FF" : "rgba(255,255,255,0.2)"}`,
                      background: tunnelMode === "split" ? "#00B2FF" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {tunnelMode === "split" && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </div>
                </div>

                {/* Security config */}
                <div style={sectionLabel}>SECURITY CONFIG</div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
                  {[
                    ["Protocol", "WireGuard"],
                    ["Encryption", "ChaCha20-Poly1305"],
                    ["DNS", "Custom DoH"],
                    ["Leak Protection", "Enabled ✓"],
                    ["Kill Switch", "Enabled ✓"],
                    ["No-Log Policy", "Strict ✓"],
                  ].map(([l, v], i, arr) => (
                    <div key={l} style={{
                      display: "flex", justifyContent: "space-between", padding: "12px 16px",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{l}</span>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Permissions */}
                <div style={sectionLabel}>PERMISSIONS</div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
                  {[
                    { label: "Notifications", granted: permNotifGranted, onRequest: () => { setDialog("notif"); } },
                    { label: "VPN Config (manual setup)", granted: permVPNgranted, onRequest: () => setDialog("vpn") },
                    { label: "Config Profile", granted: profileInstalled, onRequest: () => setDialog("profile") },
                  ].map((p, i, arr) => (
                    <div key={p.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 16px",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{p.label}</span>
                      {p.granted
                        ? <span style={{ color: "#00e87a", fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>✓ GRANTED</span>
                        : <button onClick={p.onRequest} style={{
                          background: "rgba(255,180,0,0.12)", border: "1px solid rgba(255,180,0,0.3)",
                          borderRadius: 8, padding: "5px 12px",
                          color: "#ffc107", fontSize: 11, fontWeight: 700,
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        }}>Allow →</button>
                      }
                    </div>
                  ))}
                </div>

                <div style={{ padding: "12px 15px", background: "rgba(255,152,0,0.06)", border: "1px solid rgba(255,152,0,0.15)", borderRadius: 13 }}>
                  <div style={{ color: "#ffa726", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>ℹ️ ABOUT VPN PERMISSIONS</div>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 1.7 }}>
                    Real VPN tunneling requires a native iOS app with NetworkExtension. This PWA simulates the UI and requests real notifications. To actually bypass restrictions, install the native MetaBypass app or configure WireGuard manually.
                  </p>
                </div>

                <div style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.12)", fontSize: 11 }}>
                  MetaBypass VPN · by Min Thu Kyaw Khaung (Markus)
                </div>
              </div>
            )}
          </div>

          {/* ── BOTTOM NAV ── */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            height: "calc(64px + env(safe-area-inset-bottom, 0px))",
            background: "rgba(8,12,20,0.97)", backdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "flex-start", paddingTop: 8,
            zIndex: 100,
          }}>
            {[
              { id: "home", icon: "◉", label: "HOME" },
              { id: "servers", icon: "⊕", label: "SERVERS" },
              { id: "apps", icon: "▦", label: "APPS" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, background: "none", border: "none",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4, padding: "4px 0",
              }}>
                <div style={{
                  fontSize: 22,
                  color: tab === t.id ? "#1877F2" : "rgba(255,255,255,0.18)",
                  transition: "color 0.2s",
                }}>{t.icon}</div>
                <div style={{
                  fontSize: 9, letterSpacing: 1.5,
                  color: tab === t.id ? "#4da3ff" : "rgba(255,255,255,0.15)",
                  fontFamily: "'DM Mono', monospace", fontWeight: 500,
                }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── DIALOGS (shown over app) ── */}
      {dialog === "notif" && (
        <AlertBox
          icon="🔔" iconBg="rgba(255,180,0,0.15)"
          title='"MetaBypass VPN" Would Like to Send Notifications'
          body="You'll receive alerts when VPN connects, disconnects, or changes server. This requests your real device notification permission."
          actions={[
            { label: "Don't Allow", onPress: () => setDialog(null) },
            { label: "Allow", primary: true, onPress: handleNotifRequest },
          ]}
        />
      )}
      {dialog === "vpn" && (
        <AlertBox
          icon="🔒" iconBg="rgba(24,119,242,0.15)"
          title="VPN Configuration"
          body="Real VPN tunneling requires a native iOS app. To manually set up WireGuard: go to iOS Settings → VPN → Add Configuration. This marks VPN as configured in the app UI."
          actions={[
            { label: "Cancel", onPress: () => setDialog(null) },
            { label: "Mark Set Up", primary: true, onPress: handleVPNAllow },
          ]}
        />
      )}
      {dialog === "profile" && (
        <ProfileSheet onInstall={handleProfileInstall} onCancel={() => setDialog(null)} />
      )}
    </>
  );
}