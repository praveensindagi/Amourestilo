import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NorthEastIcon from "@mui/icons-material/NorthEast";

// ─── GOOGLE FONTS (add to your index.html <head>) ────────────────────────────
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet">

// ─── THEME ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0a0a0a" },
    background: { default: "#ffffff", paper: "#f5f4f2" },
    text: { primary: "#0a0a0a", secondary: "#6b6b6b" },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": { boxSizing: "border-box", margin: 0, padding: 0 },
        html: { scrollBehavior: "smooth" },
      },
    },
  },
});

// ─── STYLED PRIMITIVES ────────────────────────────────────────────────────────
const Eyebrow = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: "0.6rem",
  letterSpacing: "0.45em",
  textTransform: "uppercase",
  color: "#9a9a9a",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  "&::before": {
    content: '""',
    display: "block",
    width: 28,
    height: 0.5,
    background: "#9a9a9a",
    flexShrink: 0,
  },
});

const DisplayHeading = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  lineHeight: 1.05,
  color: "#0a0a0a",
  "& em": {
    fontStyle: "italic",
    fontWeight: 300,
  },
});

const BodyText = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: "0.78rem",
  lineHeight: 2,
  letterSpacing: "0.03em",
  color: "#5a5a5a",
});

const ThinDivider = styled(Divider)({
  borderColor: "rgba(10,10,10,0.08)",
  borderBottomWidth: 0.5,
});

// ─── FADE-IN HOOK ─────────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── FADE WRAPPER ─────────────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, style = {} }) => {
  const [ref, visible] = useFadeIn();
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s cubic-bezier(.22,.68,0,1.2) ${delay}ms, transform 0.9s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ROLES = [
  { dept: "Artistry", title: "Senior Makeup Artist — Bridal & Couture", meta: "Bengaluru · Full-Time · Travel Required" },
  { dept: "Artistry", title: "Makeup Artist — Film & Editorial", meta: "Bengaluru · Full-Time · On-Set" },
  { dept: "Artistry", title: "Junior Makeup Artist — All Services", meta: "Bengaluru · Full-Time · Training Provided" },
  { dept: "Operations", title: "Client Experience Manager", meta: "Bengaluru · Full-Time" },
  { dept: "Creative", title: "Creative Director — Brand & Visual Identity", meta: "Bengaluru / Remote · Senior Role" },
  { dept: "Training", title: "Atelier Trainer — SOP & Technique", meta: "Bengaluru · Full-Time" },
  { dept: "Growth", title: "Brand & Partnerships Manager", meta: "Bengaluru · Full-Time" },
];

const VALUES = [
  { num: "01", title: "Mastery", desc: "Technical excellence built through deliberate, continuous practice — never shortcuts." },
  { num: "02", title: "Integrity", desc: "Every commitment honoured — to our clients, to each other, and to our standards." },
  { num: "03", title: "Elegance", desc: "In how we work, communicate, and present. Elegance is an attitude, not an aesthetic." },
  { num: "04", title: "Ambition", desc: "Building India's finest luxury beauty house demands vision, courage, and relentless drive." },
];

const PERKS = [
  { title: "Luxury Kit Access", desc: "Work with the world's finest makeup products on every engagement." },
  { title: "Global Travel", desc: "Fly anywhere on-demand. Build your portfolio across geographies and cultures." },
  { title: "Atelier Training", desc: "SOP-based mentorship, senior artist shadowing, and continuous development." },
  { title: "Creative Freedom", desc: "Full artistic latitude within our standards. We hire for vision." },
  { title: "Cross-Industry Work", desc: "Film, bridal, editorial, advertising, corporate — the broadest possible portfolio." },
  { title: "Competitive Pay", desc: "Premium remuneration reflecting the luxury nature of our work." },
];

const STATS = [
  { num: "7+", label: "Service Verticals" },
  { num: "∞", label: "Fly Anywhere" },
  { num: "SOP", label: "Certified Standard" },
  { num: "All", label: "Industries Served" },
];

