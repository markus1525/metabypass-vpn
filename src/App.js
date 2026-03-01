import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const countries = [
  { name: "Singapore",    code: "SG", flag: "🇸🇬", basePing: 12,  region: "Asia",         metaOptimized: true  },
  { name: "Thailand",     code: "TH", flag: "🇹🇭", basePing: 18,  region: "Asia",         metaOptimized: true  },
  { name: "Malaysia",     code: "MY", flag: "🇲🇾", basePing: 22,  region: "Asia",         metaOptimized: true  },
  { name: "Vietnam",      code: "VN", flag: "🇻🇳", basePing: 28,  region: "Asia",         metaOptimized: true  },
  { name: "Indonesia",    code: "ID", flag: "🇮🇩", basePing: 35,  region: "Asia",         metaOptimized: true  },
  { name: "Hong Kong",    code: "HK", flag: "🇭🇰", basePing: 38,  region: "Asia",         metaOptimized: true  },
  { name: "Philippines",  code: "PH", flag: "🇵🇭", basePing: 42,  region: "Asia",         metaOptimized: true  },
  { name: "Japan",        code: "JP", flag: "🇯🇵", basePing: 45,  region: "Asia",         metaOptimized: true  },
  { name: "South Korea",  code: "KR", flag: "🇰🇷", basePing: 52,  region: "Asia",         metaOptimized: false },
  { name: "Taiwan",       code: "TW", flag: "🇹🇼", basePing: 55,  region: "Asia",         metaOptimized: true  },
  { name: "India",        code: "IN", flag: "🇮🇳", basePing: 60,  region: "Asia",         metaOptimized: false },
  { name: "Australia",    code: "AU", flag: "🇦🇺", basePing: 90,  region: "Asia-Pacific",  metaOptimized: false },
  { name: "Canada",       code: "CA", flag: "🇨🇦", basePing: 195, region: "Americas",     metaOptimized: false },
  { name: "United States",code: "US", flag: "🇺🇸", basePing: 180, region: "Americas",     metaOptimized: true  },
  { name: "United Kingdom",code:"GB", flag: "🇬🇧", basePing: 210, region: "Europe",       metaOptimized: false },
  { name: "Netherlands",  code: "NL", flag: "🇳🇱", basePing: 218, region: "Europe",       metaOptimized: false },
  { name: "France",       code: "FR", flag: "🇫🇷", basePing: 220, region: "Europe",       metaOptimized: false },
  { name: "Germany",      code: "DE", flag: "🇩🇪", basePing: 225, region: "Europe",       metaOptimized: false },
  { name: "Sweden",       code: "SE", flag: "🇸🇪", basePing: 230, region: "Europe",       metaOptimized: false },
  { name: "Switzerland",  code: "CH", flag: "🇨🇭", basePing: 235, region: "Europe",       metaOptimized: false },
];

const metaApps = [
  { name: "Facebook",  icon: "f", color: "#1877F2" },
  { name: "Messenger", icon: "✉", color: "#00B2FF" },
  { name: "Instagram", icon: "▣", color: "#E1306C" },
  { name: "WhatsApp",  icon: "w", color: "#25D366" },
];

const getPingColor = (p) => p < 40 ? "#00ff88" : p < 100 ? "#ffcc00" : "#ff6b6b";
const getPingLabel = (p) => p < 40 ? "Excellent" : p < 100 ? "Good" : "Fair";
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// ─── Shared Styles ───────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:0.6}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeInFast{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
  @keyframes unlockPop{0%{transform:scale(0.5);opacity:0}65%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes radar{0%{transform:translate(-50%,-50%) scale(0.3);opacity:0.9}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:1}}
  @keyframes glow{0%,100%{box-shadow:0 8px 28px rgba(24,119,242,0.45)}50%{box-shadow:0 8px 40px rgba(24,119,242,0.75)}}
  @keyframes overlayIn{from{opacity:0}to{opacity:1}}
  @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes alertPop{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
  @keyframes checkDraw{from{stroke-dashoffset:50}to{stroke-dashoffset:0}}
  @keyframes onboardIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:rgba(24,119,242,0.3);border-radius:3px}
