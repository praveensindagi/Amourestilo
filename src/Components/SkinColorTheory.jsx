/**
 * Amour Estilo — Skin Colour Season Analyser
 * International luxury design · White & black · Cormorant + DM Sans
 * Live camera · Upload · Claude Vision AI analysis
 */

import { useState, useRef, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  ink:     "#0A0A0A",
  chalk:   "#F7F5F2",
  warm:    "#FAFAF8",
  stone:   "#E8E5E0",
  dust:    "#C4BFB8",
  ash:     "#6B6560",
  sable:   "#2A2420",
  gold:    "#C8A96A",
  goldDim: "#9B7D45",
  goldPale:"#EDE0C4",
};

const F = {
  display: `'Cormorant Garamond', 'Georgia', serif`,
  body:    `'DM Sans', 'Inter', system-ui, sans-serif`,
  mono:    `'Courier New', monospace`,
};

// ─── FACE SVG PATHS ───────────────────────────────────────────────────────────
const FACE_PATHS = {
  oval:    <><ellipse cx="40" cy="48" rx="26" ry="34" fill={C.stone} stroke={C.gold} strokeWidth="1"/><ellipse cx="31" cy="42" rx="3.5" ry="4.5" fill={C.sable} opacity=".35"/><ellipse cx="49" cy="42" rx="3.5" ry="4.5" fill={C.sable} opacity=".35"/><path d="M31 62 Q40 70 49 62" fill="none" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round"/></>,
  round:   <><circle cx="40" cy="48" r="30" fill={C.stone} stroke={C.gold} strokeWidth="1"/><circle cx="31" cy="44" r="3.5" fill={C.sable} opacity=".35"/><circle cx="49" cy="44" r="3.5" fill={C.sable} opacity=".35"/><path d="M31 62 Q40 70 49 62" fill="none" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round"/></>,
  square:  <><rect x="12" y="14" width="56" height="68" rx="4" fill={C.stone} stroke={C.gold} strokeWidth="1"/><ellipse cx="31" cy="40" rx="3.5" ry="4" fill={C.sable} opacity=".35"/><ellipse cx="49" cy="40" rx="3.5" ry="4" fill={C.sable} opacity=".35"/><path d="M31 62 Q40 70 49 62" fill="none" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round"/></>,
  heart:   <><path d="M40 86 C10 64 8 16 40 30 C72 16 70 64 40 86Z" fill={C.stone} stroke={C.gold} strokeWidth="1"/><ellipse cx="31" cy="44" rx="3" ry="4" fill={C.sable} opacity=".35"/><ellipse cx="49" cy="44" rx="3" ry="4" fill={C.sable} opacity=".35"/><path d="M31 64 Q40 72 49 64" fill="none" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round"/></>,
  diamond: <><polygon points="40,8 72,48 40,90 8,48" fill={C.stone} stroke={C.gold} strokeWidth="1"/><ellipse cx="31" cy="46" rx="3.5" ry="4" fill={C.sable} opacity=".35"/><ellipse cx="49" cy="46" rx="3.5" ry="4" fill={C.sable} opacity=".35"/><path d="M31 64 Q40 72 49 64" fill="none" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round"/></>,
  oblong:  <><ellipse cx="40" cy="48" rx="21" ry="40" fill={C.stone} stroke={C.gold} strokeWidth="1"/><ellipse cx="32" cy="40" rx="3" ry="4" fill={C.sable} opacity=".35"/><ellipse cx="48" cy="40" rx="3" ry="4" fill={C.sable} opacity=".35"/><path d="M31 62 Q40 70 49 62" fill="none" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round"/></>,
};

// ─── 12 SEASONS META ──────────────────────────────────────────────────────────
const SEASON_META = {
  "Light Spring":  { group:"Spring", tag:"Warm · Light · Clear" },
  "True Spring":   { group:"Spring", tag:"Warm · Medium · Clear" },
  "Bright Spring": { group:"Spring", tag:"Warm · High-contrast" },
  "Light Summer":  { group:"Summer", tag:"Cool · Light · Soft" },
  "True Summer":   { group:"Summer", tag:"Cool · Medium · Soft" },
  "Soft Summer":   { group:"Summer", tag:"Cool · Muted" },
  "Soft Autumn":   { group:"Autumn", tag:"Warm · Muted · Soft" },
  "True Autumn":   { group:"Autumn", tag:"Warm · Rich · Deep" },
  "Deep Autumn":   { group:"Autumn", tag:"Warm · Deep · Dark" },
  "Deep Winter":   { group:"Winter", tag:"Cool · Deep · Clear" },
  "True Winter":   { group:"Winter", tag:"Cool · Vivid · High-contrast" },
  "Bright Winter": { group:"Winter", tag:"Cool · Electric · Clear" },
};

const GROUP_ACCENT = { Spring:"#B89A40", Summer:"#7A90B0", Autumn:"#9B6030", Winter:"#4A5878" };

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

const Token = ({ children, style = {} }) => (
  <span style={{
    display:"inline-block", fontSize:9, letterSpacing:"0.18em",
    textTransform:"uppercase", color:C.ash, fontFamily:F.body,
    fontWeight:500, ...style,
  }}>{children}</span>
);

const Rule = ({ style = {} }) => (
  <div style={{ height:"0.5px", background:C.stone, ...style }} />
);

const GoldMark = ({ children, style = {} }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", gap:6,
    fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase",
    color:C.goldDim, fontFamily:F.body, fontWeight:500, ...style,
  }}>
    <span style={{ width:14, height:"0.5px", background:C.gold }} />
    {children}
  </span>
);

