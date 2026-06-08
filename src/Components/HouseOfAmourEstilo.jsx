/**
 * HouseOfAmourEstilo — Skin Assessment
 * ─────────────────────────────────────
 * React + Material UI (v5)
 * Design: Dior / Chanel / Apple — Black · White · Ash Gray
 * High contrast · Maximum legibility · Luxury minimal
 *
 * npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
 *
 * Google Fonts in index.html:
 * <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
 */

import React, { useState, useCallback, useEffect } from "react";
import {
  Box, Typography, Grid, Button, Slider, Container,
  ThemeProvider, createTheme, GlobalStyles,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// ─────────────────────────────────────────────────────────────────
// THEME  — Apple/Dior level contrast ratios
// ─────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    text: { primary: "#0A0A0A", secondary: "#1A1A1A" },
    primary: { main: "#0A0A0A", contrastText: "#FFFFFF" },
    secondary: { main: "#B8966E" },
    divider: "#E0E0E0",
  },
  typography: {
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    h1: { fontFamily: "'Cormorant', serif", fontWeight: 300 },
    h2: { fontFamily: "'Cormorant', serif", fontWeight: 300 },
    h3: { fontFamily: "'Cormorant', serif", fontWeight: 300 },
    h4: { fontFamily: "'Cormorant', serif", fontWeight: 300 },
    h5: { fontFamily: "'Cormorant', serif", fontWeight: 400 },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiButton:  { defaultProps: { disableElevation: true } },
    MuiPaper:   { defaultProps: { elevation: 0 } },
  },
});

// ─────────────────────────────────────────────────────────────────
// KEYFRAMES
// ─────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity:0; } to { opacity:1; }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ─────────────────────────────────────────────────────────────────
// STYLED
// ─────────────────────────────────────────────────────────────────
const Wrap = styled(Box)({
  background: "#FFFFFF",
  minHeight: "100vh",
  position: "relative",
});

// NAV
const Nav = styled(Box)({
  position: "fixed", top: 0, left: 0, right: 0,
  zIndex: 200,
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(24px)",
  borderBottom: "1px solid #E0E0E0",
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 40px",
});

// Progress track
const ProgressTrack = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 3,
  marginBottom: 52,
});
const ProgressBar = styled(Box)(({ state }) => ({
  height: 2,
  background: state === "done" ? "#0A0A0A"
            : state === "active" ? "#B8966E"
            : "#E0E0E0",
  transition: "background 0.4s ease",
}));

// OPTION BUTTON — the critical interaction element
const OptBtn = styled(Box)(({ selected }) => ({
  padding: "18px 16px 16px",
  border: `1.5px solid ${selected ? "#0A0A0A" : "#D8D8D8"}`,
  background: selected ? "#0A0A0A" : "#FFFFFF",
  cursor: "pointer",
  userSelect: "none",
  transition: "all 0.18s ease",
  position: "relative",
  "&:hover": {
    borderColor: "#0A0A0A",
    background: selected ? "#0A0A0A" : "#F7F7F7",
  },
}));

const OptGlyph = styled(Typography)(({ selected }) => ({
  fontFamily: "'Cormorant', serif",
  fontSize: 10,
  fontStyle: "italic",
  letterSpacing: "0.18em",
  color: selected ? "#B8966E" : "#B0B0B0",
  marginBottom: 6,
  lineHeight: 1,
  textTransform: "uppercase",
}));

const OptName = styled(Typography)(({ selected }) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12.5,
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: selected ? "#FFFFFF" : "#0A0A0A",
  lineHeight: 1.3,
  marginBottom: 3,
}));

const OptSub = styled(Typography)(({ selected }) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  fontWeight: 300,
  color: selected ? "#A0A0A0" : "#555555",
  lineHeight: 1.45,
  letterSpacing: "0.02em",
}));

// Primary Button — Apple-level
const PrimaryBtn = styled(Button)({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  background: "#0A0A0A",
  color: "#FFFFFF",
  padding: "14px 44px",
  borderRadius: 0,
  "&:hover": { background: "#1E1E1E" },
});

// Ghost Button
const GhostBtn = styled(Button)({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  background: "transparent",
  color: "#555555",
  border: "1.5px solid #D0D0D0",
  padding: "14px 32px",
  borderRadius: 0,
  "&:hover": { borderColor: "#0A0A0A", color: "#0A0A0A", background: "transparent" },
});

// BOOK FREE TRIAL — gold shimmer CTA
const TrialBtn = styled(Button)({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  background: "linear-gradient(90deg, #C4A265, #E8C98A, #B8966E, #E8C98A, #C4A265)",
  backgroundSize: "200% auto",
  color: "#0A0A0A",
  padding: "16px 40px",
  borderRadius: 0,
  animation: `${shimmer} 3s linear infinite`,
  border: "none",
  "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
  transition: "opacity 0.2s, transform 0.2s",
});

// Result Hero — dark
const ResultHero = styled(Box)({
  background: "#0A0A0A",
  padding: "64px 56px",
  marginBottom: 1,
  animation: `${fadeUp} 0.6s ease`,
});

// Metric cell
const MetricCell = styled(Box)({
  background: "#FFFFFF",
  padding: "24px 20px",
  borderRight: "1px solid #EEEEEE",
  "&:last-child": { borderRight: "none" },
});

