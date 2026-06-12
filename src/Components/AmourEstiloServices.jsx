import { useEffect, useRef, useState, useCallback } from "react";

const data = [
  {
    eye: "01 · Bridal & Shaadi",
    title: ["Weddings that", "transcend"],
    sub: "India & Abroad",
    desc: "From intimate ceremonies to grand destination weddings — flawless artistry for your most important day.",
    rt: "Bridal & Shaadi",
  },
  {
    eye: "02 · Film & OTT",
    title: ["Screen-ready", "beauty"],
    sub: "Cinema · Web Series · Television",
    desc: "Camera-precision looks crafted with directors, DPs and production houses across the country.",
    rt: "Film & OTT",
  },
  {
    eye: "03 · Fashion & Editorial",
    title: ["Where beauty", "becomes art"],
    sub: "Photoshoots & Magazine Looks",
    desc: "High-concept editorial vision for fashion shoots, lookbooks and magazine covers.",
    rt: "Fashion & Editorial",
  },
  {
    eye: "04 · Ad Films & Campaigns",
    title: ["Beauty that", "sells"],
    sub: "Commercial & Brand Productions",
    desc: "From hero shots to full campaign productions — brand beauty that performs on camera.",
    rt: "Ad Films",
  },
  {
    eye: "05 · Corporate & Events",
    title: ["Presence that", "commands"],
    sub: "Galas · Conferences · Mehfils",
    desc: "Polished, confident beauty for keynotes, award ceremonies and luxury events.",
    rt: "Corporate & Events",
  },
  {
    eye: "06 · On-Demand Worldwide",
    title: ["Beauty knows", "no borders"],
    sub: "Pan India · Fly Anywhere",
    desc: "Wherever your vision takes you — we travel. Pan India and international bookings on request.",
    rt: "On-Demand Worldwide",
  },
];

