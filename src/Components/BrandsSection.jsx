import { useState } from "react";

// ─── Design tokens (matching AmourEstiloHomePage) ──────────────────────────
const C = {
  black:  "#0a0a0a",
  white:  "#ffffff",
  g1:     "#2a2a2a",
  g3:     "#6b6b6b",
  g4:     "#9a9a9a",
  g5:     "#c8c8c8",
  g6:     "#f0efed",
  border: "#e8e8e8",
  serif:  "'Cormorant Garamond', serif",
  sans:   "'Montserrat', sans-serif",
};

// ─── Brand SVG wordmarks ───────────────────────────────────────────────────
const BRANDS = [
  {
    name: "MAC", category: "Professional",
    svg: <svg viewBox="0 0 100 36" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',Arial,sans-serif",fontWeight:700,fontSize:22,letterSpacing:"0.16em",fill:"currentColor"}}>M·A·C</text></svg>,
  },
  {
    name: "Charlotte Tilbury", category: "Luxury",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:10,letterSpacing:"0.38em",fill:"currentColor"}}>CHARLOTTE</text><text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:10,letterSpacing:"0.38em",fill:"currentColor"}}>TILBURY</text></svg>,
  },
  {
    name: "NARS", category: "Professional",
    svg: <svg viewBox="0 0 100 36" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',Arial,sans-serif",fontWeight:700,fontSize:24,letterSpacing:"0.22em",fill:"currentColor"}}>NARS</text></svg>,
  },
  {
    name: "Huda Beauty", category: "Prestige",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontWeight:400,fontStyle:"italic",fontSize:18,letterSpacing:"0.06em",fill:"currentColor"}}>Huda</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:8,letterSpacing:"0.45em",fill:"currentColor"}}>BEAUTY</text></svg>,
  },
  {
    name: "Armani Beauty", category: "Couture",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:12,letterSpacing:"0.4em",fill:"currentColor"}}>ARMANI</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:8,letterSpacing:"0.4em",fill:"currentColor"}}>BEAUTY</text></svg>,
  },
  {
    name: "Dior Beauty", category: "Haute Couture",
    svg: <svg viewBox="0 0 100 36" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:400,fontSize:22,letterSpacing:"0.3em",fill:"currentColor"}}>DIOR</text></svg>,
  },
  {
    name: "Bobbi Brown", category: "Professional",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.28em",fill:"currentColor"}}>BOBBI</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.28em",fill:"currentColor"}}>BROWN</text></svg>,
  },
  {
    name: "Chanel", category: "Haute Couture",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="34%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontSize:11,fill:"currentColor",opacity:0.5}}>✦</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:13,letterSpacing:"0.5em",fill:"currentColor"}}>CHANEL</text></svg>,
  },
  {
    name: "Urban Decay", category: "Editorial",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.3em",fill:"currentColor"}}>URBAN</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.3em",fill:"currentColor"}}>DECAY</text></svg>,
  },
  {
    name: "Make Up For Ever", category: "Cinema & Film",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="35%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.14em",fill:"currentColor"}}>MAKE UP</text><text x="50%" y="66%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:11,letterSpacing:"0.08em",fill:"currentColor"}}>FOR EVER</text></svg>,
  },
  {
    name: "Lancôme", category: "Prestige",
    svg: <svg viewBox="0 0 150 36" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:400,fontSize:17,letterSpacing:"0.22em",fill:"currentColor"}}>LANCÔME</text></svg>,
  },
  {
    name: "Pat McGrath Labs", category: "Artistry",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:14,letterSpacing:"0.06em",fill:"currentColor"}}>Pat McGrath</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:7,letterSpacing:"0.45em",fill:"currentColor"}}>LABS</text></svg>,
  },
  // ── 18 new brands ──
  {
    name: "Estée Lauder", category: "Heritage Luxe",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:13,letterSpacing:"0.08em",fill:"currentColor"}}>Estée Lauder</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontSize:7,letterSpacing:"0.35em",fill:"currentColor",opacity:0.6}}>NEW YORK · PARIS</text></svg>,
  },
  {
    name: "Tom Ford Beauty", category: "Couture",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:11,letterSpacing:"0.38em",fill:"currentColor"}}>TOM FORD</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:8,letterSpacing:"0.42em",fill:"currentColor"}}>BEAUTY</text></svg>,
  },
  {
    name: "YSL Beauté", category: "Haute Couture",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:18,letterSpacing:"0.18em",fill:"currentColor"}}>YSL</text><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:7,letterSpacing:"0.42em",fill:"currentColor"}}>BEAUTÉ</text></svg>,
  },
  {
    name: "Hourglass", category: "Editorial",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:13,letterSpacing:"0.32em",fill:"currentColor"}}>HOURGLASS</text></svg>,
  },
  {
    name: "Laura Mercier", category: "Skin Specialist",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:13,letterSpacing:"0.06em",fill:"currentColor"}}>Laura Mercier</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:6,letterSpacing:"0.38em",fill:"currentColor"}}>PARIS · NEW YORK</text></svg>,
  },
  {
    name: "Kryolan", category: "Stage & Film",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:15,letterSpacing:"0.28em",fill:"currentColor"}}>KRYOLAN</text></svg>,
  },
  {
    name: "Kevyn Aucoin", category: "Artistry",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:12,letterSpacing:"0.08em",fill:"currentColor"}}>Kevyn Aucoin</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:6,letterSpacing:"0.38em",fill:"currentColor"}}>BEAUTY & WELLNESS</text></svg>,
  },
  {
    name: "Guerlain", category: "Heritage Luxe",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontSize:7,letterSpacing:"0.38em",fill:"currentColor",opacity:0.55}}>MAISON FONDÉE EN 1828</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:400,fontSize:15,letterSpacing:"0.28em",fill:"currentColor"}}>GUERLAIN</text></svg>,
  },
  {
    name: "Viseart", category: "Pro Palette",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:16,letterSpacing:"0.36em",fill:"currentColor"}}>VISEART</text></svg>,
  },
  {
    name: "Westman Atelier", category: "Clean Luxe",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:11,letterSpacing:"0.28em",fill:"currentColor"}}>WESTMAN</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:11,letterSpacing:"0.28em",fill:"currentColor"}}>ATELIER</text></svg>,
  },
  {
    name: "Givenchy Beauty", category: "Haute Couture",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:12,letterSpacing:"0.38em",fill:"currentColor"}}>GIVENCHY</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:7,letterSpacing:"0.42em",fill:"currentColor"}}>BEAUTY</text></svg>,
  },
  {
    name: "Stila", category: "Editorial",
    svg: <svg viewBox="0 0 100 36" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontWeight:400,fontSize:26,letterSpacing:"0.08em",fill:"currentColor"}}>stila</text></svg>,
  },
  {
    name: "Danessa Myricks", category: "Artistry",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:12,letterSpacing:"0.06em",fill:"currentColor"}}>Danessa Myricks</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:6,letterSpacing:"0.42em",fill:"currentColor"}}>BEAUTY</text></svg>,
  },
  {
    name: "Ben Nye", category: "Stage & Film",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:16,letterSpacing:"0.1em",fill:"currentColor"}}>Ben Nye</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:6,letterSpacing:"0.38em",fill:"currentColor"}}>PROFESSIONAL MAKEUP</text></svg>,
  },
  {
    name: "Iconic London", category: "Editorial",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.36em",fill:"currentColor"}}>ICONIC</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:11,letterSpacing:"0.36em",fill:"currentColor"}}>LONDON</text></svg>,
  },
  {
    name: "Inglot", category: "Pro Palette",
    svg: <svg viewBox="0 0 150 36" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:700,fontSize:20,letterSpacing:"0.22em",fill:"currentColor"}}>INGLOT</text></svg>,
  },
  {
    name: "Rhode", category: "Clean Luxe",
    svg: <svg viewBox="0 0 100 36" style={{width:"100%",height:"100%"}}><text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontWeight:400,fontSize:22,letterSpacing:"0.1em",fill:"currentColor"}}>rhode</text></svg>,
  },
  {
    name: "Patrick Ta", category: "Artistry",
    svg: <svg viewBox="0 0 150 44" style={{width:"100%",height:"100%"}}><text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:15,letterSpacing:"0.06em",fill:"currentColor"}}>Patrick Ta</text><text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,fontSize:6,letterSpacing:"0.42em",fill:"currentColor"}}>BEAUTY</text></svg>,
  },
];