// Product type card
const ProductCard = styled(Box)({
  background: "#FAFAFA",
  border: "1px solid #EBEBEB",
  padding: "24px 20px",
  transition: "all 0.2s ease",
  animation: `${fadeUp} 0.5s ease`,
  "&:hover": { background: "#F2F2F2", borderColor: "#C0C0C0" },
});

// Service card
const ServiceCard = styled(Box)({
  border: "1.5px solid #0A0A0A",
  padding: "28px 24px",
  background: "#FFFFFF",
  animation: `${fadeUp} 0.5s ease`,
  transition: "all 0.2s",
  "&:hover": { background: "#0A0A0A", "& *": { color: "#FFFFFF !important" } },
});

// Limited tag
const LimitedTag = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#0A0A0A",
  color: "#B8966E",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 9,
  fontWeight: 500,
  letterSpacing: "0.38em",
  textTransform: "uppercase",
  padding: "5px 14px 5px 10px",
  marginBottom: 16,
});

const GoldDot = styled(Box)({
  width: 6, height: 6, borderRadius: "50%",
  background: "#B8966E",
  animation: `${fadeIn} 1s ease infinite alternate`,
});

// ─────────────────────────────────────────────────────────────────
// QUESTION LABEL
// ─────────────────────────────────────────────────────────────────
const QLabel = ({ children }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
    <Typography sx={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px", fontWeight: 500,
      letterSpacing: "0.28em", textTransform: "uppercase",
      color: "#0A0A0A",
    }}>
      {children}
    </Typography>
    <Box sx={{ flex: 1, height: "1px", background: "#EBEBEB" }} />
  </Box>
);

// ─────────────────────────────────────────────────────────────────
// OPTION CARD
// ─────────────────────────────────────────────────────────────────
const OptionCard = ({ option, selected, onClick }) => (
  <OptBtn selected={selected ? 1 : 0} onClick={onClick}>
    {selected && (
      <Box sx={{ position: "absolute", top: 10, right: 12,
        fontFamily: "'DM Sans'", fontSize: 9, color: "#B8966E",
        letterSpacing: "0.1em" }}>✓</Box>
    )}
    {option.glyph && <OptGlyph selected={selected ? 1 : 0}>{option.glyph}</OptGlyph>}
    <OptName selected={selected ? 1 : 0}>{option.name}</OptName>
    {option.sub && <OptSub selected={selected ? 1 : 0}>{option.sub}</OptSub>}
  </OptBtn>
);

// ─────────────────────────────────────────────────────────────────
// STEP HEADER
// ─────────────────────────────────────────────────────────────────
const StepHeader = ({ roman, label, title }) => (
  <Box sx={{ display: "flex", alignItems: "baseline", gap: 2.5,
    mb: 5, pb: 3, borderBottom: "1px solid #EBEBEB",
    animation: `${fadeUp} 0.5s ease` }}>
    <Typography sx={{
      fontFamily: "'Cormorant', serif", fontSize: "3.5rem",
      fontWeight: 300, color: "#E8E8E8", lineHeight: 1, userSelect: "none",
    }}>{roman}</Typography>
    <Box>
      <Typography sx={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "9px",
        fontWeight: 500, letterSpacing: "0.42em", textTransform: "uppercase",
        color: "#888888", mb: 0.5,
      }}>Assessment · {label}</Typography>
      <Typography variant="h3" sx={{
        fontSize: "clamp(1.5rem,3.2vw,2.2rem)", color: "#0A0A0A", lineHeight: 1.1,
      }}>{title}</Typography>
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────────────
// DATA — STEPS
// ─────────────────────────────────────────────────────────────────
const STEPS = [
  { roman: "I",   label: "Part One",   title: "Skin Type & Pore Architecture" },
  { roman: "II",  label: "Part Two",   title: "Complexion & Undertone" },
  { roman: "III", label: "Part Three", title: "Skin Concerns" },
  { roman: "IV",  label: "Part Four",  title: "Coverage & Finish" },
  { roman: "V",   label: "Part Five",  title: "Style & Occasion" },
];

const COV_LABELS = ["Skin Tint", "Sheer", "Medium", "Full", "Flawless"];

// ─────────────────────────────────────────────────────────────────
// RESULT LOGIC
// ─────────────────────────────────────────────────────────────────
const cap = s => s ? s.replace(/\b\w/g, c => c.toUpperCase()) : "—";

function getProfile(s) {
  const names = {
    oily:        { warm:"The Golden Atelier",    cool:"The Polished Noir",    neutral:"The Velvet Precision", olive:"The Bronzed Couture"  },
    dry:         { warm:"The Desert Lumière",    cool:"The Ivory Séance",     neutral:"The Cashmere Canvas",  olive:"The Terracotta Edit"  },
    combination: { warm:"The Sun-Kissed Duality",cool:"The Ethereal Balance", neutral:"The Dual Maison",      olive:"The Olive Couture"    },
    normal:      { warm:"The Golden Hour Muse",  cool:"The Classic Ingénue",  neutral:"The Atelier Muse",     olive:"The Méditerranée"     },
    sensitive:   { warm:"The Velvet Rose",       cool:"The Moonlight Gentle", neutral:"The Soft Botanica",    olive:"The Calm Lumière"     },
  };
  return names[s.skinType]?.[s.undertone] || "The Luminous Muse";
}

