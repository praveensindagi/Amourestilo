/**
 * AmourEstiloAbout.jsx
 * Amour Estilo — About Page
 * Theme: White · Minimal · International Luxury (Dior / Chanel / Apple reference)
 *
 * Dependencies:
 *   npm install @mui/material @emotion/react @emotion/styled
 *
 * Add to index.html <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet">
 */

import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// ─── THEME ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#FFFFFF", paper: "#F8F7F5" },
    text: { primary: "#0A0A0A", secondary: "#6B6B6B" },
  },
  typography: { fontFamily: "'Montserrat', sans-serif" },
});

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  black:     "#0A0A0A",
  charcoal:  "#2C2C2C",
  midgrey:   "#6B6B6B",
  lightgrey: "#C8C8C8",
  hairline:  "#E4E4E4",
  offwhite:  "#F8F7F5",
  white:     "#FFFFFF",
};

// ─── SCROLL FADE HOOK ─────────────────────────────────────────────────────────
function useFade(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

/** Overline / eyebrow label */
const Label = ({ children, sx = {} }) => (
  <Typography sx={{
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: "0.58rem",
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    color: T.lightgrey,
    ...sx,
  }}>
    {children}
  </Typography>
);

/** Cormorant serif display headline */
const Display = ({ children, sx = {}, component = "h2" }) => (
  <Typography component={component} sx={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    color: T.black,
    lineHeight: 1.04,
    m: 0,
    ...sx,
  }}>
    {children}
  </Typography>
);

/** Montserrat light body copy */
const Body = ({ children, sx = {} }) => (
  <Typography sx={{
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: "0.77rem",
    lineHeight: 2.1,
    color: T.midgrey,
    letterSpacing: "0.01em",
    ...sx,
  }}>
    {children}
  </Typography>
);

/** Horizontal rule with label */
const SectionRule = ({ label }) => (
  <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: { xs: 8, md: 12 } }}>
    <Box sx={{ width: 28, height: "1px", bgcolor: T.lightgrey, flexShrink: 0 }} />
    <Label sx={{ whiteSpace: "nowrap" }}>{label}</Label>
    <Box sx={{ flex: 1, height: "1px", bgcolor: T.hairline }} />
  </Stack>
);