const STEPS = [
  { num: "01", title: "Submit Portfolio", desc: "Send your curated portfolio and a brief letter of intent." },
  { num: "02", title: "Conversation", desc: "A personal discussion about your journey and vision." },
  { num: "03", title: "Artistry Review", desc: "A practical or technical session — we see your craft live." },
  { num: "04", title: "Welcome", desc: "An offer, onboarding, and the start of your Amour Estilo story." },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const HeroSection = () => (
  <Box sx={{ bgcolor: "#ffffff", pt: "80px" }}>
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left — black panel */}
      <Grid
        item xs={12} md={6}
        sx={{
          bgcolor: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 4, md: 10 },
          py: { xs: 10, md: 16 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 56px)",
          },
        }}
      >
        <FadeIn>
          <Eyebrow sx={{ color: "#7a7a7a", "&::before": { background: "#7a7a7a" }, mb: 4 }}>
            Careers at Amour Estilo
          </Eyebrow>
        </FadeIn>
        <FadeIn delay={120}>
          <DisplayHeading variant="h1" sx={{ fontSize: { xs: "3.2rem", md: "4.8rem", lg: "6rem" }, color: "#ffffff" }}>
            Create<br />
            <Box component="em" sx={{ color: "#c4a882" }}>Beauty.</Box><br />
            Define<br />
            Excellence.
          </DisplayHeading>
        </FadeIn>
        <FadeIn delay={240}>
          <Typography sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 200,
            fontSize: "0.6rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            mt: 5,
            lineHeight: 2.4,
          }}>
            Bengaluru · India · Worldwide<br />
            High Fashion Luxe Makeup
          </Typography>
        </FadeIn>
      </Grid>

      {/* Right — stats + manifesto */}
      <Grid
        item xs={12} md={6}
        sx={{
          bgcolor: "#f5f4f2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: { xs: 4, md: 8 },
          py: { xs: 8, md: 12 },
        }}
      >
        <FadeIn delay={200}>
          <Grid container sx={{ mb: 8, border: "0.5px solid rgba(10,10,10,0.1)" }}>
            {STATS.map((s, i) => (
              <Grid
                item xs={6} key={i}
                sx={{
                  p: 3.5,
                  borderRight: i % 2 === 0 ? "0.5px solid rgba(10,10,10,0.1)" : "none",
                  borderBottom: i < 2 ? "0.5px solid rgba(10,10,10,0.1)" : "none",
                }}
              >
                <Typography sx={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "2.8rem",
                  lineHeight: 1,
                  color: "#0a0a0a",
                }}>
                  {s.num}
                </Typography>
                <Typography sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#9a9a9a",
                  mt: 1,
                }}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </FadeIn>
        <FadeIn delay={320}>
          <Typography sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: { xs: "1.2rem", md: "1.4rem" },
            color: "#5a5a5a",
            lineHeight: 1.65,
            maxWidth: 420,
          }}>
            "We do not merely apply makeup — we sculpt presence, command rooms, and leave impressions that endure."
          </Typography>
        </FadeIn>
      </Grid>
    </Grid>
  </Box>
);