function getSkinSummary(s) {
  const map = {
    oily:        "Your skin produces excess sebum — the key is controlled formulas that balance without stripping.",
    dry:         "Your skin craves moisture. Hydrating, nourishing formulas will give you that plump, luminous finish.",
    combination: "A dual-architecture skin requiring a zoned approach — control the T-zone, nourish the cheeks.",
    normal:      "Beautifully balanced skin. Your ritual can be versatile, experimental, and endlessly creative.",
    sensitive:   "Your skin demands the purest, gentlest formulas. Mineral-led, fragrance-free is your standard.",
  };
  return map[s.skinType] || "";
}

// SHORT product type recommendations — concise, scannable
function getProductTypes(s) {
  const recs = [];

  // Foundation type
  const foundMap = {
    oily:        { type: "Oil-Free Matte Foundation", reason: "Controls sebum · Long-wear formula · Silica-based" },
    dry:         { type: "Hydrating Serum Foundation", reason: "Hyaluronic acid-infused · No-crease formula" },
    combination: { type: "Balanced Satin Foundation",  reason: "Controls T-zone · Nourishes dry zones" },
    normal:      { type: "Luminous Satin Foundation",  reason: "Enhances natural glow · Versatile finish" },
    sensitive:   { type: "Mineral Foundation SPF30+",  reason: "Fragrance-free · Titanium dioxide base" },
  };
  recs.push({ cat: "Foundation", ...foundMap[s.skinType] });

  // Primer type
  const primerMap = {
    oily:        { type: "Pore-Blurring Silicone Primer", reason: "Fills pores · Creates airbrushed base" },
    dry:         { type: "Hydrating Illuminating Primer",  reason: "Plumps · Adds radiant moisture barrier" },
    combination: { type: "Dual-Zone Primer",               reason: "Mattify T-zone · Hydrate cheeks" },
    normal:      { type: "Radiance-Boosting Primer",       reason: "Luminosity · Glow enhancement" },
    sensitive:   { type: "Calming Green Primer",           reason: "Neutralises redness · Aloe vera base" },
  };
  recs.push({ cat: "Primer", ...primerMap[s.skinType] });

  // Concealer
  const concMap = {
    "dark-circles":     { type: "Colour-Correcting Concealer", reason: s.undertone === "cool" ? "Peach corrector base" : "Apricot corrector base" },
    "acne":             { type: "Full-Coverage Spot Concealer",  reason: "Dense pigment · Salicylic acid treatment" },
    "redness":          { type: "Green Colour Corrector",        reason: "Neutralises red tones before concealer" },
    "hyperpigmentation":{ type: "Brightening Concealer",        reason: "Vitamin C + Niacinamide formula" },
  };
  const concernMatch = s.concerns.find(c => concMap[c]);
  recs.push(concernMatch
    ? { cat: "Concealer", ...concMap[concernMatch] }
    : { cat: "Concealer", type: "Skin-Match Brightening Concealer", reason: "1 shade lighter · Inner corner brightening" }
  );

  // Setting
  const settingMap = {
    matte:  { type: "Finely-Milled Setting Powder", reason: "Locks base · Absorbs sebum · No flashback" },
    satin:  { type: "Light Setting Powder + Dewy Spray", reason: "Balances shine · Refreshes mid-wear" },
    dewy:   { type: "Dewy Setting Spray", reason: "No powder · Moisture-fusing mist finish" },
    glow:   { type: "Glow Setting Spray", reason: "Light-reflecting mist · Glass skin finish" },
  };
  recs.push({ cat: "Setting", ...(settingMap[s.finishPref] || settingMap["satin"]) });

  // Blush — undertone matched
  const blushMap = {
    warm:    s.skinTone === "deep" || s.skinTone === "tan" ? "Terracotta / Brick Blush"  : "Peach / Coral Blush",
    cool:    s.skinTone === "deep" || s.skinTone === "tan" ? "Berry / Plum Blush"        : "Rose / Pink Blush",
    neutral: "Mauve / Soft Pink Blush",
    olive:   "Terracotta / Dusty Rose Blush",
  };
  recs.push({ cat: "Blush", type: blushMap[s.undertone] || "Rose Blush", reason: `Calibrated to your ${s.undertone} undertone` });

  // Highlighter
  const hlMap = { warm: "Gold / Champagne", cool: "Pearl / Icy Rose", neutral: "Champagne / Rose Gold", olive: "Bronze / Warm Gold" };
  if (s.finishPref !== "matte") {
    recs.push({ cat: "Highlighter", type: `${hlMap[s.undertone] || "Champagne"} Highlighter`, reason: "High-points application · Lit-from-within" });
  }

  // Eye product
  const eyeMap = {
    hooded:    { type: "Cut-Crease Eyeshadow + Upper Liner Only",  reason: "Creates visible lid space" },
    round:     { type: "Elongating Cat-Eye Liner",                 reason: "Horizontal extension · Almond illusion" },
    monolid:   { type: "Graphic Liner + Tubing Mascara",           reason: "Celebrates monolid architecture" },
    upturned:  { type: "Lower Lash Smoky Liner",                   reason: "Balances natural lift" },
    downturned:{ type: "Upward-Flick Liner",                       reason: "Corrective lift technique" },
    almond:    { type: "Classic Three-Shade Eyeshadow",            reason: "Versatile · Any technique works" },
  };
  recs.push({ cat: "Eyes", ...(eyeMap[s.eyeShape] || eyeMap["almond"]) });

  // Lips
  const lipColMap = {
    warm:    { everyday: "Nude Peach / Terracotta", evening: "Burnt Copper / Rust",    bridal: "Warm Dusty Rose" },
    cool:    { everyday: "Mauve / Pink Nude",        evening: "Deep Berry / Burgundy",  bridal: "Rose / Soft Berry" },
    neutral: { everyday: "Natural Nude",             evening: "Classic Red / Burgundy", bridal: "Blush Rose" },
    olive:   { everyday: "Warm Brown Nude",          evening: "Brick Red / Mocha",      bridal: "Dusty Rose / Coral" },
  };
  const occKey = s.occasion === "evening" || s.occasion === "creative" ? "evening"
               : s.occasion === "bridal" ? "bridal" : "everyday";
  const lipCol = lipColMap[s.undertone]?.[occKey] || "Rosy Nude";
  const lipTypeMap = { thin: "Plumping Liner + Gloss", full: "Matte Liquid Lip", uneven: "Defining Liner First", medium: "Satin Lip Colour" };
  recs.push({ cat: "Lips", type: `${lipTypeMap[s.lipShape] || "Satin Lip Colour"} — ${lipCol}`, reason: `Matched to your ${s.undertone} undertone · ${cap(s.occasion)} occasion` });

  return recs;
}