function BridalFX() {
  return (
    <>
      {[...Array(14)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: "5px", height: "9px",
          borderRadius: "50% 0 50% 0",
          background: "#C9B99A",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 20}%`,
          animation: `petalfall ${2.5 + Math.random() * 2}s ease-in ${Math.random() * 3}s infinite`,
          opacity: 0,
        }} />
      ))}
      {[300, 500].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: size, height: size,
          borderRadius: "50%",
          border: "1px solid rgba(201,185,154,0.3)",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          animation: `ringpulse ${4 + i * 2}s ease ${i}s infinite`,
        }} />
      ))}
    </>
  );
}

function FilmFX() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 0.4, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")" }} />
      <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.05)", animation: "scandown 3s linear infinite" }} />
      {[["top:20px;left:20px", "1px 0 0 1px"], ["top:20px;right:20px", "1px 1px 0 0"], ["bottom:60px;left:20px", "0 0 1px 1px"], ["bottom:60px;right:20px", "0 1px 1px 0"]].map(([pos, bw], i) => (
        <div key={i} style={{ position: "absolute", width: 20, height: 20, borderColor: "rgba(201,185,154,0.3)", borderStyle: "solid", borderWidth: bw, ...Object.fromEntries(pos.split(";").map(p => p.split(":"))) }} />
      ))}
      <div style={{ position: "absolute", top: 24, right: 28, display: "flex", alignItems: "center", gap: 5, fontSize: 8, letterSpacing: ".15em", color: "rgba(255,100,80,0.7)" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E24B4A", animation: "blink 1s ease infinite" }} />
        REC
      </div>
    </>
  );
}

function FashionFX() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(245,240,235,0.03)", animation: "flash 2s ease infinite" }} />
      {["25%", "75%"].map((t, i) => <div key={i} style={{ position: "absolute", top: t, left: 0, right: 0, height: ".5px", background: "rgba(201,185,154,0.08)" }} />)}
      {["30%", "70%"].map((l, i) => <div key={i} style={{ position: "absolute", left: l, top: 0, bottom: 0, width: ".5px", background: "rgba(201,185,154,0.08)" }} />)}
    </>
  );
}

function AdFX() {
  return (
    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "80px solid transparent", borderRight: "80px solid transparent", borderTop: "200px solid rgba(201,185,154,0.06)", animation: "spotpulse 2.5s ease infinite" }} />
  );
}

function CorpFX() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {["20%","40%","60%","80%"].map((v, i) => (
        <div key={`h${i}`} style={{ position: "absolute", top: v, left: 0, right: 0, height: ".5px", background: "rgba(201,185,154,0.05)" }} />
      ))}
      {["20%","40%","60%","80%"].map((v, i) => (
        <div key={`v${i}`} style={{ position: "absolute", left: v, top: 0, bottom: 0, width: ".5px", background: "rgba(201,185,154,0.05)" }} />
      ))}
    </div>
  );
}

function GlobeFX() {
  return (
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-60%)" }}>
      <div style={{ width: 90, height: 90, borderRadius: "50%", border: ".5px solid rgba(201,185,154,0.2)", position: "relative" }}>
        <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: ".5px dashed rgba(201,185,154,0.12)", animation: "orbitspin 5s linear infinite" }}>
          <div style={{ position: "absolute", top: 2, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: "#C9B99A", boxShadow: "0 0 6px rgba(201,185,154,0.5)" }} />
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 8, height: 8, borderRadius: "50%", border: ".5px solid #C9B99A", animation: "ping 2s ease infinite", transform: "translate(-50%,-50%)" }} />
      </div>
    </div>
  );
}

const fxComponents = [BridalFX, FilmFX, FashionFX, AdFX, CorpFX, GlobeFX];

export default function AmourEstiloServices() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(0);
  const wheelLock = useRef(false);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);

  const go = useCallback((i) => {
    if (i === current) return;
    setVisible(false);
    setTimeout(() => {
      setDisplay(i);
      setCurrent(i);
      setVisible(true);
    }, 350);
  }, [current]);

  useEffect(() => {
    const onWheel = (e) => {
      if (wheelLock.current) return;
      wheelLock.current = true;
      setTimeout(() => wheelLock.current = false, 700);
      if (e.deltaY > 0 && current < 5) go(current + 1);
      else if (e.deltaY < 0 && current > 0) go(current - 1);
    };
    window.addEventListener("wheel", onWheel);
    return () => window.removeEventListener("wheel", onWheel);
  }, [current, go]);

  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + "px"; cursorRef.current.style.top = e.clientY + "px"; }
      setTimeout(() => { if (cursorRingRef.current) { cursorRingRef.current.style.left = e.clientX + "px"; cursorRingRef.current.style.top = e.clientY + "px"; } }, 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const d = data[display];
  const FX = fxComponents[display];

  return (
    <section style={s.stage}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400..900&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
        @keyframes petalfall { 0%{opacity:0;transform:translateY(-20px) rotate(0deg)} 15%{opacity:.7} 85%{opacity:.3} 100%{opacity:0;transform:translateY(110vh) rotate(360deg) translateX(40px)} }
        @keyframes ringpulse { 0%,100%{opacity:.3;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.6;transform:translate(-50%,-50%) scale(1.05)} }
        @keyframes scandown { 0%{top:0} 100%{top:100%} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes flash { 0%,100%{opacity:0} 50%{opacity:1} }
        @keyframes spotpulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes orbitspin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ping { 0%{transform:translate(-50%,-50%) scale(1);opacity:.7} 100%{transform:translate(-50%,-50%) scale(4);opacity:0} }
      `}</style>

      {/* Custom cursor */}
      <div ref={cursorRef} style={s.cursor} />
      <div ref={cursorRingRef} style={s.cursorRing} />

      {/* FX Layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", opacity: visible ? 1 : 0, transition: "opacity .6s ease" }}>
        <FX />
      </div>

      {/* Big BG number */}
      <div style={{ ...s.bgNum, opacity: visible ? 1 : 0, transition: "opacity .4s ease" }}>
        {String(display + 1).padStart(2, "0")}
      </div>

      <div style={s.topLabel}>Amour Estilo · Our Services</div>

      {/* Center content */}
      <div style={s.center}>
        <span style={{ ...s.cEye, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all .5s ease .1s" }}>{d.eye}</span>
        <div style={{ ...s.cDivider, width: visible ? 120 : 0, transition: "width .8s ease .3s" }} />
        <h2 style={{ ...s.cTitle, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all .6s ease .15s" }}>
          {d.title[0]}<br /><em style={{ fontStyle: "italic", color: "#C9B99A" }}>{d.title[1]}</em>
        </h2>
        <p style={{ ...s.cSub, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all .5s ease .2s" }}>{d.sub}</p>
        <p style={{ ...s.cDesc, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: "all .5s ease .25s" }}>{d.desc}</p>
      </div>

      {/* Left nav */}
      <nav style={s.nav}>
        {data.map((_, i) => (
          <div key={i} onClick={() => go(i)} style={s.navItem}>
            <span style={{ ...s.navNum, color: current === i ? "#C9B99A" : "#2e2620" }}>{String(i + 1).padStart(2, "0")}</span>
            <div style={{ ...s.navLine, width: current === i ? 24 : 0 }} />
          </div>
        ))}
      </nav>

      {/* Right info */}
      <div style={s.rightInfo}>
        <div style={s.riCounter}>{String(current + 1).padStart(2, "0")} / 06</div>
        <div style={s.riTitle}>{d.rt}</div>
      </div>

      {/* Bottom bar */}
      <div style={s.bottomBar}>
        <span style={s.bbLeft}>Amour Estilo</span>
        <a href="/contact" style={s.bbCta}>Book a Consultation →</a>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {data.map((_, i) => (
            <div key={i} onClick={() => go(i)} style={{ ...s.bbDot, width: current === i ? 18 : 5, background: current === i ? "#C9B99A" : "rgba(201,185,154,0.2)", borderRadius: current === i ? 3 : "50%", cursor: "pointer", transition: "all .3s" }} />
          ))}
        </div>
      </div>
    </section>
  );
}

const s = {
  stage: { background: "#0A0A0A", minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Bodoni Moda', Georgia, serif", cursor: "none" },
  cursor: { position: "fixed", width: 8, height: 8, background: "#C9B99A", borderRadius: "50%", pointerEvents: "none", zIndex: 999, transform: "translate(-50%,-50%)", transition: "transform .15s ease" },
  cursorRing: { position: "fixed", width: 32, height: 32, border: ".5px solid rgba(201,185,154,0.4)", borderRadius: "50%", pointerEvents: "none", zIndex: 998, transform: "translate(-50%,-50%)", transition: "transform .4s ease" },
  bgNum: { position: "absolute", fontSize: "320px", fontWeight: 400, color: "rgba(201,185,154,0.03)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 1, lineHeight: 1, fontStyle: "italic" },
  topLabel: { position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", fontSize: 9, letterSpacing: ".4em", color: "rgba(201,185,154,0.35)", textTransform: "uppercase", zIndex: 10, whiteSpace: "nowrap" },
  center: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, textAlign: "center", pointerEvents: "none", padding: "0 120px" },
  cEye: { fontSize: 9, letterSpacing: ".4em", color: "#8C7355", textTransform: "uppercase" },
  cDivider: { height: ".5px", background: "linear-gradient(to right, transparent, #C9B99A, transparent)", margin: "20px auto" },
  cTitle: { fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, color: "#F5F0EB", lineHeight: 1, margin: "0 0 12px" },
  cSub: { fontSize: 11, letterSpacing: ".18em", color: "rgba(201,185,154,0.5)", textTransform: "uppercase" },
  cDesc: { fontSize: 13, color: "rgba(245,240,235,0.4)", maxWidth: 340, lineHeight: 1.8, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, marginTop: 20, fontStyle: "italic" },
  nav: { position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", flexDirection: "column", gap: 0 },
  navItem: { display: "flex", alignItems: "center", gap: 14, padding: "10px 0", cursor: "pointer" },
  navNum: { fontSize: 9, letterSpacing: ".2em", transition: "color .3s", fontFamily: "'Bodoni Moda', Georgia, serif" },
  navLine: { height: ".5px", background: "#C9B99A", transition: "width .4s ease" },
  rightInfo: { position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", zIndex: 10, textAlign: "right" },
  riCounter: { fontSize: 9, letterSpacing: ".2em", color: "rgba(201,185,154,0.25)", marginBottom: 8 },
  riTitle: { fontSize: 10, letterSpacing: ".15em", color: "rgba(201,185,154,0.4)", textTransform: "uppercase", maxWidth: 120, lineHeight: 1.6 },
  bottomBar: { position: "absolute", bottom: 36, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px 0", zIndex: 10, borderTop: ".5px solid rgba(201,185,154,0.08)" },
  bbLeft: { fontSize: 9, letterSpacing: ".2em", color: "rgba(201,185,154,0.25)", textTransform: "uppercase" },
  bbCta: { fontSize: 9, letterSpacing: ".3em", color: "#0A0A0A", background: "#C9B99A", padding: "12px 28px", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Bodoni Moda', Georgia, serif" },
  bbDot: { height: 5 },
};