const MaisonSection = () => (
  <Box sx={{ bgcolor: "#ffffff", py: { xs: 10, md: 18 } }}>
    <Container maxWidth="lg">
      <FadeIn>
        <Eyebrow sx={{ mb: 3 }}>Our Maison</Eyebrow>
        <DisplayHeading variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, mb: 10 }}>
          The House of<br /><em>Amour Estilo</em>
        </DisplayHeading>
      </FadeIn>
      <Grid container spacing={{ xs: 6, md: 14 }}>
        <Grid item xs={12} md={7}>
          <FadeIn delay={80}>
            <Stack spacing={3.5}>
              {[
                "Amour Estilo was born from a singular conviction: that beauty, at its highest expression, is an art form deserving the same rigour, vision, and devotion as haute couture itself. Headquartered in Bengaluru, India's most dynamic creative capital, we have built India's pre-eminent luxury makeup service.",
                "We serve every industry — film, fashion, bridal, editorial, advertising, television, and corporate — with an unwavering commitment to precision. Our proprietary Standard Operating Procedures ensure that every client, on every engagement, receives a service of absolute consistency and flawless execution.",
                "Our artists are deployed on-demand, stationed in Bengaluru and available to travel anywhere in the world — on short notice, across time zones, for any scale of production. We carry only the world's finest luxury makeup products, curated for performance, longevity, and the rich spectrum of Indian complexions.",
              ].map((p, i) => (
                <BodyText key={i}>{p}</BodyText>
              ))}
            </Stack>
          </FadeIn>
        </Grid>
        <Grid item xs={12} md={5}>
          <FadeIn delay={180}>
            <Stack>
              {[
                { num: "01", title: "Artistry Without Compromise", desc: "Every technique refined. Every look architected. Zero shortcuts." },
                { num: "02", title: "SOP-Driven Excellence", desc: "Proprietary processes guaranteeing consistent luxury from consultation to final look." },
                { num: "03", title: "Global On-Demand Reach", desc: "Bengaluru-based, world-ready. We fly to you wherever the work demands." },
                { num: "04", title: "Products of the Finest Order", desc: "An exclusively curated palette of the world's most prestigious houses." },
              ].map((item, i) => (
                <Box key={i} sx={{ py: 3.5, borderBottom: "0.5px solid rgba(10,10,10,0.1)", "&:first-of-type": { borderTop: "0.5px solid rgba(10,10,10,0.1)" } }}>
                  <Typography sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#b0a090", mb: 1 }}>
                    {item.num}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.1rem", mb: 0.8, color: "#0a0a0a" }}>
                    {item.title}
                  </Typography>
                  <BodyText sx={{ fontSize: "0.72rem" }}>{item.desc}</BodyText>
                </Box>
              ))}
            </Stack>
          </FadeIn>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const QuoteSection = () => (
  <Box sx={{ bgcolor: "#0a0a0a", py: { xs: 12, md: 20 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
    <Box sx={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: { xs: "6rem", md: "14rem" },
      fontWeight: 300,
      color: "rgba(255,255,255,0.025)",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      userSelect: "none",
    }}>
      AMOUR ESTILO
    </Box>
    <Container maxWidth="md" sx={{ position: "relative" }}>
      <FadeIn>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2.5} sx={{ mb: 6 }}>
          <Box sx={{ width: 60, height: "0.5px", bgcolor: "#b0a090" }} />
          <Box sx={{ width: 7, height: 7, bgcolor: "#b0a090", transform: "rotate(45deg)" }} />
          <Box sx={{ width: 60, height: "0.5px", bgcolor: "#b0a090" }} />
        </Stack>
        <Typography sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: { xs: "1.6rem", md: "2.6rem" },
          lineHeight: 1.45,
          color: "#ffffff",
        }}>
          "Beauty is the discipline of light, pigment, and intention — and we practise it as a sacred art."
        </Typography>
        <Typography sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          fontSize: "0.58rem",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "#b0a090",
          mt: 5,
        }}>
          — The Amour Estilo Atelier, Bengaluru
        </Typography>
      </FadeIn>
    </Container>
  </Box>
);