function getAvoidList(s) {
  const a = [];
  if (s.skinType === "oily") a.push("Heavy cream bases", "Oil-based primers", "Skipping primer", "Chunky glitter on T-zone");
  if (s.skinType === "dry") a.push("Heavy powder finishes", "Matte-only formulas", "Skipping moisture step");
  if (s.skinType === "sensitive") a.push("Fragrance in foundations", "Alcohol-based sprays", "Expired products");
  if (s.skinType === "combination") a.push("Single formula all over", "Heavy oil on T-zone");
  if (s.concerns.includes("acne")) a.push("Comedogenic formulas");
  if (s.concerns.includes("redness")) a.push("Pink-toned foundations");
  if (s.poreSize === "large") a.push("Shimmer on nose area");
  return [...new Set(a)].slice(0, 8);
}

// Services — Amour Estilo offerings
const SERVICES = [
  { name: "Bridal Artistry", desc: "Full-day coverage · Trial session included · Timeless finish" },
  { name: "Editorial Makeup", desc: "Fashion shoots · Campaign looks · Avant-garde techniques" },
  { name: "Skin Consultation", desc: "Personalised regime · Product prescription · 45 min session" },
  { name: "Occasion Glam", desc: "Events · Parties · Red carpet · Day to night transformation" },
];