// ─── SECTION 1 · HERO ─────────────────────────────────────────────────────────
function Hero() {
  const [ref, vis] = useFade(0.01);

  return (
    <Box
      ref={ref}
      sx={{
        minHeight: "100vh",
        bgcolor: T.white,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        pt: "72px",
        borderBottom: `1px solid ${T.hairline}`,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <Grid container>

          {/* ── Left ── */}
          <Grid item xs={12} md={7} sx={{ pb: { xs: 8, md: 14 } }}>
            <Box sx={{
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(30px)",
              transition: "all 1.1s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <Label sx={{ display: "block", mb: 7, color: T.midgrey }}>
                Atelier de Beauté · Bengaluru, India
              </Label>

              <Display component="h1" sx={{
                fontSize: { xs: "13.5vw", sm: "9vw", md: "7.2vw" },
                lineHeight: 0.93,
                mb: 7,
              }}>
                The Art<br />
                of{" "}
                <Box component="em" sx={{ fontStyle: "italic", color: T.charcoal }}>
                  Luminous
                </Box>
                <br />
                Presence
              </Display>

              <Stack direction="row" alignItems="flex-start" spacing={4}>
                <Box sx={{ width: 40, height: "1px", bgcolor: T.hairline, mt: "0.85em", flexShrink: 0 }} />
                <Body sx={{ maxWidth: 420, fontSize: "0.73rem" }}>
                  India's premier luxury makeup atelier — where couture
                  discipline meets the transformative power of beauty.
                  Born in Bengaluru. Available to the world.
                </Body>
              </Stack>
            </Box>
          </Grid>

          {/* ── Right: stats flush to bottom ── */}
          <Grid item xs={12} md={5} sx={{
            borderLeft: { xs: "none", md: `1px solid ${T.hairline}` },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}>
            <Box sx={{
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(30px)",
              transition: "all 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}>
              {[
                { tag: "Luxe",   desc: "High Fashion Makeup · Every Industry" },
                { tag: "SOP",    desc: "Couture-Grade Standard Operating Protocol" },
                { tag: "Global", desc: "Based Bengaluru · Flies Anywhere On Demand" },
              ].map((item, i) => (
                <Box key={i} sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  px: { xs: 0, md: 7 },
                  py: 4.5,
                  borderTop: `1px solid ${T.hairline}`,
                  transition: "background 0.35s",
                  "&:hover": { bgcolor: T.offwhite },
                  cursor: "default",
                }}>
                  <Display sx={{
                    fontSize: "0.95rem",
                    letterSpacing: "0.12em",
                    color: T.hairline,
                    minWidth: 54,
                    transition: "color 0.4s",
                    ".MuiBox-root:hover &": { color: T.black },
                    fontWeight: 400,
                  }}>
                    {item.tag}
                  </Display>
                  <Label sx={{ color: T.lightgrey, lineHeight: 1.8 }}>{item.desc}</Label>
                </Box>
              ))}
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

// ─── SECTION 2 · LA MAISON ────────────────────────────────────────────────────
function Maison() {
  const [ref, vis] = useFade();
  return (
    <Box ref={ref} sx={{ bgcolor: T.white, py: { xs: 10, md: 18 }, borderBottom: `1px solid ${T.hairline}` }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <SectionRule label="La Maison" />
        <Grid container spacing={{ xs: 6, md: 16 }}>
          <Grid item xs={12} md={5}>
            <Box sx={{
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <Display sx={{ fontSize: { xs: "2.8rem", md: "3.7rem" }, lineHeight: 1.1, mb: 5 }}>
                Where others apply,
                <br />
                <Box component="em" sx={{ fontStyle: "italic" }}>we compose.</Box>
              </Display>
              <Box sx={{ width: 36, height: "1px", bgcolor: T.hairline }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.13s",
            }}>
              {[
                "Amour Estilo is India's premier luxury makeup atelier — a house founded on the belief that beauty, when practiced at its highest level, is not vanity. It is identity. It is armour. It is the most intimate form of self-expression a person can choose.",
                "Born in Bengaluru and trusted across industries, across India, and across the world — we exist at the precise intersection of haute fashion discipline and the deeply human art of transformation. We serve brides on the morning of the most sacred day of their lives. We serve actors stepping into another soul entirely. We serve executives who need the world to see their authority before they speak a single word.",
                "Our name is our manifesto. Amour — love, in its most devoted and uncompromising form. Estilo — style, in its most elevated expression. Together, they describe what we bring to every appointment: a profound love for the craft, and a relentless obsession with style that is not trend, but truth.",
              ].map((p, i) => <Body key={i} sx={{ mb: i < 2 ? 4 : 0 }}>{p}</Body>)}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── SECTION 3 · PHILOSOPHY ───────────────────────────────────────────────────
const pillars = [
  { num: "I",   title: "Discipline",   body: "Every appointment follows our proprietary SOP — a couture-grade protocol ensuring precision, hygiene, and consistency that is worthy of the runway, every single time." },
  { num: "II",  title: "Artistry",     body: "Our artists are trained not just in technique, but in vision — the ability to see beyond what a client asks for, to what they actually need." },
  { num: "III", title: "Luxe Product", body: "We work exclusively with the world's finest makeup — sourced globally, curated obsessively, applied with the expertise they deserve." },
  { num: "IV",  title: "Discretion",  body: "The vanity table is a sanctuary. Our artists are chosen as much for their composure and confidentiality as for their skill with a brush." },
  { num: "V",   title: "Elevation",   body: "We do not merely enhance appearance. We elevate your experience of yourself. When you leave, you do not just look different. You feel different." },
  { num: "VI",  title: "Presence",    body: "From Bengaluru to anywhere on the planet — on demand, without compromise, without geography as a limitation." },
];

function Philosophy() {
  const [ref, vis] = useFade();
  return (
    <Box ref={ref} sx={{ bgcolor: T.offwhite, py: { xs: 10, md: 18 }, borderBottom: `1px solid ${T.hairline}` }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <SectionRule label="Philosophy" />

        {/* Central quote */}
        <Box sx={{
          textAlign: "center", mb: { xs: 12, md: 18 },
          opacity: vis ? 1 : 0, transition: "opacity 1s",
        }}>
          <Display sx={{
            fontSize: { xs: "2.1rem", md: "3.8rem" },
            fontStyle: "italic", lineHeight: 1.2,
            maxWidth: 620, mx: "auto", mb: 5,
          }}>
            "Beauty is not applied.
            <br />It is awakened."
          </Display>
          <Box sx={{ width: 28, height: "1px", bgcolor: T.lightgrey, mx: "auto", mb: 5 }} />
          <Body sx={{ maxWidth: 440, mx: "auto", fontSize: "0.72rem" }}>
            This is not a tagline. It is the principle from which everything at
            Amour Estilo flows — every product choice, every protocol step, every
            conversation before a single brush is lifted.
          </Body>
        </Box>

        {/* Pillars grid */}
        <Grid container sx={{
          bgcolor: T.white,
          border: `1px solid ${T.hairline}`,
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(24px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}>
          {pillars.map((p, i) => (
            <Grid item xs={12} sm={6} md={4} key={i} sx={{
              p: { xs: 5, md: 6.5 },
              borderRight: {
                xs: "none",
                sm: i % 2 === 0 ? `1px solid ${T.hairline}` : "none",
                md: i % 3 < 2 ? `1px solid ${T.hairline}` : "none",
              },
              borderBottom: i < 3 ? `1px solid ${T.hairline}` : "none",
              transition: "background 0.4s",
              "&:hover": { bgcolor: T.offwhite },
              cursor: "default",
            }}>
              <Typography sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.4rem", fontWeight: 300,
                color: T.hairline, lineHeight: 1, mb: 3,
              }}>
                {p.num}
              </Typography>
              <Typography sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem", fontWeight: 400,
                fontStyle: "italic", color: T.charcoal, mb: 2.5,
              }}>
                {p.title}
              </Typography>
              <Body sx={{ fontSize: "0.69rem" }}>{p.body}</Body>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── SECTION 4 · CLIENT EXPERIENCE ───────────────────────────────────────────
function Experience() {
  const [ref, vis] = useFade();
  return (
    <Box ref={ref} sx={{ bgcolor: T.white, py: { xs: 10, md: 18 }, borderBottom: `1px solid ${T.hairline}` }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <SectionRule label="The Experience" />
        <Grid container spacing={{ xs: 6, md: 16 }} alignItems="flex-start">

          {/* Sticky pull quote */}
          <Grid item xs={12} md={4}>
            <Box sx={{
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateX(-20px)",
              transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
              position: { md: "sticky" }, top: { md: 100 },
            }}>
              <Box sx={{ borderLeft: `2px solid ${T.black}`, pl: 4, py: 0.5 }}>
                <Display sx={{
                  fontSize: { xs: "1.6rem", md: "2.1rem" },
                  fontStyle: "italic", lineHeight: 1.35, mb: 4,
                }}>
                  "It is the final mirror — when you see yourself, fully,
                  as you intended — and something shifts."
                </Display>
                <Label sx={{ color: T.lightgrey }}>The Amour Estilo Appointment</Label>
              </Box>
            </Box>
          </Grid>

          {/* Body blocks */}
          <Grid item xs={12} md={8}>
            <Box sx={{
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateX(20px)",
              transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.13s",
            }}>
              {[
                { heading: "Before we begin",  text: "We are often asked what makes an Amour Estilo appointment different. The answer is not a single thing. It is everything, considered together. It is the artist who arrives not merely on time, but prepared — having already absorbed everything shared in the consultation, already made decisions about your skin, your look, your light." },
                { heading: "During the work",  text: "It is the products you can feel the quality of before you see the result. The weight of a brush that has been chosen, not grabbed. The texture of a foundation selected for your skin specifically — not for the client before you. The unhurried, deliberate pace of someone who is not watching the clock — because the clock does not dictate the work. The look does." },
                { heading: "The final mirror", text: "It is the moment, midway through, when you catch a glimpse of yourself and understand — perhaps for the first time — that this is what luxury actually means: not price, not labels, but the certainty that you are in the hands of someone who cares as much as you do. And then the final mirror. The moment we were built for." },
              ].map((block, i, arr) => (
                <Box key={i} sx={{
                  mb: i < arr.length - 1 ? 8 : 0,
                  pb: i < arr.length - 1 ? 8 : 0,
                  borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : "none",
                }}>
                  <Label sx={{ mb: 3, display: "block", color: T.lightgrey }}>{block.heading}</Label>
                  <Body sx={{ fontSize: "0.79rem" }}>{block.text}</Body>
                </Box>
              ))}
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

// ─── SECTION 5 · SOP ──────────────────────────────────────────────────────────
const steps = [
  { num: "01", title: "The Consultation",               body: "Every appointment begins not with products, but with a conversation. We study your skin, your occasion, your cultural context, and your aesthetic vision. The look we design here is the look that will serve you." },
  { num: "02", title: "Skin Preparation & Hygiene",     body: "Sanitised tools. Individual disposables. A comprehensive skin preparation regimen — cleanse, prime, treat — that creates the conditions for makeup to bond with skin, not merely sit on it." },
  { num: "03", title: "Product Curation",               body: "Every item in the application sequence is pre-selected for you. Foundation shade-matched in natural light. Pigments chosen for your occasion's specific lighting. Nothing generic. Nothing accidental." },
  { num: "04", title: "The Application",                body: "Our artists work with a jeweller's precision. Foundation as skin, not mask. Contour as dimension, not sculpture. Colour as feeling, not formula. Each layer built with intention, unhurriedly." },
  { num: "05", title: "Setting & Longevity Seal",       body: "A beautiful look that fails at hour three is a broken promise. We seal every look with professional fixatives designed to perform through ceremony, camera flash, heat, and hours of wear." },
  { num: "06", title: "Final Review & Client Approval", body: "We do not declare an appointment finished. We ask if you are ready. We refine until the look is not merely what we intended — but exactly what you need. Your vision is the final authority." },
];

function SOP() {
  const [ref, vis] = useFade();
  return (
    <Box ref={ref} sx={{ bgcolor: T.offwhite, py: { xs: 10, md: 18 }, borderBottom: `1px solid ${T.hairline}` }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <SectionRule label="Standard of Excellence" />

        <Grid container spacing={{ xs: 4, md: 16 }} sx={{ mb: { xs: 8, md: 14 } }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ opacity: vis ? 1 : 0, transition: "opacity 0.9s" }}>
              <Display sx={{ fontSize: { xs: "2.6rem", md: "4.2rem" }, lineHeight: 1.05, mb: 4 }}>
                A Protocol{" "}
                <Box component="em" sx={{ fontStyle: "italic" }}>Worthy</Box>
                <br />of Your Moment
              </Display>
              <Body sx={{ maxWidth: 400 }}>
                What separates a luxury experience from an ordinary one is
                not talent alone — it is process. Every Amour Estilo
                appointment follows our proprietary six-step Standard
                Operating Protocol, designed for the rigour of haute fashion
                and the intimacy of personal beauty.
              </Body>
            </Box>
          </Grid>
        </Grid>

        {/* Steps table */}
        <Box sx={{ bgcolor: T.white, border: `1px solid ${T.hairline}` }}>
          {steps.map((s, i) => (
            <Box key={i} sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "72px 1fr 2.4fr" },
              borderBottom: i < steps.length - 1 ? `1px solid ${T.hairline}` : "none",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(14px)",
              transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`,
              transition: "background 0.35s",
              "&:hover": { bgcolor: T.offwhite },
              cursor: "default",
            }}>
              {/* Number */}
              <Box sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center", justifyContent: "center",
                borderRight: `1px solid ${T.hairline}`,
                p: 3,
              }}>
                <Label sx={{ fontSize: "0.52rem", color: T.hairline }}>{s.num}</Label>
              </Box>
              {/* Title */}
              <Box sx={{
                borderRight: { xs: "none", md: `1px solid ${T.hairline}` },
                p: { xs: 4, md: 6 },
                display: "flex", alignItems: "center",
              }}>
                <Typography sx={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400, fontStyle: "italic",
                  fontSize: "1.12rem", color: T.charcoal, lineHeight: 1.3,
                }}>
                  {s.title}
                </Typography>
              </Box>
              {/* Body */}
              <Box sx={{ p: { xs: "0 16px 16px", md: 6 }, display: "flex", alignItems: "center" }}>
                <Body sx={{ fontSize: "0.71rem" }}>{s.body}</Body>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ─── SECTION 6 · PRODUCTS ─────────────────────────────────────────────────────
const brands = [
  "Charlotte Tilbury", "Armani Beauty", "Dior Beauty",
  "Chanel Beauté",    "NARS",           "YSL Beauté",
  "Hourglass",        "Clé de Peau",    "Westman Atelier",
  "La Mer",
];

function Products() {
  const [ref, vis] = useFade();
  return (
    <Box ref={ref} sx={{ bgcolor: T.white, py: { xs: 10, md: 18 }, borderBottom: `1px solid ${T.hairline}` }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <SectionRule label="Luxe Products" />
        <Grid container spacing={{ xs: 6, md: 16 }} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Box sx={{ opacity: vis ? 1 : 0, transition: "opacity 0.9s" }}>
              <Display sx={{ fontSize: { xs: "2.5rem", md: "3.4rem" }, lineHeight: 1.1, mb: 5 }}>
                A Kit That{" "}
                <Box component="em" sx={{ fontStyle: "italic" }}>Earns</Box>
                {" "}Its Place
              </Display>
              <Body sx={{ mb: 4 }}>
                We are not loyal to labels. We are loyal to results. Every
                product in our kit has been tested rigorously — on real skin,
                in real conditions, across real occasions.
              </Body>
              <Body>
                Global luxury, always filtered through personal relevance.
                The moment something better exists, our kit evolves. We are
                working artists, and our tools must be equal to our ambition.
              </Body>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{
              border: `1px solid ${T.hairline}`,
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(20px)",
              transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}>
              {brands.map((brand, i) => (
                <Box key={i} sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 5, py: 3.5,
                  borderBottom: i < brands.length - 1 ? `1px solid ${T.hairline}` : "none",
                  transition: "background 0.3s",
                  "&:hover": { bgcolor: T.offwhite },
                  "&:hover .brand-line": { opacity: 1 },
                  cursor: "default",
                }}>
                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.05rem", fontStyle: "italic",
                    fontWeight: 400, color: T.charcoal,
                    letterSpacing: "0.025em",
                  }}>
                    {brand}
                  </Typography>
                  {/* Animated arrow */}
                  <Box className="brand-line" sx={{
                    width: 24, height: "1px", bgcolor: T.lightgrey,
                    opacity: 0, transition: "opacity 0.3s",
                    position: "relative",
                    "&::after": {
                      content: '""', position: "absolute",
                      right: 0, top: -3,
                      width: 6, height: 6,
                      borderRight: `1px solid ${T.lightgrey}`,
                      borderTop: `1px solid ${T.lightgrey}`,
                      transform: "rotate(45deg)",
                    },
                  }} />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── SECTION 7 · PROMISE ──────────────────────────────────────────────────────
const promises = [
  { title: "Excellence Without Exception",    body: "Our standard does not scale with occasion size, booking value, or geography. The bride with an intimate wedding receives the same depth of care as the celebrity preparing for a national broadcast. Excellence, at Amour Estilo, is not a tier. It is a baseline." },
  { title: "Artistry in Service of You",      body: "We have no interest in a look that showcases our technique at the expense of your truth. Our artistry exists entirely in service of your vision — your identity, your occasion, your relationship with your own beauty." },
  { title: "Presence, Wherever You Need Us", body: "Bengaluru is our home. The world is our studio. We travel on demand — across India, across borders, across time zones — because the client who needs the Amour Estilo standard in another city deserves it just as completely." },
];

function Promise() {
  const [ref, vis] = useFade();
  return (
    <Box ref={ref} sx={{ bgcolor: T.offwhite, py: { xs: 10, md: 18 }, borderBottom: `1px solid ${T.hairline}` }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <SectionRule label="Our Promise" />

        <Box sx={{ mb: { xs: 10, md: 14 }, opacity: vis ? 1 : 0, transition: "opacity 1s" }}>
          <Display sx={{ fontSize: { xs: "2.4rem", md: "4.2rem" }, lineHeight: 1.04 }}>
            Three Promises.{" "}
            <Box component="em" sx={{ fontStyle: "italic" }}>No Exceptions.</Box>
          </Display>
        </Box>

        <Grid container spacing={0} sx={{
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}>
          {promises.map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box sx={{
                bgcolor: T.white,
                border: `1px solid ${T.hairline}`,
                ml: i > 0 ? { xs: 0, md: "-1px" } : 0,
                mt: i > 0 ? { xs: "-1px", md: 0 } : 0,
                p: { xs: 5, md: 7 },
                height: "100%",
                transition: "background 0.4s",
                "&:hover": { bgcolor: T.offwhite, zIndex: 1, position: "relative" },
                cursor: "default",
              }}>
                <Box sx={{ width: 24, height: "1px", bgcolor: T.hairline, mb: 5 }} />
                <Typography sx={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.25rem", fontWeight: 400,
                  fontStyle: "italic", color: T.black,
                  mb: 3.5, lineHeight: 1.3,
                }}>
                  {item.title}
                </Typography>
                <Body sx={{ fontSize: "0.69rem" }}>{item.body}</Body>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── SECTION 8 · CLOSING ──────────────────────────────────────────────────────
function Closing() {
  const [ref, vis] = useFade();
  return (
    <Box ref={ref} sx={{
      bgcolor: T.black,
      py: { xs: 14, md: 22 },
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ghost Æ */}
      <Typography sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: { xs: "42vw", md: "28vw" },
        fontWeight: 300, fontStyle: "italic",
        color: "rgba(255,255,255,0.025)",
        pointerEvents: "none", userSelect: "none", lineHeight: 1,
      }}>
        Æ
      </Typography>

      <Container maxWidth="md" sx={{
        position: "relative", zIndex: 1,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: "all 1.1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <Label sx={{ color: "rgba(255,255,255,0.22)", display: "block", mb: 8 }}>
          Amour Estilo · Atelier de Beauté
        </Label>

        <Display sx={{
          fontSize: { xs: "3.2rem", md: "5.8rem" },
          color: "#FFFFFF", mb: 8, lineHeight: 0.97,
        }}>
          Your Beauty.
          <br />
          <Box component="em" sx={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>
            Our Obsession.
          </Box>
        </Display>

        <Box sx={{ width: 36, height: "1px", bgcolor: "rgba(255,255,255,0.12)", mx: "auto", mb: 8 }} />

        <Body sx={{
          color: "rgba(255,255,255,0.4)",
          maxWidth: 460, mx: "auto", mb: 12,
          fontSize: "0.74rem",
        }}>
          Amour Estilo is not a service. It is a relationship — between artist
          and muse, between technique and vision, between the face we are given
          and the presence we choose to inhabit.
        </Body>

        {/* Contact strip */}
        <Stack direction={{ xs: "column", sm: "row" }} sx={{
          border: "1px solid rgba(255,255,255,0.08)",
          display: "inline-flex",
        }}>
          {[
            { label: "Location",     val: "Bengaluru, India" },
            { label: "Reach",        val: "Pan-India · Global" },
            { label: "Appointments", val: "By Enquiry Only" },
          ].map((item, i) => (
            <Box key={i} sx={{
              px: { xs: 5, md: 7 }, py: 4,
              borderRight: { xs: "none", sm: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" },
              borderBottom: { xs: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", sm: "none" },
            }}>
              <Label sx={{ color: "rgba(255,255,255,0.2)", display: "block", mb: 1 }}>{item.label}</Label>
              <Typography sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300, fontSize: "0.68rem",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.06em",
              }}>
                {item.val}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <Box sx={{
      bgcolor: T.black,
      borderTop: "1px solid rgba(255,255,255,0.05)",
      px: { xs: 4, md: 10 }, py: 4,
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 2,
    }}>
      <Typography sx={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300, fontSize: "0.85rem",
        letterSpacing: "0.32em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.18)",
      }}>
        Amour Estilo
      </Typography>
      <Label sx={{ color: "rgba(255,255,255,0.12)" }}>
        Love for Style. Mastery in Every Brushstroke.
      </Label>
      <Label sx={{ color: "rgba(255,255,255,0.1)" }}>
        © {new Date().getFullYear()} Amour Estilo. All rights reserved.
      </Label>
    </Box>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
export default function AmourEstiloAbout() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: T.white, overflowX: "hidden" }}>
        <Hero />
        <Maison />
        <Philosophy />
        <Experience />
        <SOP />
        <Products />
        <Promise />
        <Closing />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}