const RolesSection = () => {
  const [hovered, setHovered] = useState(null);
  return (
    <Box sx={{ bgcolor: "#ffffff", py: { xs: 10, md: 18 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 14 }} sx={{ mb: 10 }}>
          <Grid item xs={12} md={5}>
            <FadeIn>
              <Eyebrow sx={{ mb: 3 }}>Open Positions</Eyebrow>
              <DisplayHeading variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "3.8rem" } }}>
                Join the<br /><em>Atelier</em>
              </DisplayHeading>
            </FadeIn>
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: "flex", alignItems: "flex-end" }}>
            <FadeIn delay={120}>
              <BodyText sx={{ maxWidth: 500 }}>
                We seek individuals who do not merely work in beauty — but who are devoted to it. Who see a face as a canvas, a brief as a creative challenge, and a client's confidence as the most meaningful result of their work.
              </BodyText>
            </FadeIn>
          </Grid>
        </Grid>

        <FadeIn delay={100}>
          <Stack>
            {ROLES.map((role, i) => (
              <Box
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 3.5,
                  px: 2,
                  borderBottom: "0.5px solid rgba(10,10,10,0.1)",
                  "&:first-of-type": { borderTop: "0.5px solid rgba(10,10,10,0.1)" },
                  cursor: "pointer",
                  bgcolor: hovered === i ? "#f8f7f5" : "transparent",
                  transition: "background 0.3s",
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.55rem",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: "#b0a090",
                    mb: 0.8,
                  }}>
                    {role.dept}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    fontSize: { xs: "1.1rem", md: "1.35rem" },
                    color: "#0a0a0a",
                    mb: 0.5,
                  }}>
                    {role.title}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.62rem",
                    letterSpacing: "0.08em",
                    color: "#9a9a9a",
                  }}>
                    {role.meta}
                  </Typography>
                </Box>
                <NorthEastIcon
                  sx={{
                    fontSize: 16,
                    color: "#b0a090",
                    flexShrink: 0,
                    transform: hovered === i ? "translate(3px,-3px)" : "translate(0,0)",
                    transition: "transform 0.3s",
                  }}
                />
              </Box>
            ))}
          </Stack>
        </FadeIn>
      </Container>
    </Box>
  );
};

const CultureSection = () => (
  <Box sx={{ bgcolor: "#0a0a0a", py: { xs: 10, md: 18 } }}>
    <Container maxWidth="lg">
      <FadeIn>
        <Eyebrow sx={{ color: "#6a6a6a", "&::before": { background: "#6a6a6a" }, mb: 3 }}>Our Culture</Eyebrow>
        <DisplayHeading variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, color: "#ffffff", mb: 10 }}>
          A Culture of<br /><em style={{ color: "#c4a882" }}>Obsession</em>
        </DisplayHeading>
      </FadeIn>
      <Grid container spacing={{ xs: 6, md: 10 }}>
        <Grid item xs={12} md={4}>
          <FadeIn delay={80}>
            <Stack spacing={3}>
              {[
                "At Amour Estilo, culture is not a set of values printed on a wall. It is lived in every brushstroke, every client call, every early morning on set.",
                "We hold ourselves to standards that most would call unreasonable. We call them necessary. We invest in our artists the way the great maisons invest in their ateliers: with time, mentorship, resources, and belief.",
                "Bengaluru is our home — vibrant, ambitious, and increasingly a global creative force. We are proud to be building here, and we are building for the world.",
              ].map((p, i) => (
                <BodyText key={i} sx={{ color: "rgba(255,255,255,0.42)" }}>{p}</BodyText>
              ))}
            </Stack>
          </FadeIn>
        </Grid>
        <Grid item xs={12} md={8}>
          <FadeIn delay={160}>
            <Grid container sx={{ border: "0.5px solid rgba(255,255,255,0.07)" }}>
              {VALUES.map((v, i) => (
                <Grid
                  item xs={12} sm={6} key={i}
                  sx={{
                    p: { xs: 4, md: 5 },
                    borderRight: i % 2 === 0 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
                    borderBottom: i < 2 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
                    transition: "background 0.3s",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                  }}
                >
                  <Typography sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#b0a090", mb: 1.5 }}>
                    {v.num}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.4rem", color: "#ffffff", mb: 1.2 }}>
                    {v.title}
                  </Typography>
                  <BodyText sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>{v.desc}</BodyText>
                </Grid>
              ))}
            </Grid>
          </FadeIn>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const PerksSection = () => (
  <Box sx={{ bgcolor: "#f5f4f2", py: { xs: 10, md: 18 } }}>
    <Container maxWidth="lg">
      <FadeIn>
        <Eyebrow sx={{ mb: 3 }}>What We Offer</Eyebrow>
        <DisplayHeading variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, mb: 10 }}>
          The Amour Estilo<br /><em>Proposition</em>
        </DisplayHeading>
      </FadeIn>
      <FadeIn delay={100}>
        <Grid container sx={{ border: "0.5px solid rgba(10,10,10,0.1)" }}>
          {PERKS.map((p, i) => (
            <Grid
              item xs={12} sm={6} md={4} key={i}
              sx={{
                p: { xs: 4, md: 5 },
                borderRight: { xs: "none", sm: i % 2 === 0 ? "0.5px solid rgba(10,10,10,0.1)" : "none", md: i % 3 !== 2 ? "0.5px solid rgba(10,10,10,0.1)" : "none" },
                borderBottom: i < PERKS.length - (PERKS.length % 3 || 3) ? "0.5px solid rgba(10,10,10,0.1)" : "none",
                bgcolor: "#f5f4f2",
                transition: "background 0.3s",
                "&:hover": { bgcolor: "#ffffff" },
              }}
            >
              <Box sx={{ width: 6, height: 6, bgcolor: "#b0a090", transform: "rotate(45deg)", mb: 3 }} />
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.1rem", mb: 1.2, color: "#0a0a0a" }}>
                {p.title}
              </Typography>
              <BodyText sx={{ fontSize: "0.72rem" }}>{p.desc}</BodyText>
            </Grid>
          ))}
        </Grid>
      </FadeIn>
    </Container>
  </Box>
);