// ─────────────────────────────────────────────────────────────────
// RESULTS COMPONENT
// ─────────────────────────────────────────────────────────────────
function Results({ state, onRestart }) {
  const profileName = getProfile(state);
  const parts = profileName.split(" ");
  const last = parts.pop();
  const productTypes = getProductTypes(state);
  const avoids = getAvoidList(state);
  const metrics = [
    { l: "Skin Type",   v: cap(state.skinType) },
    { l: "Undertone",   v: cap(state.undertone) },
    { l: "Complexion",  v: cap(state.skinTone) },
    { l: "Finish",      v: cap(state.finishPref) },
    { l: "Eye Shape",   v: cap(state.eyeShape) },
    { l: "Coverage",    v: COV_LABELS[state.coverageLevel - 1] },
  ];

  return (
    <Box sx={{ animation: `${fadeIn} 0.6s ease` }}>

      {/* ── HERO ── */}
      <ResultHero>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box sx={{ width: 20, height: 1, background: "#555" }} />
          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 9, letterSpacing: "0.48em",
            textTransform: "uppercase", color: "#666666", fontWeight: 500 }}>
            House of Amour Estilo · Skin Intelligence
          </Typography>
        </Box>
        <Typography variant="h2" sx={{
          fontSize: "clamp(2.4rem,5vw,4.5rem)", lineHeight: 0.95,
          color: "#FFFFFF", mb: 2, letterSpacing: "-0.01em",
        }}>
          {parts.join(" ")}{" "}
          <Box component="em" sx={{ color: "#B8966E", fontStyle: "italic" }}>{last}</Box>
        </Typography>
        <Typography sx={{
          fontFamily: "'DM Sans'", fontSize: 13.5, fontWeight: 300,
          color: "#909090", lineHeight: 1.8, maxWidth: 520, letterSpacing: "0.02em",
        }}>
          {getSkinSummary(state)}
        </Typography>

        {/* Badges */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}>
          {[cap(state.skinType) + " Skin", cap(state.undertone) + " Undertone",
            cap(state.skinTone) + " Complexion", cap(state.finishPref) + " Finish",
            COV_LABELS[state.coverageLevel - 1]].map(b => (
            <Box key={b} sx={{ px: 2, py: 0.6, border: "1px solid #2E2E2E",
              fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#888888" }}>{b}</Box>
          ))}
        </Box>
      </ResultHero>

      {/* ── METRICS STRIP ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)",
        gap: "1px", background: "#E8E8E8", borderBottom: "1px solid #E8E8E8", mb: 7 }}>
        {metrics.map(m => (
          <MetricCell key={m.l}>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 8, fontWeight: 500,
              letterSpacing: "0.42em", textTransform: "uppercase", color: "#999999", mb: 1 }}>{m.l}</Typography>
            <Typography sx={{ fontFamily: "'Cormorant', serif", fontSize: "1.15rem",
              fontWeight: 400, color: "#0A0A0A", lineHeight: 1.2 }}>{m.v}</Typography>
          </MetricCell>
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ pb: 12 }}>

        {/* ── RECOMMENDED PRODUCT TYPES ── */}
        <Box sx={{ mb: 7 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 4,
            pb: 2, borderBottom: "1px solid #EBEBEB" }}>
            <Typography sx={{ fontFamily: "'Cormorant', serif", fontSize: "1.9rem",
              fontWeight: 300, color: "#0A0A0A" }}>Recommended Product Types</Typography>
            <Box sx={{ flex: 1, height: 1, background: "#EBEBEB" }} />
          </Box>

          <Grid container spacing="1px" sx={{ background: "#EBEBEB", border: "1px solid #EBEBEB" }}>
            {productTypes.map((p, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <ProductCard>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 9, fontWeight: 500,
                    letterSpacing: "0.38em", textTransform: "uppercase",
                    color: "#B8966E", mb: 1 }}>{p.cat}</Typography>
                  <Typography sx={{ fontFamily: "'Cormorant', serif", fontSize: "1.1rem",
                    fontWeight: 400, color: "#0A0A0A", mb: 0.8, lineHeight: 1.25 }}>{p.type}</Typography>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 300,
                    color: "#444444", lineHeight: 1.55, letterSpacing: "0.02em" }}>{p.reason}</Typography>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── WHAT TO AVOID ── */}
        <Box sx={{ background: "#F5F5F5", border: "1px solid #E8E8E8",
          p: "20px 28px", mb: 7, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 9, fontWeight: 500,
            letterSpacing: "0.42em", textTransform: "uppercase", color: "#555555",
            mr: 1, whiteSpace: "nowrap" }}>Avoid</Typography>
          {avoids.map(a => (
            <Box key={a} sx={{ px: 1.8, py: 0.6, border: "1px solid #D0D0D0",
              fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#444444", background: "#FFFFFF" }}>{a}</Box>
          ))}
        </Box>

        {/* ── AMOUR ESTILO SERVICES ── */}
        <Box sx={{ mb: 7 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 4,
            pb: 2, borderBottom: "1px solid #EBEBEB" }}>
            <Typography sx={{ fontFamily: "'Cormorant', serif", fontSize: "1.9rem",
              fontWeight: 300, color: "#0A0A0A" }}>Our Services</Typography>
            <Box sx={{ flex: 1, height: 1, background: "#EBEBEB" }} />
          </Box>

          <Grid container spacing={1.5}>
            {SERVICES.map((sv, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <ServiceCard>
                  <Typography sx={{ fontFamily: "'Cormorant', serif", fontSize: "1.2rem",
                    fontWeight: 400, color: "#0A0A0A", mb: 1, lineHeight: 1.2,
                    transition: "color 0.2s" }}>{sv.name}</Typography>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 300,
                    color: "#555555", lineHeight: 1.65, letterSpacing: "0.02em",
                    transition: "color 0.2s" }}>{sv.desc}</Typography>
                </ServiceCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── BOOK FREE TRIAL CTA ── */}
        <Box sx={{ background: "#0A0A0A", p: "56px 48px",
          display: "flex", flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" }, justifyContent: "space-between", gap: 4, mb: 7 }}>
          <Box>
            <LimitedTag>
              <GoldDot /> Limited Edition · Free Trial
            </LimitedTag>
            <Typography variant="h3" sx={{
              fontSize: "clamp(1.8rem,4vw,3rem)", color: "#FFFFFF",
              lineHeight: 1.05, mb: 1.5,
            }}>
              Your Skin, Deserves<br />
              <Box component="em" sx={{ color: "#B8966E" }}>Artistry.</Box>
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 300,
              color: "#808080", lineHeight: 1.8, maxWidth: 420, letterSpacing: "0.02em" }}>
              Book a complimentary 30-minute skin consultation & trial makeup session
              with our lead artist — exclusively for first-time clients.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2.5 }}>
              {["30 Min Session", "Personalised Ritual", "No Commitment", "Bengaluru Studio"].map(t => (
                <Box key={t} sx={{ px: 1.8, py: 0.5, border: "1px solid #2A2A2A",
                  fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#666666" }}>{t}</Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, minWidth: 220, alignItems: { md: "flex-end" } }}>
            <TrialBtn fullWidth>
              Book Free Trial
            </TrialBtn>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 300,
              color: "#444444", letterSpacing: "0.08em", textAlign: { md: "right" } }}>
              Limited to 5 sessions per month
            </Typography>
          </Box>
        </Box>

        {/* ── FOOTER ── */}
        <Box sx={{ borderTop: "1px solid #E8E8E8", pt: 4,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: "'Cormorant', serif", fontWeight: 300,
              fontSize: 16, letterSpacing: "0.28em", textTransform: "uppercase", color: "#0A0A0A" }}>
              House of Amour Estilo
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: "0.28em",
              textTransform: "uppercase", color: "#999999", mt: 0.4 }}>
              Bespoke Beauty Intelligence · Bengaluru
            </Typography>
          </Box>
          <Button onClick={onRestart} sx={{
            fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#888888", background: "none",
            textDecoration: "underline", textUnderlineOffset: 4, p: 0,
            "&:hover": { color: "#0A0A0A", background: "none" },
          }}>Retake Assessment</Button>
        </Box>

      </Container>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function HouseOfAmourEstilo() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [S, setS] = useState({
    skinType: null, poreSize: null, skinTone: null, undertone: null,
    concerns: [], coverageLevel: 3, wearTime: null, finishPref: null,
    occasion: null, eyeShape: null, lipShape: null,
  });

  const sel = useCallback((field, val, multi = false) => {
    setS(prev => {
      if (!multi) return { ...prev, [field]: val };
      const arr = prev.concerns.includes(val)
        ? prev.concerns.filter(v => v !== val)
        : [...prev.concerns, val];
      return { ...prev, concerns: arr };
    });
  }, []);

  const REQ = [
    ["skinType", "poreSize"], ["skinTone", "undertone"],
    ["concerns"], ["wearTime", "finishPref"],
    ["occasion", "eyeShape", "lipShape"],
  ];

  const validate = idx => {
    for (const f of REQ[idx]) {
      if (f === "concerns" && S.concerns.length === 0) { alert("Please select at least one concern."); return false; }
      if (f !== "concerns" && !S[f]) { alert("Please complete all selections."); return false; }
    }
    return true;
  };

  const goNext = () => { if (validate(step)) { if (step === 4) setDone(true); else setStep(p => p + 1); } };
  const goBack = () => setStep(p => p - 1);
  const restart = () => {
    setDone(false); setStep(0);
    setS({ skinType:null, poreSize:null, skinTone:null, undertone:null,
           concerns:[], coverageLevel:3, wearTime:null, finishPref:null,
           occasion:null, eyeShape:null, lipShape:null });
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step, done]);

  // ── STEP CONTENT ──────────────────────────────────────────────
  const STEP_CONTENT = [

    // STEP 0 — Skin Type
    <Box key={0} sx={{ animation: `${fadeUp} 0.5s ease` }}>
      <Box mb={5}>
        <QLabel>How does your skin behave by midday</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"oily",glyph:"Sebaceous",name:"Oily",sub:"Shine · breakthrough · needs blotting"},
            {val:"dry",glyph:"Dehydrated",name:"Dry",sub:"Tight · flaking · visible fine lines"},
            {val:"combination",glyph:"Dual-Zone",name:"Combination",sub:"Oily T-zone · dry cheeks"},
            {val:"normal",glyph:"Balanced",name:"Normal",sub:"Comfortable · even all day"},
            {val:"sensitive",glyph:"Reactive",name:"Sensitive",sub:"Redness · easy irritation"}].map(o => (
            <Grid item xs={6} sm={4} md={2.4} key={o.val}>
              <OptionCard option={o} selected={S.skinType === o.val} onClick={() => sel("skinType", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mb={5}>
        <QLabel>Pore visibility</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"large",name:"Visibly Enlarged",sub:"Prominent on nose & cheeks"},
            {val:"medium",name:"Moderate",sub:"Noticeable in certain zones"},
            {val:"small",name:"Refined / Fine",sub:"Barely perceptible"}].map(o => (
            <Grid item xs={12} sm={4} key={o.val}>
              <OptionCard option={o} selected={S.poreSize === o.val} onClick={() => sel("poreSize", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>,

    // STEP 1 — Complexion
    <Box key={1} sx={{ animation: `${fadeUp} 0.5s ease` }}>
      <Box mb={5}>
        <QLabel>Skin tone depth</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"fair",name:"Fair",sub:"Porcelain · ivory · burns easily"},
            {val:"light",name:"Light",sub:"Light beige · tans gradually"},
            {val:"medium",name:"Medium",sub:"Golden · olive · warm beige"},
            {val:"tan",name:"Tan",sub:"Deep golden · caramel · honey"},
            {val:"deep",name:"Deep",sub:"Rich brown to ebony"}].map(o => (
            <Grid item xs={6} sm={2.4} key={o.val}>
              <OptionCard option={o} selected={S.skinTone === o.val} onClick={() => sel("skinTone", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mb={5}>
        <QLabel>Undertone register</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"warm",glyph:"Aurum",name:"Warm",sub:"Yellow · golden · peachy veins"},
            {val:"cool",glyph:"Argentum",name:"Cool",sub:"Pink · rosy · blue-veined wrists"},
            {val:"neutral",glyph:"Medius",name:"Neutral",sub:"Both cool and warm present"},
            {val:"olive",glyph:"Viridis",name:"Olive",sub:"Green-ash · Mediterranean"}].map(o => (
            <Grid item xs={6} sm={3} key={o.val}>
              <OptionCard option={o} selected={S.undertone === o.val} onClick={() => sel("undertone", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>,

    // STEP 2 — Concerns
    <Box key={2} sx={{ animation: `${fadeUp} 0.5s ease` }}>
      <Box mb={5}>
        <QLabel>Select all that apply — multiple allowed</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"acne",name:"Acne & Blemishes",sub:"Active breakouts · congestion"},
            {val:"hyperpigmentation",name:"Dark Spots",sub:"Hyperpigmentation · melasma"},
            {val:"redness",name:"Redness",sub:"Rosacea · flushing · diffuse red"},
            {val:"fine-lines",name:"Fine Lines",sub:"Expression lines · laxity"},
            {val:"dark-circles",name:"Dark Circles",sub:"Periorbital discolouration"},
            {val:"dullness",name:"Dullness",sub:"Lack of luminosity · fatigue"},
            {val:"texture",name:"Uneven Texture",sub:"Rough · bumpy · pores"},
            {val:"none",name:"No Concerns",sub:"Skin in optimal condition"}].map(o => (
            <Grid item xs={6} sm={3} key={o.val}>
              <OptionCard option={o} selected={S.concerns.includes(o.val)} onClick={() => sel("concerns", o.val, true)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>,

    // STEP 3 — Coverage & Finish
    <Box key={3} sx={{ animation: `${fadeUp} 0.5s ease` }}>
      <Box mb={5}>
        <QLabel>Desired coverage weight</QLabel>
        <Box sx={{ border: "1.5px solid #E0E0E0", p: "22px 28px 18px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 500,
              letterSpacing: "0.24em", textTransform: "uppercase", color: "#777777", whiteSpace: "nowrap" }}>
              Bare
            </Typography>
            <Slider value={S.coverageLevel} min={1} max={5} step={1}
              onChange={(_, v) => setS(p => ({ ...p, coverageLevel: v }))}
              sx={{ color: "#0A0A0A",
                "& .MuiSlider-thumb": { width: 14, height: 14, background: "#0A0A0A",
                  border: "2px solid #FFFFFF", outline: "1px solid #0A0A0A", borderRadius: "50%" },
                "& .MuiSlider-track": { border: "none", height: 1 },
                "& .MuiSlider-rail": { height: 1, background: "#E0E0E0" },
              }} />
            <Typography sx={{ fontFamily: "'Cormorant', serif", fontSize: "2rem",
              fontWeight: 300, color: "#0A0A0A", minWidth: 28, textAlign: "right", lineHeight: 1 }}>
              {S.coverageLevel}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            {COV_LABELS.map(l => (
              <Typography key={l} sx={{ fontFamily: "'DM Sans'", fontSize: 9, fontWeight: 400,
                letterSpacing: "0.06em", textTransform: "uppercase", color: "#AAAAAA" }}>{l}</Typography>
            ))}
          </Box>
        </Box>
      </Box>
      <Box mb={5}>
        <QLabel>Wear duration</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"short",name:"1 – 4 hrs",sub:"Quick daytime"},
            {val:"medium",name:"4 – 8 hrs",sub:"Full workday"},
            {val:"long",name:"8 – 12 hrs",sub:"Day into evening"},
            {val:"extra",name:"12 hrs +",sub:"Events · occasions"}].map(o => (
            <Grid item xs={6} sm={3} key={o.val}>
              <OptionCard option={o} selected={S.wearTime === o.val} onClick={() => sel("wearTime", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mb={5}>
        <QLabel>Preferred finish</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"matte",glyph:"Velvet",name:"Matte",sub:"Zero shine · powdered veil"},
            {val:"satin",glyph:"Soie",name:"Satin",sub:"Soft sheen · natural glow"},
            {val:"dewy",glyph:"Rosée",name:"Dewy",sub:"Fresh · luminous · hydrated"},
            {val:"glow",glyph:"Cristal",name:"Glass Glow",sub:"High-shine · reflective"}].map(o => (
            <Grid item xs={6} sm={3} key={o.val}>
              <OptionCard option={o} selected={S.finishPref === o.val} onClick={() => sel("finishPref", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>,

    // STEP 4 — Style & Occasion
    <Box key={4} sx={{ animation: `${fadeUp} 0.5s ease` }}>
      <Box mb={5}>
        <QLabel>Primary makeup occasion</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"everyday",name:"Everyday",sub:"Natural · effortless"},
            {val:"office",name:"Professional",sub:"Polished · refined"},
            {val:"evening",name:"Evening",sub:"Glamorous · sculptural"},
            {val:"bridal",name:"Bridal",sub:"Timeless · flawless"},
            {val:"creative",name:"Creative",sub:"Artistic · avant-garde"}].map(o => (
            <Grid item xs={6} sm={2.4} key={o.val}>
              <OptionCard option={o} selected={S.occasion === o.val} onClick={() => sel("occasion", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mb={5}>
        <QLabel>Eye morphology</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"almond",name:"Almond",sub:"Classic · balanced"},
            {val:"round",name:"Round",sub:"Wide · open"},
            {val:"hooded",name:"Hooded",sub:"Fold covers crease"},
            {val:"monolid",name:"Monolid",sub:"No visible crease"},
            {val:"upturned",name:"Upturned",sub:"Cat-eye lift"},
            {val:"downturned",name:"Downturned",sub:"Descending corners"}].map(o => (
            <Grid item xs={6} sm={2} key={o.val}>
              <OptionCard option={o} selected={S.eyeShape === o.val} onClick={() => sel("eyeShape", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mb={5}>
        <QLabel>Lip volume</QLabel>
        <Grid container spacing="1px" sx={{ background: "#E8E8E8" }}>
          {[{val:"thin",name:"Thin"},{val:"medium",name:"Medium"},
            {val:"full",name:"Full"},{val:"uneven",name:"Asymmetric"}].map(o => (
            <Grid item xs={6} sm={3} key={o.val}>
              <OptionCard option={o} selected={S.lipShape === o.val} onClick={() => sel("lipShape", o.val)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>,
  ];

  // ── RENDER ────────────────────────────────────────────────────
  if (done) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ body: { margin: 0 }, "*": { boxSizing: "border-box" } }} />
        <Wrap>
          <Nav>
            <Typography sx={{ fontFamily: "'Cormorant', serif", fontWeight: 300,
              fontSize: 16, letterSpacing: "0.28em", textTransform: "uppercase", color: "#0A0A0A" }}>
              House of <Box component="span" sx={{ color: "#777777" }}>Amour Estilo</Box>
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 9, fontWeight: 500,
              letterSpacing: "0.42em", textTransform: "uppercase", color: "#AAAAAA" }}>
              Atelier de Beauté
            </Typography>
            <Box sx={{ width: 20, height: 1, background: "#0A0A0A" }} />
          </Nav>
          <Box sx={{ pt: "60px" }}>
            <Results state={S} onRestart={restart} />
          </Box>
        </Wrap>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: { margin: 0 }, "*": { boxSizing: "border-box" } }} />
      <Wrap>
        {/* NAV */}
        <Nav>
          <Typography sx={{ fontFamily: "'Cormorant', serif", fontWeight: 300,
            fontSize: 16, letterSpacing: "0.28em", textTransform: "uppercase", color: "#0A0A0A" }}>
            House of <Box component="span" sx={{ color: "#777777" }}>Amour Estilo</Box>
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 9, fontWeight: 500,
            letterSpacing: "0.42em", textTransform: "uppercase", color: "#AAAAAA" }}>
            Atelier de Beauté
          </Typography>
          <Box sx={{ width: 20, height: 1, background: "#0A0A0A" }} />
        </Nav>

        <Box sx={{ pt: "60px" }}>
          <Container maxWidth="lg">

            {/* HERO — step 0 only */}
            {step === 0 && (
              <Box sx={{ pt: 9, pb: 7, display: "grid",
                gridTemplateColumns: { md: "1fr 1fr" }, gap: 8,
                alignItems: "end", borderBottom: "1px solid #EBEBEB", mb: 6,
                animation: `${fadeUp} 0.6s ease` }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 24, height: 1, background: "#BBBBBB" }} />
                    <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 500,
                      letterSpacing: "0.44em", textTransform: "uppercase", color: "#888888" }}>
                      Skin Intelligence
                    </Typography>
                  </Box>
                  <Typography variant="h1" sx={{
                    fontSize: "clamp(2.8rem,5.5vw,5rem)", lineHeight: 0.95,
                    color: "#0A0A0A", mb: 3.5, letterSpacing: "-0.01em",
                  }}>
                    Your Skin.<br />
                    <Box component="em" sx={{ color: "#555555", fontStyle: "italic" }}>Decoded.</Box>
                  </Typography>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13.5, fontWeight: 300,
                    color: "#333333", lineHeight: 1.85, maxWidth: 380, letterSpacing: "0.02em" }}>
                    A precise, five-part assessment that reads your complexion and prescribes
                    your bespoke makeup ritual — product by product.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: { md: "flex-end" }, gap: 3 }}>
                  <Typography sx={{ fontFamily: "'Cormorant', serif",
                    fontSize: "clamp(5rem,10vw,9rem)", fontWeight: 300,
                    color: "#F0F0F0", lineHeight: 1, letterSpacing: "-0.03em", userSelect: "none" }}>05</Typography>
                  <Box sx={{ border: "1px solid #E8E8E8", minWidth: 240 }}>
                    {STEPS.map((st, i) => (
                      <Box key={i} sx={{ px: 3, py: 1.3, borderBottom: i < 4 ? "1px solid #F0F0F0" : "none" }}>
                        <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10,
                          letterSpacing: "0.26em", textTransform: "uppercase",
                          color: i === step ? "#0A0A0A" : "#C0C0C0",
                          fontWeight: i === step ? 500 : 400,
                        }}>
                          {st.roman} — {st.title}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* PROGRESS */}
            <ProgressTrack>
              {[0,1,2,3,4].map(i => (
                <ProgressBar key={i}
                  state={i < step ? "done" : i === step ? "active" : "idle"} />
              ))}
            </ProgressTrack>

            {/* STEP HEADER */}
            <StepHeader {...STEPS[step]} />

            {/* STEP CONTENT */}
            {STEP_CONTENT[step]}

            {/* NAV ROW */}
            <Box sx={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", pt: 4, mt: 4, borderTop: "1px solid #EBEBEB", mb: 8 }}>
              {step > 0 ? <GhostBtn onClick={goBack}>Back</GhostBtn> : <Box />}
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 400,
                  letterSpacing: "0.2em", color: "#BBBBBB" }}>
                  0{step + 1} / 05
                </Typography>
                <PrimaryBtn onClick={goNext}>
                  {step === 4 ? "Reveal My Profile" : "Continue"}
                </PrimaryBtn>
              </Box>
            </Box>

          </Container>
        </Box>
      </Wrap>
    </ThemeProvider>
  );
}