`;

// ─── iOS-style System Dialog ─────────────────────────────────────────────────
const IOSAlert = ({ icon, iconBg, title, body, actions }) => (
  <div style={{ position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",animation:"overlayIn 0.2s ease",backdropFilter:"blur(4px)" }}>
    <div style={{ width:270,background:"rgba(30,30,46,0.98)",borderRadius:14,overflow:"hidden",animation:"alertPop 0.25s cubic-bezier(0.34,1.56,0.64,1)",border:"1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ padding:"22px 20px 16px",textAlign:"center" }}>
        {icon && (
          <div style={{ width:54,height:54,borderRadius:14,background:iconBg||"rgba(24,119,242,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px" }}>{icon}</div>
        )}
        <div style={{ color:"white",fontSize:14,fontWeight:800,fontFamily:"Syne,sans-serif",marginBottom:8,lineHeight:1.35 }}>{title}</div>
        <div style={{ color:"rgba(255,255,255,0.55)",fontSize:11.5,lineHeight:1.7 }}>{body}</div>
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)",display:"flex" }}>
        {actions.map((a, i) => (
          <button key={i} onClick={a.onPress} style={{
            flex:1,padding:"13px 6px",background:"none",border:"none",
            borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
            color: a.primary ? "#5aabff" : a.destructive ? "#ff6b6b" : "rgba(255,255,255,0.45)",
            fontSize:14, fontWeight: a.primary ? 800 : 400,
            fontFamily:"Syne,sans-serif",cursor:"pointer",
          }}>{a.label}</button>
        ))}
      </div>
    </div>
  </div>
);

// ─── iOS Config Profile Sheet ─────────────────────────────────────────────────
const ProfileSheet = ({ onInstall, onCancel }) => (
  <div style={{ position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",animation:"overlayIn 0.2s ease",backdropFilter:"blur(4px)" }}>
    <div style={{ width:"100%",background:"#141528",borderRadius:"22px 22px 0 0",animation:"sheetUp 0.35s cubic-bezier(0.32,0.72,0,1)",border:"1px solid rgba(255,255,255,0.1)",borderBottom:"none",paddingBottom:30 }}>
      {/* Handle */}
      <div style={{ width:36,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0" }} />
      {/* Header */}
      <div style={{ padding:"18px 22px 0",display:"flex",gap:14,alignItems:"center" }}>
        <div style={{ width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#1877F2,#00B2FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:"0 4px 18px rgba(24,119,242,0.5)" }}>🛡️</div>
        <div>
          <div style={{ color:"white",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:15 }}>Install VPN Profile</div>
          <div style={{ color:"rgba(255,255,255,0.4)",fontSize:10.5,marginTop:2 }}>MetaBypass VPN · Configuration Profile</div>
        </div>
      </div>
      {/* Info rows */}
      <div style={{ margin:"16px 22px 0",padding:"4px 0",background:"rgba(255,255,255,0.04)",borderRadius:13,border:"1px solid rgba(255,255,255,0.07)" }}>
        {[
          { label:"Signed by",  value:"Min Thu Kyaw Khaung (Markus)" },
          { label:"Type",       value:"VPN Configuration" },
          { label:"Protocol",   value:"WireGuard / IKEv2" },
          { label:"Contains",   value:"VPN Payload, DNS Settings" },
        ].map(r => (
          <div key={r.label} style={{ display:"flex",justifyContent:"space-between",padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ color:"rgba(255,255,255,0.4)",fontSize:12 }}>{r.label}</span>
            <span style={{ color:"white",fontSize:12,fontWeight:700,maxWidth:180,textAlign:"right" }}>{r.value}</span>
          </div>
        ))}
        <div style={{ padding:"11px 16px" }}>
          <div style={{ color:"rgba(255,255,255,0.4)",fontSize:11,lineHeight:1.7 }}>
            This profile will configure a VPN on your device. All network activity may be filtered or monitored when the VPN is active.
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div style={{ padding:"16px 22px 0",display:"flex",flexDirection:"column",gap:10 }}>
        <button onClick={onInstall} style={{ width:"100%",padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#1877F2,#00B2FF)",color:"white",fontSize:15,fontWeight:800,fontFamily:"Syne,sans-serif",cursor:"pointer",boxShadow:"0 6px 22px rgba(24,119,242,0.4)" }}>
          Install Profile
        </button>
        <button onClick={onCancel} style={{ width:"100%",padding:"13px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)",fontSize:14,fontWeight:600,fontFamily:"Syne,sans-serif",cursor:"pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ─── Onboarding ───────────────────────────────────────────────────────────────
const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      icon:"🇲🇲", iconBg:"rgba(24,119,242,0.1)",
      title:"Welcome to\nMetaBypass VPN",
      sub:"Bypass Myanmar's Facebook & Meta app restrictions with one tap.",
      cta:"Get Started",
    },
    {
      icon:"🌐", iconBg:"rgba(0,200,150,0.12)",
      title:"Full Device\nProtection",
      sub:"Route all your traffic through a secure server — every app, browser, and service stays protected.",
      cta:"Continue",
    },
    {
      icon:"🔍", iconBg:"rgba(255,180,0,0.12)",
      title:"Auto Best\nServer Finder",
      sub:"Our scanner tests random servers worldwide and auto-connects you to the fastest one in real time.",
      cta:"Continue",
    },
    {
      icon:"🔒", iconBg:"rgba(24,119,242,0.1)",
      title:"Private &\nNo-Log",
      sub:"WireGuard encryption. Zero logs. Kill switch enabled. Your activity is never recorded or shared.",
      cta:"Allow Permissions →",
      last:true,
    },
  ];
  const s = steps[step];

  return (
    <div style={{ position:"absolute",inset:0,background:"#090a18",display:"flex",flexDirection:"column",zIndex:100 }}>
      {/* Skip */}
      {step < steps.length - 1 && (
        <button onClick={onDone} style={{ position:"absolute",top:60,right:24,background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:12,fontFamily:"Syne,sans-serif",cursor:"pointer" }}>Skip</button>
      )}
      {/* Progress dots */}
      <div style={{ position:"absolute",top:70,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6 }}>
        {steps.map((_,i) => (
          <div key={i} style={{ width: i===step?18:6,height:6,borderRadius:3,background:i===step?"#1877F2":"rgba(255,255,255,0.15)",transition:"all 0.3s" }} />
        ))}
      </div>
      {/* Content */}
      <div key={step} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 36px",animation:"onboardIn 0.4s ease" }}>
        <div style={{ width:100,height:100,borderRadius:28,background:s.iconBg,border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,marginBottom:32,boxShadow:"0 8px 32px rgba(0,0,0,0.3)" }}>
          {s.icon}
        </div>
        <div style={{ color:"white",fontSize:28,fontWeight:800,fontFamily:"Syne,sans-serif",textAlign:"center",lineHeight:1.25,marginBottom:16,whiteSpace:"pre-line" }}>
          {s.title}
        </div>
        <div style={{ color:"rgba(255,255,255,0.45)",fontSize:14,textAlign:"center",lineHeight:1.8 }}>
          {s.sub}
        </div>
        {s.last && (
          <div style={{ marginTop:28,padding:"12px 16px",background:"rgba(24,119,242,0.07)",border:"1px solid rgba(24,119,242,0.18)",borderRadius:12,width:"100%" }}>
            <div style={{ color:"#5aabff",fontSize:9,letterSpacing:2,fontFamily:"Syne,sans-serif",fontWeight:700,marginBottom:6 }}>REQUIRED PERMISSIONS</div>
            {["VPN Configuration — to create secure tunnel","Notifications — to show connection status"].map(t => (
              <div key={t} style={{ display:"flex",gap:8,alignItems:"flex-start",marginBottom:5 }}>
                <span style={{ color:"#00d28c",fontSize:11,flexShrink:0 }}>✓</span>
                <span style={{ color:"rgba(255,255,255,0.45)",fontSize:11,lineHeight:1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* CTA */}
      <div style={{ padding:"0 36px 50px" }}>
        <button onClick={() => step < steps.length-1 ? setStep(s=>s+1) : onDone()} style={{
          width:"100%",padding:"16px",borderRadius:16,border:"none",
          background:"linear-gradient(135deg,#1877F2,#00B2FF)",
          color:"white",fontSize:15,fontWeight:800,fontFamily:"Syne,sans-serif",
          cursor:"pointer",boxShadow:"0 8px 28px rgba(24,119,242,0.45)",
        }}>{s.cta}</button>
        <div style={{ textAlign:"center",marginTop:12,color:"rgba(255,255,255,0.18)",fontSize:9,fontFamily:"Syne,sans-serif" }}>
          by Min Thu Kyaw Khaung (Markus)
        </div>
      </div>
    </div>
  );
};

// ─── Globe Visual ─────────────────────────────────────────────────────────────
const Globe = ({ phase, selectedCountry, scanResults, activeApps }) => {
  const isConnected = phase === "connected";
  const isScanning  = phase === "scanning";
  const isConnecting= phase === "connecting";
  return (
    <div style={{ display:"flex",justifyContent:"center",marginTop:12,position:"relative",height:210 }}>
      {isScanning && [0,1,2].map(i=>(
        <div key={i} style={{ position:"absolute",top:"50%",left:"50%",width:160,height:160,borderRadius:"50%",border:"1.5px solid rgba(100,181,246,0.5)",animation:`radar 1.8s ease-out ${i*0.6}s infinite` }} />
      ))}
      {isConnected && [0,1,2].map(i=>(
        <div key={i} style={{ position:"absolute",width:158+i*46,height:158+i*46,borderRadius:"50%",border:`1px solid rgba(24,119,242,${0.18-i*0.05})`,top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:`pulse ${2.2+i*0.5}s ease-in-out ${i*0.3}s infinite` }} />
      ))}
      <div style={{
        width:154,height:154,borderRadius:"50%",
        background: isConnected?"radial-gradient(circle at 32% 30%,#64b5f6,#1877F2,#0d47a1)"
          :isScanning?"radial-gradient(circle at 32% 30%,#1e3a5f,#0d2040,#060e1a)"
          :"radial-gradient(circle at 32% 30%,#252535,#191927,#0d0d1a)",
        boxShadow: isConnected?"0 0 55px rgba(24,119,242,0.55),0 0 100px rgba(24,119,242,0.15),inset 0 0 40px rgba(255,255,255,0.08)"
          :isScanning?"0 0 40px rgba(100,181,246,0.3)"
          :"0 0 30px rgba(0,0,0,0.5),inset 0 0 20px rgba(255,255,255,0.02)",
        display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
        position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        transition:"all 0.6s ease",overflow:"hidden",
      }}>
        <svg width="154" height="154" style={{ position:"absolute",opacity:isConnected?0.22:isScanning?0.12:0.07 }}>
          <ellipse cx="77" cy="77" rx="76" ry="33" fill="none" stroke="white" strokeWidth="0.7"/>
          <ellipse cx="77" cy="77" rx="76" ry="59" fill="none" stroke="white" strokeWidth="0.7"/>
          <line x1="77" y1="1" x2="77" y2="153" stroke="white" strokeWidth="0.7"/>
          <line x1="1" y1="77" x2="153" y2="77" stroke="white" strokeWidth="0.7"/>
        </svg>
        {isScanning  ? <><div style={{ fontSize:26,position:"relative",zIndex:1,animation:"spin 2s linear infinite" }}>🔍</div><div style={{ fontSize:7.5,color:"rgba(100,181,246,0.8)",letterSpacing:1.5,marginTop:5,position:"relative",zIndex:1,animation:"shimmer 1s ease infinite" }}>SCANNING</div></>
        :isConnecting? <><div style={{ fontSize:26,position:"relative",zIndex:1,animation:"pulse 0.8s ease infinite" }}>⚡</div><div style={{ fontSize:7.5,color:"rgba(255,180,0,0.8)",letterSpacing:1.5,marginTop:5,position:"relative",zIndex:1 }}>TUNNELING</div></>
        :<><div style={{ fontSize:28,position:"relative",zIndex:1 }}>{isConnected?(activeApps.length===4?"🌐":"🔓"):"🔒"}</div>
          <div style={{ fontSize:7.5,color:isConnected?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.18)",letterSpacing:2,marginTop:4,position:"relative",zIndex:1 }}>{isConnected?(activeApps.length===4?"FULL DEVICE":"BYPASSED"):"BLOCKED"}</div></>}
      </div>
      {isConnected && activeApps.map((app,i)=>{
        const angles=[330,52,140,228];
        const angle=(angles[i%4]*Math.PI)/180;
        const r=102;
        return (
          <div key={app.name} style={{ position:"absolute",width:33,height:33,borderRadius:10,background:app.color,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:900,top:"50%",left:"50%",transform:`translate(calc(-50% + ${Math.cos(angle)*r}px),calc(-50% + ${Math.sin(angle)*r}px))`,animation:`unlockPop 0.5s ease ${i*0.12}s both, float 3s ease-in-out ${i*0.5}s infinite`,boxShadow:`0 4px 16px ${app.color}60` }}>{app.icon}</div>
        );
      })}
      {isScanning && scanResults.slice(-6).map((c,i)=>{
        const angle=(i*62+20)*Math.PI/180;
        const r=85+(i%3)*18;
        return (
          <div key={c.code+i} style={{ position:"absolute",top:"50%",left:"50%",transform:`translate(calc(-50% + ${Math.cos(angle)*r}px),calc(-50% + ${Math.sin(angle)*r}px))`,animation:"unlockPop 0.3s ease both",background:getPingColor(c.ping)+"22",border:`1px solid ${getPingColor(c.ping)}55`,borderRadius:8,padding:"2px 6px",fontSize:8,color:getPingColor(c.ping),whiteSpace:"nowrap" }}>{c.flag} {c.ping}ms</div>
        );
      })}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function VPNApp() {
  // Setup state
  const [appStage, setAppStage]         = useState("onboarding"); // onboarding | permVPN | permNotif | permProfile | ready
  const [permVPNgranted, setPermVPN]    = useState(false);
  const [permNotifGranted, setPermNotif]= useState(false);
  const [profileInstalled, setProfile]  = useState(false);

  // VPN state
  const [phase, setPhase]               = useState("idle"); // idle|scanning|connecting|connected
  const [selectedCountry, setSel]       = useState(null);
  const [autoMode, setAutoMode]         = useState(true);
  const [manualCountry, setManual]      = useState(countries[0]);
  const [tunnelMode, setTunnelMode]     = useState("full");
  const [splitEnabled, setSplit]        = useState({ Facebook:true,Messenger:true,Instagram:true,WhatsApp:true });

  // UI state
  const [tab, setTab]                   = useState("home");
  const [filter, setFilter]             = useState("All");
  const [search, setSearch]             = useState("");
  const [dataUp, setDataUp]             = useState("0.0");
  const [dataDown, setDataDown]         = useState("0.0");
  const [timer, setTimer]               = useState(0);
  const [showMetaBadge, setMetaBadge]   = useState(false);
  const [scanResults, setScanResults]   = useState([]);
  const [scanLog, setScanLog]           = useState([]);

  // Permission dialogs (shown on top of ready UI)
  const [dialog, setDialog]             = useState(null); // null | "vpn" | "notif" | "profile"

  const intervalRef = useRef(null);
  const scanRef     = useRef(null);

  const isIdle       = phase === "idle";
  const isScanning   = phase === "scanning";
  const isConnecting = phase === "connecting";
  const isConnected  = phase === "connected";

  const activeApps = tunnelMode === "full"
    ? metaApps
    : metaApps.filter(a => splitEnabled[a.name]);

  // Session timer
  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setTimer(t=>t+1);
        setDataUp(d=>(parseFloat(d)+Math.random()*0.25).toFixed(1));
        setDataDown(d=>(parseFloat(d)+(tunnelMode==="full"?Math.random()*1.8:Math.random()*0.8)).toFixed(1));
      },1000);
      setTimeout(()=>setMetaBadge(true),600);
    } else {
      clearInterval(intervalRef.current);
      setTimer(0); setDataUp("0.0"); setDataDown("0.0"); setMetaBadge(false);
    }
    return ()=>clearInterval(intervalRef.current);
  },[isConnected,tunnelMode]);

  // ── Onboarding complete → ask VPN perm ─────────────────────────────────────
  const finishOnboarding = () => {
    setAppStage("ready");
    setTimeout(()=>setDialog("vpn"),400);
  };

  // ── Permission handlers ─────────────────────────────────────────────────────
  const handleVPNAllow = () => {
    setPermVPN(true);
    setDialog(null);
    setTimeout(()=>setDialog("profile"),400);
  };
  const handleProfileInstall = () => {
    setProfile(true);
    setDialog(null);
    setTimeout(()=>setDialog("notif"),400);
  };
  const handleNotifAllow = () => {
    setPermNotif(true);
    setDialog(null);
  };

  // ── Connect ─────────────────────────────────────────────────────────────────
  const handleConnect = () => {
    if (isConnected) {
      clearInterval(scanRef.current);
      setPhase("idle"); setSel(null); setScanResults([]); setScanLog([]);
      return;
    }
    // If perms not granted, show dialogs first
    if (!permVPNgranted) { setDialog("vpn"); return; }
    if (!profileInstalled) { setDialog("profile"); return; }
    autoMode ? runAutoScan() : connectManual();
  };

  const connectManual = () => {
    setPhase("connecting");
    setTimeout(()=>{
      const c={...manualCountry,ping:manualCountry.basePing+rand(-4,10)};
      setSel(c); setPhase("connected");
    },2000);
  };

  const runAutoScan = () => {
    setPhase("scanning"); setScanResults([]); setScanLog([]);
    const shuffled=[...countries].sort(()=>Math.random()-0.5).slice(0,12);
    const scanned=shuffled.map(c=>({...c,ping:c.basePing+rand(-5,18)}));
    let i=0;
    scanRef.current=setInterval(()=>{
      if(i>=scanned.length){
        clearInterval(scanRef.current);
        const best=[...scanned].sort((a,b)=>a.ping-b.ping)[0];
        setScanLog(prev=>[...prev,`✓ Best: ${best.flag} ${best.name} — ${best.ping}ms`]);
        setTimeout(()=>{
          setPhase("connecting");
          setTimeout(()=>{ setSel(best); setPhase("connected"); },1800);
        },600);
        return;
      }
      const c=scanned[i];
      setScanResults(prev=>[...prev,c]);
      setScanLog(prev=>[...prev.slice(-5),`${c.flag} ${c.name.padEnd(14)} ${c.ping}ms`]);
      i++;
    },200);
  };

  const formatTime = s=>`${Math.floor(s/3600).toString().padStart(2,"0")}:${Math.floor((s%3600)/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  const regions=["All","Asia","Europe","Americas","Asia-Pacific"];
  const filtered=countries.filter(c=>(filter==="All"||c.region===filter)&&c.name.toLowerCase().includes(search.toLowerCase()));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#04060f",fontFamily:"'Space Mono',monospace" }}>
      <style>{CSS}</style>

      {/* iPhone shell */}
      <div style={{ width:390,height:844,background:"#090a18",borderRadius:55,overflow:"hidden",position:"relative",boxShadow:"0 0 0 10px #13142a,0 0 0 12px #090a18,0 50px 130px rgba(0,0,0,0.9),0 0 80px rgba(24,119,242,0.08)",display:"flex",flexDirection:"column" }}>

        {/* Status bar */}
        <div style={{ height:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",paddingTop:12,flexShrink:0,zIndex:10 }}>
          <span style={{ color:"white",fontSize:12,fontFamily:"Syne,sans-serif",fontWeight:700 }}>9:41</span>
          <div style={{ width:120,height:28,background:"#090a18",borderRadius:20,position:"absolute",left:"50%",transform:"translateX(-50%)",top:10 }}/>
          <div style={{ display:"flex",gap:5,fontSize:11 }}><span>📶</span>{permVPNgranted&&<span style={{ fontSize:9,color:"#5aabff",fontFamily:"Syne,sans-serif",fontWeight:700 }}>VPN</span>}<span>🔋</span></div>
        </div>

        {/* ── ONBOARDING ── */}
        {appStage==="onboarding" && <Onboarding onDone={finishOnboarding}/>}

        {/* ── MAIN APP ── */}
        {appStage==="ready" && (
          <div style={{ flex:1,overflowY:"auto",paddingBottom:80,position:"relative" }}>

            {/* ══ HOME ══ */}
            {tab==="home" && (
              <div style={{ animation:"fadeIn 0.35s ease" }}>
                {/* Header */}
                <div style={{ padding:"12px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                  <div>
                    <div style={{ color:"rgba(255,255,255,0.28)",fontSize:8,letterSpacing:3,fontFamily:"Syne,sans-serif" }}>MYANMAR FREE ACCESS</div>
                    <div style={{ color:"white",fontSize:20,fontWeight:800,fontFamily:"Syne,sans-serif",marginTop:2 }}>MetaBypass VPN</div>
                    <div style={{ color:"rgba(255,255,255,0.18)",fontSize:8,marginTop:2,fontFamily:"Syne,sans-serif" }}>by Min Thu Kyaw Khaung (Markus)</div>
                  </div>
                  <div style={{ display:"flex",gap:6,marginTop:4 }}>
                    {metaApps.map(app=>(
                      <div key={app.name} style={{ width:24,height:24,borderRadius:"50%",background:isConnected?app.color:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",color:isConnected?"white":"rgba(255,255,255,0.12)",fontSize:9,fontWeight:900,transition:"all 0.5s",boxShadow:isConnected?`0 0 8px ${app.color}70`:"none" }}>{app.icon}</div>
                    ))}
                  </div>
                </div>

                {/* Permission warnings (if not granted) */}
                {!permVPNgranted && (
                  <div onClick={()=>setDialog("vpn")} style={{ margin:"10px 24px 0",padding:"10px 14px",background:"rgba(255,140,0,0.08)",border:"1px solid rgba(255,140,0,0.25)",borderRadius:11,display:"flex",gap:10,alignItems:"center",cursor:"pointer",animation:"slideDown 0.3s ease" }}>
                    <span style={{ fontSize:14,flexShrink:0 }}>⚠️</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#ffb347",fontSize:10,fontFamily:"Syne,sans-serif",fontWeight:700 }}>VPN Permission Required</div>
                      <div style={{ color:"rgba(255,255,255,0.4)",fontSize:9,marginTop:2 }}>Tap to grant VPN configuration access</div>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.25)",fontSize:14 }}>›</span>
                  </div>
                )}
                {permVPNgranted && !profileInstalled && (
                  <div onClick={()=>setDialog("profile")} style={{ margin:"10px 24px 0",padding:"10px 14px",background:"rgba(255,140,0,0.08)",border:"1px solid rgba(255,140,0,0.25)",borderRadius:11,display:"flex",gap:10,alignItems:"center",cursor:"pointer" }}>
                    <span style={{ fontSize:14,flexShrink:0 }}>📋</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#ffb347",fontSize:10,fontFamily:"Syne,sans-serif",fontWeight:700 }}>Configuration Profile Needed</div>
                      <div style={{ color:"rgba(255,255,255,0.4)",fontSize:9,marginTop:2 }}>Tap to install VPN profile</div>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.25)",fontSize:14 }}>›</span>
                  </div>
                )}

                {/* Tunnel mode pill */}
                <div style={{ padding:"8px 24px 0" }}>
                  <div onClick={()=>setTab("apps")} style={{ display:"inline-flex",alignItems:"center",gap:7,cursor:"pointer",background:tunnelMode==="full"?"rgba(24,119,242,0.12)":"rgba(0,178,255,0.1)",border:`1px solid ${tunnelMode==="full"?"rgba(24,119,242,0.35)":"rgba(0,178,255,0.25)"}`,borderRadius:20,padding:"5px 12px 5px 8px" }}>
                    <span style={{ fontSize:12 }}>{tunnelMode==="full"?"🌐":"▦"}</span>
                    <span style={{ fontSize:9,color:tunnelMode==="full"?"#5aabff":"#7dd8ff",fontFamily:"Syne,sans-serif",fontWeight:700 }}>{tunnelMode==="full"?"Full Device Mode":"Meta Apps Only"}</span>
                    <span style={{ fontSize:9,color:"rgba(255,255,255,0.3)" }}>›</span>
                  </div>
                </div>

                {/* Status banner */}
                <div style={{ margin:"10px 24px 0",padding:"9px 14px",borderRadius:11,background:isConnected?"rgba(24,119,242,0.09)":isScanning?"rgba(100,180,255,0.07)":isConnecting?"rgba(255,180,0,0.08)":"rgba(255,60,60,0.07)",border:`1px solid ${isConnected?"rgba(24,119,242,0.3)":isScanning?"rgba(100,180,255,0.2)":isConnecting?"rgba(255,180,0,0.2)":"rgba(255,60,60,0.15)"}`,display:"flex",alignItems:"center",gap:9 }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",flexShrink:0,background:isConnected?"#1877F2":isScanning?"#64b5f6":isConnecting?"#ffb400":"#ff5050",animation:(isScanning||isConnecting)?"blink 0.6s infinite":"none",boxShadow:isConnected?"0 0 8px #1877F2":"none" }}/>
                  <div style={{ fontSize:9,letterSpacing:0.5,color:isConnected?"#5aabff":isScanning?"#90caf9":isConnecting?"#ffb400":"#ff6060" }}>
                    {isConnected?`SECURED — ${selectedCountry?.flag} ${selectedCountry?.name?.toUpperCase()} — ${tunnelMode==="full"?"ALL TRAFFIC TUNNELED":"META APPS UNBLOCKED"}`:isScanning?"SCANNING SERVERS... FINDING BEST NETWORK":isConnecting?"CONNECTING TO BEST SERVER...":"META APPS BLOCKED IN MYANMAR — TAP CONNECT"}
                  </div>
                </div>

                {/* Globe */}
                <Globe phase={phase} selectedCountry={selectedCountry} scanResults={scanResults} activeApps={activeApps}/>

                {/* Timer */}
                <div style={{ textAlign:"center",marginTop:2 }}>
                  <div style={{ fontSize:22,letterSpacing:5,color:isConnected?"white":"rgba(255,255,255,0.08)",transition:"color 0.5s" }}>{formatTime(timer)}</div>
                </div>

                {/* Scan log */}
                {(isScanning||isConnecting) && (
                  <div style={{ margin:"10px 24px 0",padding:"10px 14px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(100,181,246,0.15)",borderRadius:12,animation:"fadeIn 0.3s ease" }}>
                    <div style={{ color:"#64b5f6",fontSize:8,letterSpacing:2,marginBottom:6 }}>{isScanning?"SCANNING SERVERS...":"ESTABLISHING TUNNEL..."}</div>
                    {scanLog.map((line,i)=>(
                      <div key={i} style={{ fontSize:9,color:line.startsWith("✓")?"#00d28c":"rgba(255,255,255,0.45)",marginBottom:2,fontWeight:line.startsWith("✓")?700:400 }}>{line}</div>
                    ))}
                    {isScanning&&<div style={{ fontSize:9,color:"rgba(100,181,246,0.5)",animation:"blink 0.6s infinite",marginTop:2 }}>▍</div>}
                  </div>
                )}

                {/* Meta status cards */}
                {!isScanning&&!isConnecting&&(
                  <div style={{ margin:"12px 24px 0",display:"flex",gap:8 }}>
                    {metaApps.map((app,idx)=>{
                      const active=isConnected&&(tunnelMode==="full"||splitEnabled[app.name]);
                      return (
                        <div key={app.name} style={{ flex:1,background:active?`${app.color}12`:"rgba(255,255,255,0.03)",border:`1px solid ${active?app.color+"28":"rgba(255,255,255,0.05)"}`,borderRadius:13,padding:"9px 4px",textAlign:"center",transition:"all 0.4s",animation:active&&showMetaBadge?`unlockPop 0.4s ease ${idx*0.1}s both`:"none" }}>
                          <div style={{ width:28,height:28,borderRadius:8,margin:"0 auto",background:active?app.color:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",color:active?"white":"rgba(255,255,255,0.12)",fontSize:12,fontWeight:900,transition:"all 0.4s",boxShadow:active?`0 3px 12px ${app.color}50`:"none" }}>{app.icon}</div>
                          <div style={{ fontSize:7,color:active?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.15)",marginTop:5,fontFamily:"Syne,sans-serif",fontWeight:700 }}>{app.name}</div>
                          <div style={{ fontSize:6.5,color:active?"#00d28c":isConnected&&tunnelMode==="split"&&!splitEnabled[app.name]?"rgba(255,255,255,0.2)":"#ff5050",marginTop:2 }}>
                            {active?"✓ FREE":isConnected&&tunnelMode==="split"&&!splitEnabled[app.name]?"⊘ SKIP":"✗ BLOCKED"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Auto / Manual toggle */}
                {isIdle&&(
                  <div style={{ margin:"12px 24px 0",display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:12,padding:3,border:"1px solid rgba(255,255,255,0.07)" }}>
                    {[{val:true,label:"🔍 Auto Best"},{val:false,label:"📍 Manual"}].map(opt=>(
                      <button key={String(opt.val)} onClick={()=>setAutoMode(opt.val)} style={{ flex:1,padding:"8px 6px",borderRadius:9,border:"none",background:autoMode===opt.val?"rgba(24,119,242,0.2)":"transparent",color:autoMode===opt.val?"#5aabff":"rgba(255,255,255,0.28)",fontSize:10,fontFamily:"Syne,sans-serif",fontWeight:700,cursor:"pointer",transition:"all 0.2s" }}>{opt.label}</button>
                    ))}
                  </div>
                )}

                {isIdle&&autoMode&&(
                  <div style={{ margin:"8px 24px 0",padding:"10px 14px",background:"rgba(24,119,242,0.05)",border:"1px solid rgba(24,119,242,0.12)",borderRadius:11,display:"flex",gap:10,alignItems:"center" }}>
                    <span style={{ fontSize:16 }}>⚡</span>
                    <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.65 }}>Finder scans random servers worldwide, measures real-time ping, and auto-connects to the fastest one.</div>
                  </div>
                )}

                {isIdle&&!autoMode&&(
                  <div onClick={()=>setTab("servers")} style={{ margin:"8px 24px 0",padding:"13px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ fontSize:24 }}>{manualCountry.flag}</div>
                      <div>
                        <div style={{ display:"flex",gap:7,alignItems:"center" }}>
                          <span style={{ color:"white",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13 }}>{manualCountry.name}</span>
                          {manualCountry.metaOptimized&&<span style={{ background:"#1877F218",border:"1px solid #1877F228",borderRadius:5,padding:"1px 5px",fontSize:7,color:"#5aabff" }}>META ✓</span>}
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.3)",fontSize:9,marginTop:2 }}>
                          <span style={{ color:getPingColor(manualCountry.basePing) }}>{manualCountry.basePing}ms</span> · {getPingLabel(manualCountry.basePing)}
                        </div>
                      </div>
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.2)",fontSize:18 }}>›</div>
                  </div>
                )}

                {isConnected&&(
                  <div style={{ margin:"12px 24px 0",padding:"12px 16px",background:"rgba(24,119,242,0.07)",border:"1px solid rgba(24,119,242,0.2)",borderRadius:14,display:"flex",alignItems:"center",gap:12,animation:"slideUp 0.4s ease" }}>
                    <div style={{ fontSize:26 }}>{selectedCountry?.flag}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",gap:7,alignItems:"center" }}>
                        <span style={{ color:"white",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13 }}>{selectedCountry?.name}</span>
                        {autoMode&&<span style={{ background:"rgba(0,210,140,0.12)",border:"1px solid rgba(0,210,140,0.2)",borderRadius:5,padding:"1px 5px",fontSize:7,color:"#00d28c" }}>AUTO BEST</span>}
                      </div>
                      <div style={{ color:"rgba(255,255,255,0.35)",fontSize:9,marginTop:2 }}>
                        <span style={{ color:getPingColor(selectedCountry?.ping||0) }}>{selectedCountry?.ping}ms</span> · {getPingLabel(selectedCountry?.ping||0)} · WireGuard
                      </div>
                    </div>
                  </div>
                )}

                {isConnected&&(
                  <div style={{ display:"flex",gap:8,margin:"10px 24px 0",animation:"slideUp 0.4s ease" }}>
                    {[{label:"DOWN",value:`${dataDown} MB`,color:"#1877F2"},{label:"UP",value:`${dataUp} MB`,color:"#00B2FF"},{label:"PING",value:`${selectedCountry?.ping}ms`,color:getPingColor(selectedCountry?.ping||0)}].map(s=>(
                      <div key={s.label} style={{ flex:1,textAlign:"center",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:11,padding:"9px 4px" }}>
                        <div style={{ color:s.color,fontSize:11,fontWeight:700 }}>{s.value}</div>
                        <div style={{ color:"rgba(255,255,255,0.18)",fontSize:7,letterSpacing:1.2,marginTop:2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Connect button */}
                <div style={{ display:"flex",justifyContent:"center",marginTop:16 }}>
                  <button onClick={handleConnect} disabled={isScanning||isConnecting} style={{ width:200,height:50,borderRadius:25,border:"none",background:isConnected?"linear-gradient(135deg,#ff4444,#c0392b)":isScanning||isConnecting?"linear-gradient(135deg,#ffb400,#ff7000)":"linear-gradient(135deg,#1877F2,#00B2FF)",color:"white",fontSize:14,fontWeight:800,fontFamily:"Syne,sans-serif",letterSpacing:1.5,cursor:isScanning||isConnecting?"not-allowed":"pointer",transition:"all 0.4s",opacity:isScanning||isConnecting?0.85:1,boxShadow:isConnected?"0 8px 28px rgba(255,68,68,0.35)":isScanning||isConnecting?"0 8px 28px rgba(255,180,0,0.3)":"0 8px 28px rgba(24,119,242,0.45)",animation:isConnected?"glow 2s ease infinite":"none" }}>
                    {isConnected?"Disconnect":"Connect"}
                  </button>
                </div>

                {isIdle&&(
                  <div style={{ margin:"14px 24px 0",padding:"11px 14px",background:"rgba(24,119,242,0.05)",border:"1px solid rgba(24,119,242,0.12)",borderRadius:13,display:"flex",gap:10,alignItems:"flex-start" }}>
                    <span style={{ fontSize:14,flexShrink:0 }}>🇲🇲</span>
                    <div style={{ fontSize:10,color:"rgba(255,255,255,0.38)",lineHeight:1.75 }}>Facebook, Messenger, Instagram & WhatsApp are restricted in Myanmar. This VPN bypasses all restrictions.</div>
                  </div>
                )}

                <div style={{ textAlign:"center",marginTop:14,marginBottom:4 }}>
                  <div style={{ color:"rgba(255,255,255,0.13)",fontSize:8.5,fontFamily:"Syne,sans-serif" }}>Developed by Min Thu Kyaw Khaung (Markus)</div>
                </div>
              </div>
            )}

            {/* ══ SERVERS ══ */}
            {tab==="servers"&&(
              <div style={{ animation:"fadeIn 0.3s ease" }}>
                <div style={{ padding:"20px 24px 0",display:"flex",alignItems:"center",gap:14 }}>
                  <button onClick={()=>setTab("home")} style={{ background:"none",border:"none",color:"#5aabff",fontSize:20,cursor:"pointer",padding:0 }}>←</button>
                  <div style={{ color:"white",fontSize:19,fontWeight:800,fontFamily:"Syne,sans-serif" }}>Select Server</div>
                </div>
                <div onClick={()=>{setAutoMode(true);setTab("home");}} style={{ margin:"14px 24px 0",padding:"14px 16px",background:autoMode?"rgba(24,119,242,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${autoMode?"rgba(24,119,242,0.4)":"rgba(255,255,255,0.07)"}`,borderRadius:16,display:"flex",alignItems:"center",gap:14,cursor:"pointer" }}>
                  <div style={{ width:44,height:44,borderRadius:13,background:"linear-gradient(135deg,#1877F2,#00B2FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 14px rgba(24,119,242,0.4)" }}>🔍</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"white",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:14 }}>Auto Best Server</div>
                    <div style={{ color:"rgba(255,255,255,0.35)",fontSize:10,marginTop:3 }}>Scans random servers · picks lowest ping</div>
                  </div>
                  {autoMode&&<div style={{ width:8,height:8,borderRadius:"50%",background:"#1877F2",boxShadow:"0 0 8px #1877F2" }}/>}
                </div>
                <div style={{ padding:"14px 24px 0" }}>
                  <div style={{ color:"#5aabff",fontSize:8.5,letterSpacing:2.5,marginBottom:10,fontFamily:"Syne,sans-serif",fontWeight:700 }}>★ META-OPTIMIZED SERVERS</div>
                  {countries.filter(c=>c.metaOptimized).map((c,i)=>(
                    <div key={c.code} onClick={()=>{setManual(c);setAutoMode(false);setTab("home");}} style={{ padding:"11px 13px",marginBottom:7,background:!autoMode&&manualCountry.code===c.code?"rgba(24,119,242,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${!autoMode&&manualCountry.code===c.code?"rgba(24,119,242,0.4)":"rgba(255,255,255,0.06)"}`,borderRadius:13,display:"flex",alignItems:"center",gap:11,cursor:"pointer",animation:`slideUp 0.25s ease ${i*0.04}s both` }}>
                      <div style={{ fontSize:22 }}>{c.flag}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <span style={{ color:!autoMode&&manualCountry.code===c.code?"#5aabff":"white",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13 }}>{c.name}</span>
                          <span style={{ background:"#1877F218",border:"1px solid #1877F228",borderRadius:4,padding:"1px 4px",fontSize:6.5,color:"#5aabff" }}>FB</span>
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.22)",fontSize:9,marginTop:1 }}>{c.region}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ color:getPingColor(c.basePing),fontSize:11,fontWeight:700 }}>~{c.basePing}ms</div>
                        <div style={{ color:"rgba(255,255,255,0.18)",fontSize:7.5,marginTop:1 }}>{getPingLabel(c.basePing)}</div>
                      </div>
                      {!autoMode&&manualCountry.code===c.code&&<div style={{ width:6,height:6,borderRadius:"50%",background:"#1877F2",flexShrink:0 }}/>}
                    </div>
                  ))}
                </div>
                <div style={{ padding:"4px 24px 0" }}>
                  <div style={{ color:"rgba(255,255,255,0.22)",fontSize:8.5,letterSpacing:2.5,marginBottom:10,fontFamily:"Syne,sans-serif" }}>ALL SERVERS</div>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search country..." style={{ width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:11,color:"white",fontSize:12,fontFamily:"'Space Mono',monospace",outline:"none",boxSizing:"border-box",marginBottom:9 }}/>
                  <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:10,paddingBottom:3 }}>
                    {regions.map(r=>(
                      <button key={r} onClick={()=>setFilter(r)} style={{ padding:"5px 11px",borderRadius:16,border:`1px solid ${filter===r?"rgba(24,119,242,0.5)":"rgba(255,255,255,0.07)"}`,background:filter===r?"rgba(24,119,242,0.12)":"transparent",color:filter===r?"#5aabff":"rgba(255,255,255,0.3)",fontSize:8,letterSpacing:1,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"Syne,sans-serif" }}>{r.toUpperCase()}</button>
                    ))}
                  </div>
                  {filtered.map(c=>(
                    <div key={c.code} onClick={()=>{setManual(c);setAutoMode(false);setTab("home");}} style={{ padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:11,cursor:"pointer" }}>
                      <div style={{ fontSize:20 }}>{c.flag}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <span style={{ color:!autoMode&&manualCountry.code===c.code?"#5aabff":"white",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:12 }}>{c.name}</span>
                          {c.metaOptimized&&<span style={{ background:"#1877F214",border:"1px solid #1877F220",borderRadius:4,padding:"1px 4px",fontSize:6,color:"#5aabff" }}>META</span>}
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.2)",fontSize:8.5,marginTop:1 }}>{c.region}</div>
                      </div>
                      <div style={{ color:getPingColor(c.basePing),fontSize:10,fontWeight:700 }}>~{c.basePing}ms</div>
                      {!autoMode&&manualCountry.code===c.code&&<div style={{ width:6,height:6,borderRadius:"50%",background:"#1877F2",flexShrink:0 }}/>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ APPS ══ */}
            {tab==="apps"&&(
              <div style={{ animation:"fadeIn 0.3s ease",padding:"20px 24px" }}>
                <div style={{ color:"white",fontSize:19,fontWeight:800,fontFamily:"Syne,sans-serif" }}>App Control</div>
                <div style={{ color:"rgba(255,255,255,0.28)",fontSize:10.5,marginTop:3,marginBottom:18 }}>Choose how traffic is routed through the VPN</div>

                <div style={{ color:"rgba(255,255,255,0.3)",fontSize:8.5,letterSpacing:2.5,marginBottom:10,fontFamily:"Syne,sans-serif" }}>TUNNEL MODE</div>

                {/* Full Device */}
                <div onClick={()=>setTunnelMode("full")} style={{ padding:"16px",marginBottom:10,cursor:"pointer",background:tunnelMode==="full"?"rgba(24,119,242,0.12)":"rgba(255,255,255,0.03)",border:`2px solid ${tunnelMode==="full"?"#1877F2":"rgba(255,255,255,0.07)"}`,borderRadius:18,transition:"all 0.25s",boxShadow:tunnelMode==="full"?"0 0 24px rgba(24,119,242,0.2)":"none" }}>
                  <div style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
                    <div style={{ width:50,height:50,borderRadius:14,flexShrink:0,background:tunnelMode==="full"?"linear-gradient(135deg,#1877F2,#0d47a1)":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,transition:"all 0.3s",boxShadow:tunnelMode==="full"?"0 4px 18px rgba(24,119,242,0.5)":"none" }}>🌐</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ color:tunnelMode==="full"?"#5aabff":"white",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:14 }}>Full Device</div>
                        <div style={{ background:tunnelMode==="full"?"#1877F2":"transparent",border:`1px solid ${tunnelMode==="full"?"#1877F2":"rgba(255,255,255,0.15)"}`,borderRadius:20,padding:"2px 9px",fontSize:8,color:tunnelMode==="full"?"white":"rgba(255,255,255,0.3)",fontFamily:"Syne,sans-serif",fontWeight:700,letterSpacing:1,transition:"all 0.25s" }}>DEFAULT</div>
                      </div>
                      <div style={{ color:"rgba(255,255,255,0.45)",fontSize:10.5,marginTop:4,lineHeight:1.7 }}>
                        Routes <strong style={{ color:"rgba(255,255,255,0.75)" }}>all traffic</strong> — every app, browser, and service — through the VPN. Facebook & all Meta apps work automatically.
                      </div>
                      {tunnelMode==="full"&&(
                        <div style={{ marginTop:10,display:"flex",flexWrap:"wrap",gap:6 }}>
                          {["All Apps","Browsers","Facebook","Messenger","Instagram","WhatsApp","Everything"].map(tag=>(
                            <div key={tag} style={{ background:"rgba(24,119,242,0.15)",border:"1px solid rgba(24,119,242,0.25)",borderRadius:10,padding:"2px 8px",fontSize:8,color:"#7ab8ff" }}>{tag} ✓</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:2,border:`2px solid ${tunnelMode==="full"?"#1877F2":"rgba(255,255,255,0.2)"}`,background:tunnelMode==="full"?"#1877F2":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s" }}>
                      {tunnelMode==="full"&&<div style={{ width:8,height:8,borderRadius:"50%",background:"white" }}/>}
                    </div>
                  </div>
                </div>

                {/* Split */}
                <div onClick={()=>setTunnelMode("split")} style={{ padding:"16px",cursor:"pointer",background:tunnelMode==="split"?"rgba(0,178,255,0.08)":"rgba(255,255,255,0.03)",border:`2px solid ${tunnelMode==="split"?"#00B2FF":"rgba(255,255,255,0.07)"}`,borderRadius:18,transition:"all 0.25s",boxShadow:tunnelMode==="split"?"0 0 24px rgba(0,178,255,0.15)":"none" }}>
                  <div style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
                    <div style={{ width:50,height:50,borderRadius:14,flexShrink:0,background:tunnelMode==="split"?"linear-gradient(135deg,#00B2FF,#0077aa)":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,transition:"all 0.3s",boxShadow:tunnelMode==="split"?"0 4px 18px rgba(0,178,255,0.4)":"none" }}>▦</div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:tunnelMode==="split"?"#7dd8ff":"white",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:14 }}>Meta Apps Only</div>
                      <div style={{ color:"rgba(255,255,255,0.45)",fontSize:10.5,marginTop:4,lineHeight:1.7 }}>
                        Split tunneling — only selected Meta apps use VPN. Other apps run on normal internet for better speed.
                      </div>
                      {tunnelMode==="split"&&(
                        <div style={{ marginTop:12 }}>
                          <div style={{ color:"rgba(255,255,255,0.25)",fontSize:8,letterSpacing:2,marginBottom:8,fontFamily:"Syne,sans-serif" }}>SELECT APPS TO TUNNEL</div>
                          {metaApps.map(app=>(
                            <div key={app.name} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{ width:34,height:34,borderRadius:10,background:splitEnabled[app.name]?app.color:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:900,transition:"all 0.3s",boxShadow:splitEnabled[app.name]?`0 3px 10px ${app.color}50`:"none" }}>{app.icon}</div>
                              <div style={{ flex:1 }}>
                                <div style={{ color:"white",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:12 }}>{app.name}</div>
                                <div style={{ fontSize:9,color:splitEnabled[app.name]?"#00d28c":"#ff5050",marginTop:2,transition:"color 0.3s" }}>{splitEnabled[app.name]?"✓ Tunneled — unblocked":"✗ Not tunneled — blocked"}</div>
                              </div>
                              <div onClick={e=>{e.stopPropagation();setSplit(s=>({...s,[app.name]:!s[app.name]}));}} style={{ width:44,height:25,borderRadius:13,background:splitEnabled[app.name]?app.color:"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer",transition:"background 0.3s",flexShrink:0 }}>
                                <div style={{ width:19,height:19,borderRadius:"50%",background:"white",position:"absolute",top:3,left:splitEnabled[app.name]?22:3,transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:2,border:`2px solid ${tunnelMode==="split"?"#00B2FF":"rgba(255,255,255,0.2)"}`,background:tunnelMode==="split"?"#00B2FF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s" }}>
                      {tunnelMode==="split"&&<div style={{ width:8,height:8,borderRadius:"50%",background:"white" }}/>}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop:14,padding:"13px 15px",background:"rgba(24,119,242,0.05)",border:"1px solid rgba(24,119,242,0.12)",borderRadius:13 }}>
                  <div style={{ color:"#5aabff",fontSize:8.5,letterSpacing:1.5,marginBottom:6,fontFamily:"Syne,sans-serif",fontWeight:700 }}>{tunnelMode==="full"?"🌐 FULL DEVICE MODE ACTIVE":"▦ SPLIT TUNNEL MODE ACTIVE"}</div>
                  <div style={{ color:"rgba(255,255,255,0.38)",fontSize:10.5,lineHeight:1.8 }}>
                    {tunnelMode==="full"?"All internet traffic is encrypted and routed through the VPN. Facebook, Messenger, Instagram, and WhatsApp are unblocked automatically.":"Only toggled apps are tunneled. Make sure Facebook & Messenger are ON to unblock them."}
                  </div>
                </div>

                <div style={{ marginTop:10,padding:"13px 15px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:13 }}>
                  <div style={{ color:"rgba(255,255,255,0.28)",fontSize:8.5,letterSpacing:1.5,marginBottom:9,fontFamily:"Syne,sans-serif" }}>SECURITY CONFIG</div>
                  {[["Protocol","WireGuard"],["Encryption","ChaCha20-Poly1305"],["DNS","Custom DoH"],["Leak Protection","Enabled ✓"],["Kill Switch","Enabled ✓"],["No-Log Policy","Strict ✓"]].map(([l,v])=>(
                    <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color:"rgba(255,255,255,0.28)",fontSize:10.5 }}>{l}</span>
                      <span style={{ color:"white",fontSize:10.5,fontWeight:700 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Permission status */}
                <div style={{ marginTop:10,padding:"13px 15px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:13 }}>
                  <div style={{ color:"rgba(255,255,255,0.28)",fontSize:8.5,letterSpacing:1.5,marginBottom:9,fontFamily:"Syne,sans-serif" }}>DEVICE PERMISSIONS</div>
                  {[
                    {label:"VPN Configuration", granted:permVPNgranted, onRequest:()=>setDialog("vpn")},
                    {label:"Config Profile",    granted:profileInstalled,onRequest:()=>setDialog("profile")},
                    {label:"Notifications",     granted:permNotifGranted,onRequest:()=>setDialog("notif")},
                  ].map(p=>(
                    <div key={p.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color:"rgba(255,255,255,0.4)",fontSize:11 }}>{p.label}</span>
                      {p.granted
                        ? <span style={{ color:"#00d28c",fontSize:11,fontWeight:700 }}>✓ Granted</span>
                        : <button onClick={p.onRequest} style={{ background:"rgba(255,180,0,0.15)",border:"1px solid rgba(255,180,0,0.3)",borderRadius:8,padding:"3px 10px",color:"#ffb347",fontSize:9,fontFamily:"Syne,sans-serif",fontWeight:700,cursor:"pointer" }}>Allow →</button>
                      }
                    </div>
                  ))}
                </div>

                <div style={{ textAlign:"center",marginTop:16,marginBottom:4 }}>
                  <div style={{ color:"rgba(255,255,255,0.15)",fontSize:8.5,fontFamily:"Syne,sans-serif" }}>MetaBypass VPN · by Min Thu Kyaw Khaung (Markus)</div>
                </div>
              </div>
            )}

            {/* ══ DIALOGS ══ */}
            {dialog==="vpn"&&(
              <IOSAlert
                icon="🔒" iconBg="rgba(24,119,242,0.15)"
                title={`"MetaBypass VPN" Would Like to Add VPN Configurations`}
                body="All network activity on this iPhone may be filtered or monitored when using VPN."
                actions={[
                  { label:"Don't Allow", onPress:()=>setDialog(null) },
                  { label:"Allow", primary:true, onPress:handleVPNAllow },
                ]}
              />
            )}
            {dialog==="notif"&&(
              <IOSAlert
                icon="🔔" iconBg="rgba(255,180,0,0.15)"
                title={`"MetaBypass VPN" Would Like to Send You Notifications`}
                body="Notifications may include connection status, server changes, and security alerts."
                actions={[
                  { label:"Don't Allow", onPress:()=>setDialog(null) },
                  { label:"Allow", primary:true, onPress:handleNotifAllow },
                ]}
              />
            )}
            {dialog==="profile"&&(
              <ProfileSheet
                onInstall={handleProfileInstall}
                onCancel={()=>setDialog(null)}
              />
            )}
          </div>
        )}

        {/* Bottom nav — only when app is ready */}
        {appStage==="ready"&&(
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:80,background:"rgba(9,10,24,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"flex-start",paddingTop:12,zIndex:50 }}>
            {[{id:"home",icon:"◉",label:"HOME"},{id:"servers",icon:"⊕",label:"SERVERS"},{id:"apps",icon:"▦",label:"APPS"}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                <div style={{ fontSize:20,color:tab===t.id?"#1877F2":"rgba(255,255,255,0.16)",transition:"color 0.2s" }}>{t.icon}</div>
                <div style={{ fontSize:7.5,letterSpacing:1.5,color:tab===t.id?"#5aabff":"rgba(255,255,255,0.13)",fontFamily:"Syne,sans-serif",fontWeight:700 }}>{t.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}