const ProcessSection = () => (
  <Box sx={{ bgcolor: "#ffffff", py: { xs: 10, md: 18 } }}>
    <Container maxWidth="lg">
      <FadeIn>
        <Eyebrow sx={{ mb: 3 }}>Application Journey</Eyebrow>
        <DisplayHeading variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, mb: 10 }}>
          How to Join<br /><em>Amour Estilo</em>
        </DisplayHeading>
      </FadeIn>
      <FadeIn delay={100}>
        <Grid container spacing={0} sx={{ position: "relative" }}>
          {STEPS.map((step, i) => (
            <Grid item xs={12} sm={6} md={3} key={i} sx={{ p: { xs: 3, md: 4 }, position: "relative" }}>
              {i < STEPS.length - 1 && (
                <Box sx={{
                  display: { xs: "none", md: "block" },
                  position: "absolute",
                  top: 28, right: 0,
                  width: "40%",
                  height: "0.5px",
                  bgcolor: "#b0a090",
                }} />
              )}
              <Box sx={{
                width: 32, height: 32,
                border: "0.5px solid #b0a090",
                display: "flex", alignItems: "center", justifyContent: "center",
                mb: 3,
              }}>
                <Typography sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, fontSize: "0.6rem", letterSpacing: "0.1em", color: "#b0a090" }}>
                  {step.num}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.1rem", mb: 1.2, color: "#0a0a0a" }}>
                {step.title}
              </Typography>
              <BodyText sx={{ fontSize: "0.72rem" }}>{step.desc}</BodyText>
            </Grid>
          ))}
        </Grid>
      </FadeIn>
    </Container>
  </Box>
);