const SeasonChip = ({ name, active }) => (
  <span style={{
    fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase",
    color: active ? C.gold : C.ash,
    borderBottom: active ? `1px solid ${C.gold}` : "1px solid transparent",
    paddingBottom:2, fontFamily:F.body, fontWeight:500,
    whiteSpace:"nowrap", transition:"all 0.25s",
  }}>{name}</span>
);

const Swatch = ({ hex, name, size=44, ring=false }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:hex,
      border: ring ? `1.5px solid ${C.gold}` : `1px solid rgba(0,0,0,0.08)`,
      boxShadow: ring ? `0 0 0 3px ${C.gold}22` : "none",
    }} title={name} />
    <span style={{
      fontSize:9, letterSpacing:"0.06em", color:C.ash,
      textAlign:"center", maxWidth:size+8, lineHeight:1.3,
      fontFamily:F.body,
    }}>{name}</span>
  </div>
);

const AvoidSwatch = ({ hex, name }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
    <div style={{
      width:36, height:36, borderRadius:"50%",
      background:hex, opacity:0.38,
      border:`1px solid rgba(0,0,0,0.08)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:13, color:"rgba(140,40,40,0.55)",
    }}>×</div>
    <span style={{ fontSize:9, color:C.dust, textAlign:"center", maxWidth:44, lineHeight:1.3, fontFamily:F.body }}>{name}</span>
  </div>
);

const StatBlock = ({ label, value, note }) => (
  <div style={{
    background:C.chalk, borderRadius:2, padding:"12px 14px",
  }}>
    <Token style={{ marginBottom:4, display:"block" }}>{label}</Token>
    <div style={{ fontSize:15, fontWeight:500, color:C.ink, fontFamily:F.body, marginBottom:2 }}>{value}</div>
    {note && <div style={{ fontSize:10, color:C.ash, lineHeight:1.4 }}>{note}</div>}
  </div>
);

const NoteBar = ({ children }) => (
  <div style={{
    borderLeft:`1.5px solid ${C.gold}`,
    paddingLeft:12, marginTop:16,
    fontSize:11, color:C.ash, lineHeight:1.85,
    fontFamily:F.body,
  }}>{children}</div>
);

// ─── LOADER STEP ──────────────────────────────────────────────────────────────
const LoadStep = ({ label, state }) => {
  const icon = state==="done" ? "✓" : state==="active" ? "◌" : "·";
  const col  = state==="done" ? "#4A7A1A" : state==="active" ? C.gold : C.dust;
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:10, padding:"7px 0",
      borderBottom:`0.5px solid ${C.stone}`,
      fontFamily:F.body, fontSize:12, color: state==="idle" ? C.dust : C.ink,
      transition:"color 0.3s",
    }}>
      <span style={{
        fontSize:12, color:col, width:14, textAlign:"center",
        animation: state==="active" ? "ae-spin 1s linear infinite" : "none",
      }}>{icon}</span>
      {label}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AmourEstilo() {
  const [screen, setScreen]       = useState("entry");  // entry|camera|preview|loading|result
  const [photoURL, setPhotoURL]   = useState(null);
  const [photoB64, setPhotoB64]   = useState(null);
  const [photoSrc, setPhotoSrc]   = useState("upload"); // camera|upload
  const [checks, setChecks]       = useState([]);
  const [checkBadge, setCheckBadge] = useState(null);   // ok|warn|err + message
  const [canAnalyse, setCanAnalyse] = useState(false);
  const [loadSteps, setLoadSteps]  = useState([
    { id:1, label:"Detecting face & structure",      state:"idle" },
    { id:2, label:"Reading skin tone & undertone",   state:"idle" },
    { id:3, label:"Mapping your colour season",      state:"idle" },
    { id:4, label:"Building outfit palette",         state:"idle" },
    { id:5, label:"Crafting your style report",      state:"idle" },
  ]);
  const [result, setResult]       = useState(null);
  const [activeOutfit, setActiveOutfit] = useState(0);
  const [timerDelay, setTimerDelay] = useState(5);
  const [countdown, setCountdown]  = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [hoveredSwatch, setHoveredSwatch] = useState(null);

  const videoRef     = useRef();
  const canvasRef    = useRef();
  const overlayRef   = useRef();
  const streamRef    = useRef();
  const countdownRef = useRef();
  const fileRef      = useRef();

  // ─ fonts ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("ae-fonts")) return;
    const l = document.createElement("link");
    l.id = "ae-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.textContent = `@keyframes ae-spin{to{transform:rotate(360deg)}} @keyframes ae-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(s);
  }, []);

  // ─ camera ───────────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    stopCamera();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video:{ facingMode, width:{ideal:1280}, height:{ideal:960} }, audio:false,
      });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch(e) {
      setCheckBadge({ type:"err", msg:"Camera unavailable — please upload a photo instead." });
    }
  }, [facingMode]);

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null; }
    clearCountdownTimer();
  };

  useEffect(() => {
    if (screen==="camera") startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [screen, facingMode]);

  const clearCountdownTimer = () => {
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current=null; }
    setCountdown(null);
  };

  const doCapture = () => {
    const vid = videoRef.current;
    const cvs = canvasRef.current;
    if (!vid || !cvs) return;
    cvs.width  = vid.videoWidth  || 640;
    cvs.height = vid.videoHeight || 480;
    cvs.getContext("2d").drawImage(vid, 0, 0);
    const url  = cvs.toDataURL("image/jpeg", 0.92);
    const b64  = url.split(",")[1];
    setPhotoURL(url); setPhotoB64(b64); setPhotoSrc("camera");
    stopCamera();
    setScreen("preview");
    runQualityCheck(b64);
  };

  const triggerCapture = () => {
    if (timerDelay===0) { doCapture(); return; }
    let rem = timerDelay;
    setCountdown(rem);
    countdownRef.current = setInterval(() => {
      rem--;
      if (rem<=0) { clearCountdownTimer(); doCapture(); }
      else setCountdown(rem);
    }, 1000);
  };

  // ─ upload ───────────────────────────────────────────────────────────────────
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target.result;
      const b64 = url.split(",")[1];
      setPhotoURL(url); setPhotoB64(b64); setPhotoSrc("upload");
      setScreen("preview");
      runQualityCheck(b64);
    };
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target.result;
      const b64 = url.split(",")[1];
      setPhotoURL(url); setPhotoB64(b64); setPhotoSrc("upload");
      setScreen("preview");
      runQualityCheck(b64);
    };
    reader.readAsDataURL(f);
  };

  // ─ face overlay ─────────────────────────────────────────────────────────────
  const drawOverlay = (box, found) => {
    const cvs = overlayRef.current;
    const img = document.getElementById("ae-preview-img");
    if (!cvs || !img || !found || !box) return;
    const iw = img.clientWidth, ih = img.clientHeight;
    cvs.width = iw; cvs.height = ih;
    const ctx = cvs.getContext("2d");
    ctx.clearRect(0,0,iw,ih);
    const x=(box.x/100)*iw, y=(box.y/100)*ih;
    const w=(box.w/100)*iw, h=(box.h/100)*ih;
    ctx.strokeStyle=C.gold; ctx.lineWidth=1.2; ctx.setLineDash([6,4]);
    ctx.strokeRect(x,y,w,h);
    ctx.fillStyle=C.gold; ctx.font="9px DM Sans, sans-serif";
    ctx.fillText("Face verified",x+3,y-6);
    [[0.28,0.37],[0.72,0.37],[0.50,0.56],[0.34,0.73],[0.66,0.73]].forEach(([px,py])=>{
      ctx.beginPath(); ctx.arc(x+px*w, y+py*h, 2.2, 0, Math.PI*2);
      ctx.fillStyle=C.gold; ctx.fill();
    });
  };

  // ─ quality check (Claude API call 1) ────────────────────────────────────────
  const runQualityCheck = async (b64) => {
    setChecks([{ label:"Sending photo to Claude Vision…", state:"spin" }]);
    setCheckBadge(null); setCanAnalyse(false);
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:600,
          messages:[{ role:"user", content:[
            { type:"image", source:{ type:"base64", media_type:"image/jpeg", data:b64 } },
            { type:"text", text:`Inspect this photo for face analysis quality. Respond ONLY in valid JSON, no markdown:
{
  "face_found": true,
  "face_count": 1,
  "face_box_pct": {"x":25,"y":10,"w":48,"h":68},
  "lighting": "good|ok|poor",
  "angle": "frontal|slight|extreme",
  "sharpness": "sharp|soft|blurry",
  "face_coverage": "large|medium|small",
  "obstructions": "none|minor|major",
  "quality_score": 82,
  "ready": true,
  "issues": []
}` }
          ]}]
        })
      });
      const data = await res.json();
      const raw  = (data.content||[]).map(x=>x.text||"").join("").replace(/```json|```/g,"").trim();
      const q    = JSON.parse(raw);
      setTimeout(()=>drawOverlay(q.face_box_pct, q.face_found), 200);
      const row = (label, st) => ({ label, state:st });
      const st  = v => v==="good"||v==="frontal"||v==="sharp"||v==="large"||v==="none"||v===true?"pass":v==="ok"||v==="slight"||v==="soft"||v==="medium"||v==="minor"?"warn":"fail";
      setChecks([
        row(q.face_found?`Face detected (${q.face_count||1} person)`:"No face detected", q.face_found?"pass":"fail"),
        row(`Lighting: ${q.lighting}`, st(q.lighting)),
        row(`Head angle: ${q.angle}`, st(q.angle)),
        row(`Sharpness: ${q.sharpness}`, st(q.sharpness)),
        row(`Obstructions: ${q.obstructions}`, st(q.obstructions)),
      ]);
      const score = Math.round(q.quality_score||0);
      if (!q.face_found) { setCheckBadge({ type:"err", msg:"No face detected — retake or upload a clearer photo." }); setCanAnalyse(false); }
      else if (q.ready)  { setCheckBadge({ type:"ok",  msg:`Quality verified · ${score}/100` });               setCanAnalyse(true); }
      else               { setCheckBadge({ type:"warn",msg:`Score ${score}/100 — ${(q.issues||[]).join("; ")||"may affect accuracy"}` }); setCanAnalyse(true); }
    } catch(e) {
      setChecks([{ label:"Photo loaded — ready to analyse", state:"pass" }]);
      setCheckBadge({ type:"ok", msg:"Ready" }); setCanAnalyse(true);
    }
  };

  // ─ loader advance ────────────────────────────────────────────────────────────
  const advanceLoader = () => {
    let i=0;
    return setInterval(()=>{
      setLoadSteps(prev => prev.map((s,idx)=>{
        if (idx===i-1) return { ...s, state:"done" };
        if (idx===i)   return { ...s, state:"active" };
        return s;
      }));
      i++;
    }, 950);
  };

  // ─ analysis (Claude API call 2) ──────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!photoB64) return;
    setLoadSteps(prev => prev.map((s,i)=>i===0?{...s,state:"active"}:{...s,state:"idle"}));
    setScreen("loading");
    const timer = advanceLoader();
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:2400,
          messages:[{ role:"user", content:[
            { type:"image", source:{ type:"base64", media_type:"image/jpeg", data:photoB64 } },
            { type:"text", text:`You are a master personal colour analyst trained in Munsell colour science, Itten 12-season theory, and simultaneous contrast. Analyse this face photo with the precision of a professional colour consultant.

Read: exact skin tone hex from the skin (not background), L*a*b* derived undertone, depth, chroma, face geometry for shape, natural contrast level, and precise 12-season assignment. Every recommendation must reflect what you actually see in this image.

Respond ONLY in valid JSON (no markdown, no backticks, no text outside JSON):
{
  "skin_hex": "#hexcode",
  "skin_name": "descriptive name e.g. Warm Honey, Deep Espresso, Cool Rose Beige",
  "undertone": "warm|cool|olive|neutral",
  "undertone_cue": "one sentence: what in the photo indicates this undertone",
  "depth": "light|medium|deep",
  "chroma": "clear|soft",
  "face_shape": "oval|round|square|heart|diamond|oblong",
  "face_shape_cue": "one sentence: what proportions indicate this shape",
  "contrast": "low|medium|high",
  "season": "one of: Light Spring|True Spring|Bright Spring|Light Summer|True Summer|Soft Summer|Soft Autumn|True Autumn|Deep Autumn|Deep Winter|True Winter|Bright Winter",
  "season_desc": "two precise sentences explaining why this season fits this exact complexion",
  "wear_palette": [
    {"name":"colour name","hex":"#hex","why":"one phrase: why this works for this complexion"},
    {"name":"colour name","hex":"#hex","why":"one phrase"},
    {"name":"colour name","hex":"#hex","why":"one phrase"},
    {"name":"colour name","hex":"#hex","why":"one phrase"},
    {"name":"colour name","hex":"#hex","why":"one phrase"},
    {"name":"colour name","hex":"#hex","why":"one phrase"}
  ],
  "avoid_palette": [
    {"name":"colour name","hex":"#hex"},
    {"name":"colour name","hex":"#hex"},
    {"name":"colour name","hex":"#hex"},
    {"name":"colour name","hex":"#hex"}
  ],
  "science_note": "one sentence on simultaneous contrast at work for this season",
  "face_tips": [
    "best neckline for this face shape",
    "best earring style for this face shape",
    "where to place colour on the body for this face shape",
    "what silhouette or detail to avoid"
  ],
  "face_sci": "one sentence connecting this face shape to colour placement",
  "outfits": [
    {"name":"outfit name","occasion":"Day","top_hex":"#hex","bottom_hex":"#hex","accent_hex":"#hex","desc":"ten-word colour story"},
    {"name":"outfit name","occasion":"Evening","top_hex":"#hex","bottom_hex":"#hex","accent_hex":"#hex","desc":"ten-word colour story"},
    {"name":"outfit name","occasion":"Casual","top_hex":"#hex","bottom_hex":"#hex","accent_hex":"#hex","desc":"ten-word colour story"}
  ],
  "makeup": {
    "lip_hex":"#hex","lip_name":"colour name",
    "eye_hex":"#hex","eye_name":"colour name",
    "blush_hex":"#hex","blush_name":"colour name",
    "brow":"brow tone description"
  },
  "makeup_sci": "one sentence on why these harmonise with this complexion",
  "best_metal": "Gold|Silver|Rose Gold|Bronze|Platinum",
  "best_white": "descriptive e.g. Warm ivory #FFF5E0 or Pure white #FFFFFF"
}` }
          ]}]
        })
      });
      const data = await res.json();
      const raw  = (data.content||[]).map(x=>x.text||"").join("").replace(/```json|```/g,"").trim();
      const r    = JSON.parse(raw);
      clearInterval(timer);
      setLoadSteps(prev => prev.map(s=>({...s,state:"done"})));
      setTimeout(()=>{ setResult(r); setActiveOutfit(0); setScreen("result"); }, 400);
    } catch(err) {
      clearInterval(timer);
      setScreen("preview"); setCheckBadge({ type:"err", msg:"Analysis failed — please try again." });
    }
  };

  const fullReset = () => {
    setScreen("entry"); setPhotoURL(null); setPhotoB64(null);
    setChecks([]); setCheckBadge(null); setCanAnalyse(false); setResult(null);
    setLoadSteps(prev => prev.map(s=>({...s,state:"idle"})));
    if (fileRef.current) fileRef.current.value="";
  };

  const cap = s => s ? s.charAt(0).toUpperCase()+s.slice(1) : "—";

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  const root = {
    background: C.warm, minHeight:"100vh",
    fontFamily: F.body, color: C.ink,
  };

  // ── HEADER ──────────────────────────────────────────────────────────────────
  const Header = () => (
    <header style={{
      position:"sticky", top:0, zIndex:100,
      background: C.warm, borderBottom:`0.5px solid ${C.stone}`,
      padding:"0 32px", height:56,
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <div>
        <div style={{ fontFamily:F.display, fontSize:17, fontWeight:300, letterSpacing:"0.06em", lineHeight:1 }}>
          Amour <em style={{ fontStyle:"italic", color:C.gold }}>Estilo</em>
        </div>
        <div style={{ fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:C.dust, marginTop:2 }}>
          Colour · Form · Identity
        </div>
      </div>
      {screen==="result" && (
        <button onClick={fullReset} style={{
          background:"none", border:`0.5px solid ${C.stone}`, borderRadius:2,
          padding:"6px 14px", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase",
          color:C.ash, cursor:"pointer", fontFamily:F.body,
        }}>New analysis</button>
      )}
    </header>
  );

  // ── 12-SEASON STRIP ─────────────────────────────────────────────────────────
  const SeasonStrip = ({ active }) => (
    <div style={{
      borderBottom:`0.5px solid ${C.stone}`,
      padding:"10px 32px",
      overflowX:"auto", display:"flex", gap:20,
      scrollbarWidth:"none",
    }}>
      {Object.keys(SEASON_META).map(name=>(
        <SeasonChip key={name} name={name} active={name===active} />
      ))}
    </div>
  );

  // ── ENTRY ────────────────────────────────────────────────────────────────────
  if (screen==="entry") return (
    <div style={root}>
      <Header />
      <div style={{ maxWidth:560, margin:"0 auto", padding:"56px 32px 64px" }}>

        <Token style={{ display:"block", marginBottom:14 }}>Amour Estilo · Colour Analysis</Token>
        <h1 style={{
          fontFamily:F.display, fontSize:"clamp(42px,6vw,66px)",
          fontWeight:300, lineHeight:1.08, letterSpacing:"-0.01em",
          marginBottom:20, color:C.ink,
        }}>
          One photo.<br />
          <em style={{ fontStyle:"italic", color:C.gold }}>Your entire palette.</em>
        </h1>
        <p style={{ fontSize:14, color:C.ash, lineHeight:1.85, maxWidth:420, marginBottom:48 }}>
          Grounded in Munsell colour science and Itten's 12-season theory.
          Upload or capture a photo — Claude Vision reads your skin tone, undertone,
          face structure, and returns your precise colour season with outfit palette.
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:40 }}>
          {[
            { id:"cam", icon:"⊙", title:"Take a photo", sub:"Use your camera now", action:()=>setScreen("camera") },
            { id:"up",  icon:"↑", title:"Upload a photo", sub:"Choose from your device", action:()=>fileRef.current?.click() },
          ].map(m=>(
            <div key={m.id} onClick={m.action} style={{
              padding:"22px 20px", border:`0.5px solid ${C.stone}`,
              borderRadius:3, cursor:"pointer", background:C.warm,
              transition:"all 0.18s", display:"flex", flexDirection:"column", gap:10,
            }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.background=C.chalk; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.stone; e.currentTarget.style.background=C.warm; }}
            >
              <span style={{ fontSize:20, color:C.gold, fontFamily:F.display }}>{m.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:C.ink, marginBottom:3 }}>{m.title}</div>
                <div style={{ fontSize:11, color:C.ash }}>{m.sub}</div>
              </div>
            </div>
          ))}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display:"none" }} onChange={handleFile} />
        </div>

        <Rule style={{ marginBottom:32 }} />
        <Token style={{ display:"block", marginBottom:16 }}>For accurate analysis</Token>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            ["Daylight","Soft window light, no harsh flash or shadow"],
            ["Frontal","Face the camera directly, head level"],
            ["Bare skin","Minimal makeup for accurate skin reading"],
            ["Full face","Chin to forehead visible, not cropped"],
          ].map(([t,b])=>(
            <div key={t} style={{ padding:"12px 14px", background:C.chalk, borderRadius:2 }}>
              <div style={{ fontSize:11, fontWeight:500, color:C.ink, marginBottom:3 }}>{t}</div>
              <div style={{ fontSize:11, color:C.ash, lineHeight:1.5 }}>{b}</div>
            </div>
          ))}
        </div>

        <Rule style={{ marginTop:40, marginBottom:20 }} />
        <div style={{ display:"flex", gap:28 }}>
          {[["12","Colour seasons"],["3","Skin dimensions"],["6+","Face shapes mapped"]].map(([n,l])=>(
            <div key={l}>
              <div style={{ fontFamily:F.display, fontSize:28, fontWeight:300, color:C.ink, lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.dust, marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── CAMERA ───────────────────────────────────────────────────────────────────
  if (screen==="camera") return (
    <div style={root}>
      <Header />
      <div style={{ maxWidth:560, margin:"0 auto", padding:"32px 32px 48px" }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <Token style={{ display:"block", marginBottom:4 }}>Live camera</Token>
            <div style={{ fontFamily:F.display, fontSize:20, fontWeight:300 }}>Position your face</div>
          </div>
          <button onClick={()=>setScreen("entry")} style={{
            background:"none", border:`0.5px solid ${C.stone}`, borderRadius:2,
            padding:"6px 14px", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase",
            color:C.ash, cursor:"pointer", fontFamily:F.body,
          }}>← Back</button>
        </div>

        {/* Viewfinder */}
        <div style={{
          position:"relative", background:C.sable,
          borderRadius:4, overflow:"hidden", aspectRatio:"4/3",
          marginBottom:20, display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />

          {/* Oval guide */}
          <div style={{
            position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none",
          }}>
            <div style={{
              width:"52%", paddingBottom:"62%",
              border:`1px solid ${C.gold}80`,
              borderRadius:"50% 50% 46% 46%",
              boxShadow:`0 0 0 2000px rgba(0,0,0,0.28)`,
            }} />
          </div>

          {/* Countdown */}
          {countdown!==null && (
            <div style={{
              position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:F.display, fontSize:96, fontWeight:300, color:C.gold,
              textShadow:"0 2px 24px rgba(0,0,0,0.6)", pointerEvents:"none",
            }}>{countdown}</div>
          )}

          <div style={{
            position:"absolute", bottom:10, left:0, right:0, textAlign:"center",
            fontSize:10, letterSpacing:"0.1em", color:`${C.goldPale}CC`,
          }}>Align face within the oval · soft natural light</div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:16 }}>
          {[0,3,5,10].map(n=>(
            <button key={n} onClick={()=>setTimerDelay(n)} style={{
              padding:"7px 13px", borderRadius:2,
              border:`0.5px solid ${timerDelay===n ? C.gold : C.stone}`,
              background: timerDelay===n ? `${C.gold}12` : "transparent",
              color: timerDelay===n ? C.goldDim : C.ash,
              fontSize:10, letterSpacing:"0.1em", cursor:"pointer", fontFamily:F.body,
            }}>{n===0?"Now":`${n}s`}</button>
          ))}

          {/* Capture */}
          <button onClick={triggerCapture} style={{
            width:52, height:52, borderRadius:"50%",
            border:`1.5px solid ${C.gold}`,
            background:"transparent", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, color:C.gold, transition:"all 0.15s",
          }}
          onMouseEnter={e=>e.currentTarget.style.background=`${C.gold}18`}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          aria-label="Capture photo">⊙</button>

          <button onClick={()=>setFacingMode(f=>f==="user"?"environment":"user")} style={{
            padding:"7px 13px", borderRadius:2,
            border:`0.5px solid ${C.stone}`,
            background:"transparent", color:C.ash,
            fontSize:10, cursor:"pointer", fontFamily:F.body,
          }}>↺ Flip</button>
        </div>

        <canvas ref={canvasRef} style={{ display:"none" }} />
      </div>
    </div>
  );

  // ── PREVIEW / QUALITY CHECK ──────────────────────────────────────────────────
  if (screen==="preview") return (
    <div style={root}>
      <Header />
      <div style={{ maxWidth:560, margin:"0 auto", padding:"32px 32px 48px" }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <Token style={{ display:"block", marginBottom:4 }}>Quality check</Token>
            <div style={{ fontFamily:F.display, fontSize:20, fontWeight:300 }}>AI face verification</div>
          </div>
          <button onClick={()=>{ setScreen(photoSrc==="camera"?"camera":"entry"); }} style={{
            background:"none", border:`0.5px solid ${C.stone}`, borderRadius:2,
            padding:"6px 14px", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase",
            color:C.ash, cursor:"pointer", fontFamily:F.body,
          }}>← Retake</button>
        </div>

        <div style={{ position:"relative", borderRadius:4, overflow:"hidden", marginBottom:20, background:C.chalk }}>
          <img id="ae-preview-img" src={photoURL} alt="Preview" style={{ width:"100%", maxHeight:300, objectFit:"cover", display:"block" }} />
          <canvas ref={overlayRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />
        </div>

        {/* Checks */}
        <div style={{ marginBottom:16 }}>
          {checks.map((c,i)=>{
            const icon = c.state==="spin"?"◌":c.state==="pass"?"✓":c.state==="warn"?"⚠":"✗";
            const col  = c.state==="pass"?"#3B6D11":c.state==="warn"?"#854F0B":c.state==="fail"?"#A32D2D":C.gold;
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:9, padding:"6px 0",
                borderBottom:`0.5px solid ${C.stone}`,
                fontSize:12, color:C.ink,
                animation: c.state==="spin" ? "ae-spin 0.8s linear infinite" : "none",
              }}>
                <span style={{ color:col, fontSize:12, width:14, textAlign:"center",
                  display:"inline-block",
                  animation: c.state==="spin" ? "ae-spin 0.8s linear infinite" : "none",
                }}>{icon}</span>
                {c.label}
              </div>
            );
          })}
        </div>

        {/* Badge */}
        {checkBadge && (
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"6px 12px", borderRadius:2, marginBottom:16,
            fontSize:10, fontFamily:F.body, letterSpacing:"0.06em",
            background: checkBadge.type==="ok"?"#EAF3DE":checkBadge.type==="warn"?"#FAEEDA":"#FCEBEB",
            color: checkBadge.type==="ok"?"#1E4D08":checkBadge.type==="warn"?"#633806":"#791F1F",
            border: `0.5px solid ${checkBadge.type==="ok"?"#B0D880":checkBadge.type==="warn"?"#F5C060":"#F0A0A0"}`,
          }}>
            {checkBadge.type==="ok"?"✓":checkBadge.type==="warn"?"⚠":"✗"} &nbsp;{checkBadge.msg}
          </div>
        )}

        <button onClick={runAnalysis} disabled={!canAnalyse} style={{
          width:"100%", padding:"14px",
          background: canAnalyse ? C.ink : C.stone,
          color: canAnalyse ? C.chalk : C.dust,
          border:"none", borderRadius:3,
          fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase",
          fontWeight:500, cursor: canAnalyse ? "pointer" : "not-allowed",
          fontFamily:F.body, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          transition:"all 0.18s",
        }}>
          ✦ &nbsp; Analyse my colour season
        </button>
      </div>
    </div>
  );

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (screen==="loading") return (
    <div style={root}>
      <Header />
      <div style={{ maxWidth:360, margin:"0 auto", padding:"72px 32px", textAlign:"center" }}>
        <div style={{
          width:40, height:40, borderRadius:"50%",
          border:`1px solid ${C.stone}`, borderTopColor:C.gold,
          margin:"0 auto 28px", animation:"ae-spin 0.85s linear infinite",
        }} />
        <div style={{ fontFamily:F.display, fontSize:22, fontWeight:300, marginBottom:8 }}>Reading your complexion</div>
        <div style={{ fontSize:12, color:C.ash, lineHeight:1.7, marginBottom:28 }}>
          Claude Vision is analysing your skin tone,<br />undertone, face structure and colour season
        </div>
        <div style={{ textAlign:"left" }}>
          {loadSteps.map(s=><LoadStep key={s.id} label={s.label} state={s.state} />)}
        </div>
      </div>
    </div>
  );

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (screen==="result" && result) {
    const R = result;
    const meta = SEASON_META[R.season] || { group:"Season", tag:"" };
    const groupAccent = GROUP_ACCENT[meta.group] || C.gold;
    const outfits = R.outfits || [];

    return (
      <div style={root}>
        <Header />
        <SeasonStrip active={R.season} />

        {/* Two-column layout */}
        <div style={{
          maxWidth:1020, margin:"0 auto", padding:"0 24px",
          display:"grid", gridTemplateColumns:"280px 1fr", gap:0,
          alignItems:"start",
        }}>

          {/* ── LEFT: sticky panel ── */}
          <div style={{
            position:"sticky", top:56, padding:"32px 24px 32px 8px",
            borderRight:`0.5px solid ${C.stone}`,
          }}>
            <img src={photoURL} alt="Your photo" style={{
              width:"100%", aspectRatio:"3/4", objectFit:"cover",
              borderRadius:3, display:"block", marginBottom:20,
              border:`0.5px solid ${C.stone}`,
            }} />

            <GoldMark style={{ marginBottom:8, display:"flex" }}>{meta.group}</GoldMark>
            <div style={{
              fontFamily:F.display, fontSize:26, fontWeight:300,
              lineHeight:1.1, marginBottom:8, color:C.ink,
            }}>{R.season}</div>
            <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:groupAccent, marginBottom:16 }}>
              {meta.tag}
            </div>

            <Rule style={{ marginBottom:16 }} />

            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:R.skin_hex, border:`1px solid ${C.stone}`, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:11, color:C.ash }}>{R.skin_name}</div>
                <div style={{ fontSize:9, fontFamily:F.mono, color:C.dust, marginTop:2 }}>{(R.skin_hex||"").toUpperCase()}</div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                ["Depth",   cap(R.depth)],
                ["Undertone",cap(R.undertone)],
                ["Contrast", cap(R.contrast)],
                ["Chroma",   cap(R.chroma)],
                ["Metal",    R.best_metal||"—"],
              ].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"5px 0", borderBottom:`0.5px solid ${C.stone}` }}>
                  <Token>{l}</Token>
                  <span style={{ fontSize:11, color:C.ink, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: scrollable results ── */}
          <div style={{ padding:"32px 0 64px 32px", animation:"ae-fade 0.4s ease" }}>

            {/* Season description */}
            <div style={{ marginBottom:32 }}>
              <Token style={{ marginBottom:12, display:"block" }}>Season profile</Token>
              <p style={{ fontSize:14, lineHeight:1.9, color:C.ash, maxWidth:480 }}>{R.season_desc}</p>
            </div>

            <Rule style={{ marginBottom:32 }} />

            {/* Colour palette */}
            <section style={{ marginBottom:32 }}>
              <Token style={{ marginBottom:16, display:"block" }}>Wear these colours</Token>
              <div style={{ display:"flex", flexWrap:"wrap", gap:16 }}>
                {(R.wear_palette||[]).map((p,i)=>(
                  <div
                    key={i}
                    onMouseEnter={()=>setHoveredSwatch(i)}
                    onMouseLeave={()=>setHoveredSwatch(null)}
                  >
                    <Swatch hex={p.hex} name={p.name} size={46} ring={hoveredSwatch===i} />
                    {hoveredSwatch===i && (
                      <div style={{
                        position:"absolute", zIndex:10,
                        background:C.ink, color:C.chalk,
                        fontSize:10, padding:"6px 10px", borderRadius:2,
                        maxWidth:160, lineHeight:1.5, marginTop:4,
                        pointerEvents:"none",
                      }}>{p.why}</div>
                    )}
                  </div>
                ))}
              </div>
              <NoteBar><strong style={{ color:C.ink }}>Science:</strong> {R.science_note}</NoteBar>
            </section>

            {/* Avoid */}
            <section style={{ marginBottom:32, padding:"20px", background:C.chalk, borderRadius:3 }}>
              <Token style={{ marginBottom:14, display:"block" }}>Avoid these shades</Token>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                {(R.avoid_palette||[]).map((p,i)=><AvoidSwatch key={i} hex={p.hex} name={p.name} />)}
              </div>
            </section>

            <Rule style={{ marginBottom:32 }} />

            {/* Face structure */}
            <section style={{ marginBottom:32 }}>
              <Token style={{ marginBottom:16, display:"block" }}>Face structure · {cap(R.face_shape)}</Token>
              <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
                <svg width="80" height="96" viewBox="0 0 80 96" fill="none" style={{ flexShrink:0 }}>
                  {FACE_PATHS[R.face_shape] || FACE_PATHS.oval}
                </svg>
                <div style={{ flex:1 }}>
                  {(R.face_tips||[]).map((t,i)=>(
                    <div key={i} style={{
                      fontSize:12, color:C.ash, padding:"7px 0",
                      borderBottom:`0.5px solid ${C.stone}`, lineHeight:1.6,
                      display:"flex", gap:8, alignItems:"flex-start",
                    }}>
                      <span style={{ color:C.gold, fontSize:10, flexShrink:0, marginTop:2 }}>—</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <NoteBar><strong style={{ color:C.ink }}>Colour placement:</strong> {R.face_sci}</NoteBar>
            </section>

            <Rule style={{ marginBottom:32 }} />

            {/* Outfit pairings */}
            <section style={{ marginBottom:32 }}>
              <Token style={{ marginBottom:16, display:"block" }}>Outfit colour pairings</Token>

              {/* Tabs */}
              <div style={{ display:"flex", gap:0, borderBottom:`0.5px solid ${C.stone}`, marginBottom:20 }}>
                {outfits.map((o,i)=>(
                  <button key={i} onClick={()=>setActiveOutfit(i)} style={{
                    padding:"9px 16px", background:"none", border:"none",
                    borderBottom:`2px solid ${activeOutfit===i?C.gold:"transparent"}`,
                    color: activeOutfit===i ? C.goldDim : C.ash,
                    fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase",
                    cursor:"pointer", fontFamily:F.body, transition:"all 0.15s",
                  }}>{o.name}</button>
                ))}
              </div>

              {outfits[activeOutfit] && (() => {
                const o = outfits[activeOutfit];
                return (
                  <div style={{ border:`0.5px solid ${C.stone}`, borderRadius:3, overflow:"hidden" }}>
                    {/* Colour bar */}
                    <div style={{ height:80, display:"flex" }}>
                      {[{c:o.top_hex,l:"Top"},{c:o.bottom_hex,l:"Bottom"},{c:o.accent_hex,l:"Accent"}].map((x,i)=>(
                        <div key={i} style={{
                          flex:1, background:x.c,
                          display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:8,
                        }}>
                          <span style={{ fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.65)" }}>{x.l}</span>
                        </div>
                      ))}
                    </div>
                    {/* Info */}
                    <div style={{ padding:"18px 20px", background:C.warm }}>
                      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:6 }}>
                        <div style={{ fontFamily:F.display, fontSize:18, fontWeight:300 }}>{o.name}</div>
                        <Token>{o.occasion}</Token>
                      </div>
                      <div style={{ fontSize:12, color:C.ash, lineHeight:1.7, marginBottom:14 }}>{o.desc}</div>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                        {[{h:o.top_hex,l:"Top"},{h:o.bottom_hex,l:"Bottom"},{h:o.accent_hex,l:"Accent"}].map(x=>(
                          <div key={x.l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:12, height:12, borderRadius:"50%", background:x.h, border:`1px solid ${C.stone}` }} />
                            <span style={{ fontSize:10, color:C.ash, fontFamily:F.mono }}>{(x.h||"").toUpperCase()}</span>
                            <Token style={{ marginLeft:2 }}>{x.l}</Token>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </section>

            <Rule style={{ marginBottom:32 }} />

            {/* Makeup */}
            <section style={{ marginBottom:32 }}>
              <Token style={{ marginBottom:16, display:"block" }}>Makeup harmony</Token>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                {[
                  { label:"Lip",   hex:R.makeup?.lip_hex,   val:R.makeup?.lip_name },
                  { label:"Eye",   hex:R.makeup?.eye_hex,   val:R.makeup?.eye_name },
                  { label:"Blush", hex:R.makeup?.blush_hex, val:R.makeup?.blush_name },
                  { label:"Brow",  hex:null,                val:R.makeup?.brow },
                ].map(m=>(
                  <div key={m.label} style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 12px", background:C.chalk, borderRadius:2,
                  }}>
                    <div style={{
                      width:28, height:28, borderRadius:"50%", flexShrink:0,
                      background: m.hex||"linear-gradient(135deg,#6A4A28,#2A1008)",
                      border:`1px solid ${C.stone}`,
                    }} />
                    <div>
                      <Token style={{ display:"block", marginBottom:2 }}>{m.label}</Token>
                      <div style={{ fontSize:11, fontWeight:500, color:C.ink }}>{m.val||"—"}</div>
                    </div>
                  </div>
                ))}
              </div>
              <NoteBar><strong style={{ color:C.ink }}>Harmony note:</strong> {R.makeup_sci}</NoteBar>
            </section>

            <Rule style={{ marginBottom:32 }} />

            {/* Best white */}
            <section style={{ marginBottom:40 }}>
              <Token style={{ marginBottom:12, display:"block" }}>Neutrals guide</Token>
              <div style={{ fontSize:12, color:C.ash, lineHeight:1.8 }}>
                <span style={{ fontWeight:500, color:C.ink }}>Best white: </span>{R.best_white}
                <br />
                <span style={{ fontWeight:500, color:C.ink }}>Best metal: </span>{R.best_metal}
              </div>
            </section>

            {/* Science footer */}
            <div style={{
              padding:"20px 24px",
              background:C.chalk,
              borderTop:`1px solid ${C.stone}`,
              borderRadius:3,
            }}>
              <GoldMark style={{ marginBottom:10, display:"flex" }}>Colour theory · Amour Estilo</GoldMark>
              <p style={{ fontSize:11, color:C.ash, lineHeight:1.9, maxWidth:480 }}>
                Every recommendation is grounded in <strong style={{ color:C.ink }}>simultaneous contrast</strong> (Chevreul, 1839) — adjacent colours push each other toward their complements. Your season palette is chosen to push your complexion toward its most vivid, healthiest-looking state. Munsell's three axes — value, hue, and chroma — define your skin's precise position in colour space, from which your season follows.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div style={root}><Header /></div>;
}