function BrandTile({ brand }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 190,
        height: 88,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRight: `0.5px solid ${C.border}`,
        padding: "0 18px",
        gap: 5,
        background: hov ? C.g6 : C.white,
        transition: "background 0.3s",
        cursor: "default",
      }}
    >
      <div style={{
        width: 140, height: 42,
        color: hov ? C.black : C.g4,
        transition: "color 0.35s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {brand.svg}
      </div>
      <span style={{
        fontFamily: C.sans, fontWeight: 300, fontSize: "0.46rem",
        letterSpacing: "0.3em", textTransform: "uppercase",
        color: hov ? C.g3 : "transparent",
        transition: "color 0.3s", whiteSpace: "nowrap",
      }}>
        {brand.category}
      </span>
    </div>
  );
}

function MarqueeRow({ brands, speed = 40, reverse = false }) {
  const doubled = [...brands, ...brands];
  return (
    <div style={{
      overflow: "hidden", width: "100%",
      maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
    }}>
      <div style={{
        display: "flex", width: "max-content",
        animation: `${reverse ? "marqueeRev" : "marquee"} ${speed}s linear infinite`,
      }}>
        {doubled.map((b, i) => <BrandTile key={i} brand={b} />)}
      </div>
    </div>
  );
}

export default function BrandsSection() {
  // Split 30 brands into 3 rows of 10
  const row1 = BRANDS.slice(0, 10);
  const row2 = BRANDS.slice(10, 20);
  const row3 = BRANDS.slice(20, 30);

  return (
    <section style={{
      background: C.white,
      borderTop: `0.5px solid ${C.border}`,
      borderBottom: `0.5px solid ${C.border}`,
      padding: "80px 0 72px",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes marquee    { from{transform:translateX(0)}    to{transform:translateX(-50%)} }
        @keyframes marqueeRev { from{transform:translateX(-50%)} to{transform:translateX(0)}    }
      `}</style>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 52, padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 18 }}>
          <div style={{ flex: 1, maxWidth: 72, height: "0.5px", background: C.g5 }} />
          <span style={{ fontFamily: C.sans, fontWeight: 300, fontSize: "0.58rem", letterSpacing: "0.42em", textTransform: "uppercase", color: C.g4 }}>
            Les Maisons
          </span>
          <div style={{ flex: 1, maxWidth: 72, height: "0.5px", background: C.g5 }} />
        </div>

        <h2 style={{
          fontFamily: C.serif, fontWeight: 300,
          fontSize: "clamp(2rem,4vw,3.4rem)",
          lineHeight: 1.08, color: C.black,
          letterSpacing: "-0.01em", margin: "0 0 14px",
        }}>
          Brands We <em style={{ fontStyle: "italic" }}>Trust</em>
        </h2>

        <p style={{
          fontFamily: C.sans, fontWeight: 300, fontSize: "0.72rem",
          letterSpacing: "0.04em", color: C.g3, lineHeight: 2,
          maxWidth: 440, margin: "0 auto",
        }}>
          Only the world's finest formulations — curated for performance, precision, and lasting artistry.
        </p>
      </div>

      {/* ── Three Marquee rows ── */}
      <div style={{ borderTop: `0.5px solid ${C.border}`, borderBottom: `0.5px solid ${C.border}` }}>
        <MarqueeRow brands={row1} speed={38} reverse={false} />
      </div>
      <div style={{ borderBottom: `0.5px solid ${C.border}` }}>
        <MarqueeRow brands={row2} speed={46} reverse={true} />
      </div>
      <div style={{ borderBottom: `0.5px solid ${C.border}` }}>
        <MarqueeRow brands={row3} speed={40} reverse={false} />
      </div>

      {/* ── Tags row ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 28, marginTop: 44, padding: "0 24px", flexWrap: "wrap",
      }}>
        {["Professional Grade", "Skin-Safe Certified", "HD & Camera Ready", "Long-Lasting Formulas"].map((tag, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.g5 }} />
            <span style={{ fontFamily: C.sans, fontWeight: 300, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: C.g4 }}>
              {tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}