const CTASection = () => (
  <Box sx={{ bgcolor: "#0a0a0a", py: { xs: 14, md: 24 }, textAlign: "center" }}>
    <Container maxWidth="md">
      <FadeIn>
        <Eyebrow sx={{ justifyContent: "center", color: "#6a6a6a", "&::before": { display: "none" }, mb: 3 }}>
          Begin Your Journey
        </Eyebrow>
        <DisplayHeading variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, color: "#ffffff", mb: 3 }}>
          Your Chair Awaits<br />at the <em style={{ color: "#c4a882" }}>Atelier</em>
        </DisplayHeading>
        <BodyText sx={{ color: "rgba(255,255,255,0.38)", maxWidth: 460, mx: "auto", mb: 7 }}>
          We are not looking for applicants. We are looking for artists, thinkers, and builders who want to create something exceptional. If that is you — write to us.
        </BodyText>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Box
            component="a"
            href="mailto:careers@amourestilo.com"
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              px: 6, py: 2.2,
              bgcolor: "#b0a090",
              color: "#0a0a0a",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 0.3s",
              "&:hover": { bgcolor: "#c4b4a0" },
            }}
          >
            Apply Now
          </Box>
          <Box
            component="a"
            href="mailto:hello@amourestilo.com"
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              px: 6, py: 2.2,
              bgcolor: "transparent",
              color: "#ffffff",
              border: "0.5px solid rgba(255,255,255,0.25)",
              textDecoration: "none",
              display: "inline-block",
              transition: "border-color 0.3s",
              "&:hover": { borderColor: "#ffffff" },
            }}
          >
            General Enquiry
          </Box>
        </Stack>
      </FadeIn>
    </Container>
  </Box>
);

const FooterSection = () => (
  <Box
    sx={{
      bgcolor: "#0a0a0a",
      borderTop: "0.5px solid rgba(255,255,255,0.07)",
      px: { xs: 3, md: 8 },
      py: 4,
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1rem", letterSpacing: "0.18em", color: "#ffffff" }}>
      Amour <em>Estilo</em>
    </Typography>
    <Typography sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 200, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>
      © 2025 Amour Estilo · Bengaluru, India
    </Typography>
    <Stack direction="row" spacing={4}>
      {["Instagram", "Enquire", "Privacy"].map((link) => (
        <Typography
          key={link}
          component="a"
          href="#"
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            fontSize: "0.58rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.32)",
            textDecoration: "none",
            transition: "color 0.3s",
            "&:hover": { color: "#b0a090" },
          }}
        >
          {link}
        </Typography>
      ))}
    </Stack>
  </Box>
);

// ─── STICKY NAV ───────────────────────────────────────────────────────────────
const StickyNav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: { xs: 3, md: 8 },
        bgcolor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.98)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(10,10,10,0.08)",
        transition: "background 0.4s",
      }}
    >
      <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.1rem", letterSpacing: "0.18em", color: "#0a0a0a", cursor: "pointer" }}>
        Amour <em>Estilo</em>
      </Typography>
      <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
        {["Maison", "Services", "Roles", "Culture", "Apply"].map((item) => (
          <Typography
            key={item}
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "0.58rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#6a6a6a",
              cursor: "pointer",
              transition: "color 0.2s",
              "&:hover": { color: "#0a0a0a" },
            }}
          >
            {item}
          </Typography>
        ))}
      </Stack>
      <Box
        component="a"
        href="mailto:careers@amourestilo.com"
        sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          fontSize: "0.58rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          px: 3, py: 1.2,
          border: "0.5px solid #0a0a0a",
          color: "#0a0a0a",
          textDecoration: "none",
          transition: "background 0.3s, color 0.3s",
          "&:hover": { bgcolor: "#0a0a0a", color: "#ffffff" },
        }}
      >
        Join Us
      </Box>
    </Box>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function AmourEstiloCareers() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#ffffff", overflowX: "hidden" }}>
        <StickyNav />
        <HeroSection />
        <MaisonSection />
        <QuoteSection />
        <RolesSection />
        <CultureSection />
        <PerksSection />
        <ProcessSection />
        <CTASection />
        <FooterSection />
      </Box>
    </ThemeProvider>
  );
}