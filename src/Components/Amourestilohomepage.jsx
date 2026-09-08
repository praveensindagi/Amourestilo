import React, { useState, useEffect, useRef } from "react";
import BrandsSection from "./BrandsSection";
import Front from "./Media/Front.png";
import Hairstyle from "./Media/Hairstyle.jpg";
import PortfolioVideo from "./Media/Actcocktaillook.mov";
import Prajna1 from "./Media/Prajna1.jpg";
import Amourestiloprocessbanner from "./Amourestiloprocessbanner";
//import Prajna2 from "./Media/Prajna2.png";
//import Prajna3 from "./Media/Prajna3.png";
//import Prajna4 from "./Media/Prajna4.png";
//import Prajna5 from "./Media/Prajna5.png";



import ServicesSection from "./AmourEstiloServices";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  IconButton,
  Drawer,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  black:   "#0a0a0a",
  white:   "#ffffff",
  g1:      "#2a2a2a",
  g2:      "#4a4a4a",
  g3:      "#6b6b6b",
  g4:      "#9a9a9a",
  g5:      "#c8c8c8",
  g6:      "#f0efed",
  g7:      "#f7f7f7",
  border:  "#e8e8e8",
  serif:   "'Cormorant Garamond', serif",
  sans:    "'Montserrat', sans-serif",
};

// ─── THEME ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary:    { main: C.black },
    background: { default: C.white, paper: C.g6 },
    text:       { primary: C.black, secondary: C.g3 },
  },
  typography: { fontFamily: C.sans },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*":    { boxSizing: "border-box", margin: 0, padding: 0 },
        html:   { scrollBehavior: "smooth" },
        body:   { background: C.white, overflowX: "hidden" },
        "::selection": { background: C.black, color: C.white },
      },
    },
  },
});

// ─── STYLED ATOMS ─────────────────────────────────────────────────────────────
const Display = styled(Typography)({
  fontFamily: C.serif,
  fontWeight: 300,
  lineHeight:  1.04,
  color:       C.black,
  "& em": { fontStyle: "italic" },
});

const Label = styled(Typography)({
  fontFamily:    C.sans,
  fontWeight:    300,
  fontSize:      "0.58rem",
  letterSpacing: "0.42em",
  textTransform: "uppercase",
  color:         C.g4,
});

const Body = styled(Typography)({
  fontFamily:    C.sans,
  fontWeight:    300,
  fontSize:      "0.78rem",
  lineHeight:    2,
  letterSpacing: "0.025em",
  color:         C.g2,
});

const BtnPrimary = styled("a")({
  display:        "inline-block",
  fontFamily:     C.sans,
  fontWeight:     300,
  fontSize:       "0.58rem",
  letterSpacing:  "0.38em",
  textTransform:  "uppercase",
  padding:        "14px 40px",
  background:     C.black,
  color:          C.white,
  textDecoration: "none",
  border:         `0.5px solid ${C.black}`,
  cursor:         "pointer",
  transition:     "background 0.3s, color 0.3s",
  "&:hover":      { background: C.g1, color: C.white },
});

const BtnGhost = styled("a")({
  display:        "inline-block",
  fontFamily:     C.sans,
  fontWeight:     300,
  fontSize:       "0.58rem",
  letterSpacing:  "0.38em",
  textTransform:  "uppercase",
  padding:        "14px 40px",
  background:     "transparent",
  color:          C.black,
  textDecoration: "none",
  border:         `0.5px solid ${C.black}`,
  cursor:         "pointer",
  transition:     "background 0.3s, color 0.3s",
  "&:hover":      { background: C.black, color: C.white },
});

// ─── FADE IN HOOK ─────────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const FadeUp = ({ children, delay = 0 }) => {
  const [ref, visible] = useFadeIn();
  return (
    <Box ref={ref} sx={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 1s ease ${delay}ms, transform 1s ease ${delay}ms`,
    }}>
      {children}
    </Box>
  );
};

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, center = false, light = false }) => (
  <FadeUp>
    <Box sx={{ textAlign: center ? "center" : "left", mb: { xs: 6, md: 9 } }}>
      <Label sx={{
        color: C.g4, mb: 2,
        justifyContent: center ? "center" : "flex-start",
        display: "flex", alignItems: "center", gap: "14px",
        "&::before": { content: '""', display: center ? "none" : "block", width: 24, height: "0.5px", background: C.g5, flexShrink: 0 },
      }}>
        {eyebrow}
      </Label>
      <Display variant="h2" sx={{ fontSize: { xs: "2.4rem", md: "3.8rem" }, color: light ? C.white : C.black }}>
        {title}
      </Display>
    </Box>
  </FadeUp>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ═══════════════════════════════════════════════════════════════════════════════
const HeroSection = () => {
  const words = ["Visage", "Mariée", "Cinéma", "Éclat"];
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % words.length); setFade(true); }, 500);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <Box sx={{
      minHeight:      "100vh",
      bgcolor:        C.black,
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "center",
      alignItems:     "center",
      position:       "relative",
      overflow:       "hidden",
      pt:             "80px",
    }}>
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.013) 0,rgba(255,255,255,0.013) 1px,transparent 1px,transparent 64px), repeating-linear-gradient(0deg,rgba(255,255,255,0.013) 0,rgba(255,255,255,0.013) 1px,transparent 1px,transparent 64px)",
      }} />
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontFamily: C.serif, fontWeight: 300,
        fontSize: { xs: "5rem", md: "13rem" },
        color: "rgba(255,255,255,0.025)",
        whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none",
        letterSpacing: "0.08em",
      }}>
        AMOUR ESTILO
      </Box>
      <Container maxWidth="lg" sx={{ position: "relative", textAlign: "center", px: { xs: 3, md: 8 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2.5, mb: 5 }}>
          <Box sx={{ width: 40, height: "0.5px", bgcolor: C.g3 }} />
          <Label sx={{ color: C.g3, fontSize: "0.55rem", letterSpacing: "0.5em" }}>
            Bengaluru · Pan India · Worldwide
          </Label>
          <Box sx={{ width: 40, height: "0.5px", bgcolor: C.g3 }} />
        </Box>
        <Display variant="h1" sx={{ fontSize: { xs: "3.2rem", sm: "5rem", md: "7rem", lg: "9rem" }, color: C.white, mb: 1, lineHeight: 1 }}>
          L'Art du
        </Display>
        <Box sx={{
          fontFamily: C.serif, fontWeight: 300, fontStyle: "italic",
          fontSize: { xs: "3.2rem", sm: "5rem", md: "7rem", lg: "9rem" },
          color: C.white, lineHeight: 1, mb: 5,
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          {words[idx]}
        </Box>
        <Body sx={{ color: "rgba(255,255,255,0.38)", mb: 7, fontSize: "0.72rem", letterSpacing: "0.06em" }}>
          India's Premier Luxury Makeup Atelier — High Fashion. Haute Standard.
        </Body>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <BtnPrimary href="#booking" sx={{ background: C.white, color: C.black, borderColor: C.white, "&:hover": { background: C.g6, color: C.black } }}>
            Book Your Session
          </BtnPrimary>
          <BtnGhost href="#services" sx={{ color: C.white, borderColor: "rgba(255,255,255,0.35)", "&:hover": { background: C.white, color: C.black } }}>
            Explore Services
          </BtnGhost>
        </Stack>
        <Box sx={{ mt: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Label sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.5rem", letterSpacing: "0.45em" }}>Scroll</Label>
          <Box sx={{
            width: "0.5px", height: 40, bgcolor: "rgba(255,255,255,0.2)",
            animation: "scrollPulse 2s ease-in-out infinite",
            "@keyframes scrollPulse": {
              "0%,100%": { opacity: 0.2, transform: "scaleY(1)" },
              "50%":     { opacity: 0.7, transform: "scaleY(1.3)" },
            },
          }} />
        </Box>
      </Container>
    </Box>
  );
};
<AmourEstiloDashboard/>
// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — BOOKING BANNER 1
// ═══════════════════════════════════════════════════════════════════════════════
const BookingBanner1 = () => (
  <Box id="booking" sx={{ bgcolor: C.black, py: { xs: 12, md: 20 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
    <Box sx={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.012) 0,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 64px)",
    }} />
    <Container maxWidth="md" sx={{ position: "relative" }}>
      <FadeUp>
        <Label sx={{ color: C.g3, mb: 3, justifyContent: "center", display: "flex" }}>
          Prendre Rendez-vous
        </Label>
        <Display sx={{ fontSize: { xs: "2.4rem", md: "4.2rem" }, color: C.white, mb: 3, lineHeight: 1.1 }}>
          Your Most Important Day<br />
          Deserves the <em>Finest Touch</em>
        </Display>
        <Body sx={{ color: "rgba(255,255,255,0.35)", mb: 7, maxWidth: 480, mx: "auto" }}>
          From intimate celebrations to grand productions — we bring uncompromising artistry to every occasion, anywhere in the world.
        </Body>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <BtnPrimary href="mailto:book@amourestilo.com"
            sx={{ background: C.white, color: C.black, borderColor: C.white, "&:hover": { background: C.g6 } }}>
            Book Your Session
          </BtnPrimary>
          <BtnGhost href="https://wa.me/91XXXXXXXXXX"
            sx={{ color: C.white, borderColor: "rgba(255,255,255,0.3)", "&:hover": { background: C.white, color: C.black } }}>
            WhatsApp Us
          </BtnGhost>
        </Stack>
      </FadeUp>
    </Container>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — PORTFOLIO GRID
// ═══════════════════════════════════════════════════════════════════════════════
const PORTFOLIO = [
  { label: "The Bombay Bride",  tag: "Bridal",    w: 2, h: 2, bg: "#2e2e2e", media: PortfolioVideo, type: "video" },

];

const PortfolioItem = ({ item }) => {
  const [hov, setHov] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      sx={{
        gridColumn: `span ${item.w}`,
        gridRow:    `span ${item.h}`,
        bgcolor:    item.bg,
        minHeight:  item.h === 2 ? 650 : 300,
        position:   "relative",
        overflow:   "hidden",
        cursor:     "pointer",
      }}
    >
      {/* Media layer */}
      {item.type === "video" ? (
        <Box
          component="video"
          src={item.media}
          autoPlay
          muted
          loop
          playsInline
          sx={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
          }}
        />
      ) : (
        <Box
          component="img"
          src={item.media}
          alt={item.label}
          sx={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
          }}
        />
      )}

      {/* Existing: faint watermark — only shown when no media */}
      {!item.media && (
        <Box sx={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${item.bg} 0%, rgba(0,0,0,0.6) 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Typography sx={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1.2rem", color: "rgba(255,255,255,0.12)", letterSpacing: "0.08em" }}>
            {item.label}
          </Typography>
        </Box>
      )}

      {/* Existing: hover overlay */}
      <Box sx={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.55)",
        opacity: hov ? 1 : 0, transition: "opacity 0.4s",
        display: "flex", flexDirection: "column", justifyContent: "flex-end", p: 3,
      }}>
        <Label sx={{ color: C.g4, mb: 0.8, fontSize: "0.5rem" }}>{item.tag}</Label>
        <Display sx={{ fontSize: "1.2rem", color: C.white }}>{item.label}</Display>
      </Box>
    </Box>
  );
};

const PortfolioSection = () => (
  <Box sx={{ bgcolor: C.white, py: { xs: 10, md: 16 } }}>
    <Container maxWidth="lg">
      <SectionHeader eyebrow="Le Portfolio" title={<>Our <em>Work</em></>} />
      <FadeUp delay={80}>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" },
          gridAutoRows: "230px",
          gap: "2px",
        }}>
          {PORTFOLIO.map((item, i) => <PortfolioItem key={i} item={item} />)}
        </Box>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <BtnGhost href="#portfolio">View Full Portfolio</BtnGhost>
        </Box>
      </FadeUp>
    </Container>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — LOOKS SHOWCASE
// ═══════════════════════════════════════════════════════════════════════════════
const LOOKS = [
  { name: "Smoky Eye", category: "EVENING", shade: "#2C1810", img: Front },
  { name: "Nude Glam", category: "DAYTIME", shade: "#C4956A", img: Hairstyle },

  
];

const LooksSection = () => (
  <Box sx={{ bgcolor: C.g6, py: { xs: 10, md: 16 }, overflow: "hidden" }}>
    <Container maxWidth="lg">
      <SectionHeader eyebrow="Les Regards" title={<>Makeup <em>Looks</em></>} />
    </Container>
    <FadeUp delay={80}>
      <Box sx={{
        display: "flex", gap: "2px", overflowX: "auto",
        px: { xs: 3, md: 8 }, pb: 2,
        scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
        cursor: "grab", "&:active": { cursor: "grabbing" },
      }}>
        {LOOKS.map((look, i) => (
          <Box key={i} sx={{
            flexShrink: 0,
            width: { xs: 220, md: 280 },
            height: { xs: 320, md: 400 },
            bgcolor: look.shade,
            position: "relative", overflow: "hidden",
            transition: "transform 0.3s", "&:hover": { transform: "scale(1.01)" },
          }}>
            {/* ✅ Image layer — added, sits below all overlays */}
            {look.img && (
              <Box
                component="img"
                src={look.img}
                alt={look.name}
                sx={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}

            {/* Existing: faint name watermark */}
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.1)" }}>
                {look.name}
              </Typography>
            </Box>

            {/* Existing: bottom gradient + label */}
            <Box sx={{
              position: "absolute", bottom: 0, left: 0, right: 0, p: 2.5,
              background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
            }}>
              <Label sx={{ color: C.g4, fontSize: "0.48rem", mb: 0.5 }}>{look.category}</Label>
              <Display sx={{ fontSize: "0.95rem", color: C.white }}>{look.name}</Display>
            </Box>
          </Box>
        ))}
      </Box>
    </FadeUp>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — BOOKING BANNER 2
// ═══════════════════════════════════════════════════════════════════════════════
const BookingBanner2 = () => (
  <Box sx={{ bgcolor: C.white, py: { xs: 12, md: 18 }, borderTop: `0.5px solid ${C.border}`, borderBottom: `0.5px solid ${C.border}` }}>
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <FadeUp>
        <Label sx={{ mb: 3, justifyContent: "center", display: "flex" }}>Réserver Maintenant</Label>
        <Display sx={{ fontSize: { xs: "2rem", md: "3.4rem" }, color: C.black, mb: 3, lineHeight: 1.12 }}>
          Ready for Your <em>Transformation?</em>
        </Display>
        <Body sx={{ color: C.g3, mb: 6, maxWidth: 440, mx: "auto" }}>
          Whether it is your wedding day, your screen debut, or a personal luxury session — our atelier is ready for you.
        </Body>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <BtnPrimary href="mailto:book@amourestilo.com">Book a Session</BtnPrimary>
          <BtnGhost href="tel:+91XXXXXXXXXX">Call Us</BtnGhost>
        </Stack>
        <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 7 }}>
          {["Bengaluru", "Pan India", "Worldwide"].map((loc, i) => (
            <Box key={i} sx={{ textAlign: "center" }}>
              <Label sx={{ fontSize: "0.52rem", color: C.g4 }}>{loc}</Label>
              {i < 2 && <Box sx={{ width: "0.5px", height: 16, bgcolor: C.g5, mx: "auto", mt: 1 }} />}
            </Box>
          ))}
        </Stack>
      </FadeUp>
    </Container>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — ABOUT STRIP
// ═══════════════════════════════════════════════════════════════════════════════
const STATS = [
  { num: "002", label: "Looks Created"    },
  { num: "7",    label: "Service Verticals" },
  { num: "1",    label: "Cities Reached"   },
];

const AboutStrip = () => (
  <Box sx={{ bgcolor: C.g7, py: { xs: 10, md: 16 }, borderTop: `0.5px solid ${C.border}` }}>
    <Container maxWidth="lg">
      <Grid container spacing={{ xs: 6, md: 12 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <FadeUp>
            <Label sx={{ mb: 2 }}>La Maison</Label>
            <Display sx={{ fontSize: { xs: "2.2rem", md: "3.2rem" }, mb: 3 }}>
              About <em>Amour Estilo</em>
            </Display>
            <Body sx={{ color: C.g2, mb: 4, maxWidth: 460 }}>
              Born in Bengaluru. Raised on the belief that beauty is an art form. Amour Estilo is India's premier luxury makeup atelier — serving every industry, flying to every city, holding every look to the highest standard.
            </Body>
            <BtnGhost href="/about">Discover Our Story</BtnGhost>
          </FadeUp>
        </Grid>
       
      </Grid>
    </Container>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — INSTAGRAM STRIP
// ═══════════════════════════════════════════════════════════════════════════════
const INSTA = ["#1a1a1a","#222","#1c1c1c","#252525","#181818","#2a2a2a"];

const InstagramStrip = () => (
  <Box sx={{ bgcolor: C.white, py: { xs: 10, md: 14 }, borderTop: `0.5px solid ${C.border}` }}>
    <Container maxWidth="lg">
      <FadeUp>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Label sx={{ mb: 1.5, justifyContent: "center", display: "flex" }}>Instagram</Label>
          <Display sx={{ fontSize: { xs: "1.8rem", md: "2.8rem" } }}>
            Follow the <em>Atelier</em>
          </Display>
          <Body sx={{ color: C.g3, mt: 1 }}>@amourestilo</Body>
        </Box>
      </FadeUp>
      <FadeUp delay={80}>
        <Grid container spacing="2px">
          {INSTA.map((bg, i) => (
            <Grid item xs={4} sm={2} key={i}>
              <Box sx={{
                bgcolor: bg, aspectRatio: "1", cursor: "pointer",
                transition: "opacity 0.3s", "&:hover": { opacity: 0.75 },
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Typography sx={{ color: "rgba(255,255,255,0.06)", fontFamily: C.serif, fontSize: "0.7rem" }}>✦</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <BtnGhost href="https://instagram.com/amourestilo">View on Instagram</BtnGhost>
        </Box>
      </FadeUp>
    </Container>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10 — FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
const FOOTER_LINKS = {
  "La Maison": ["Our Story", "Philosophy", "SOP Standard", "Our Artists", "Our Products"],
  "Services":  ["Bridal & Shaadi", "Film & OTT", "Fashion & Editorial", "Corporate & Events", "On-Demand"],
  "Portfolio": ["Bridal Looks", "Film & Screen", "Editorial", "Events"],
  "Connect":   ["Book a Session", "WhatsApp", "Instagram", "Careers", "Contact"],
};

const Footer = () => (
  <Box sx={{ bgcolor: C.black, pt: { xs: 10, md: 14 }, pb: 5, borderTop: `0.5px solid rgba(255,255,255,0.07)` }}>
    <Container maxWidth="lg">
      <Grid container spacing={{ xs: 5, md: 8 }} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Display sx={{ fontSize: "2rem", color: C.white, mb: 2 }}>
            Amour <em>Estilo</em>
          </Display>
          <Body sx={{ color: "rgba(255,255,255,0.32)", mb: 4, maxWidth: 280, fontSize: "0.72rem" }}>
            India's premier luxury makeup atelier. High Fashion. Haute Standard. Bengaluru & beyond.
          </Body>
          <Stack spacing={1}>
            {[
              { icon: "📍", text: "Bengaluru, Karnataka, India" },
              { icon: "✉️", text: "hello@amourestilo.com" },
              { icon: "💬", text: "WhatsApp for Bookings" },
            ].map((item, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography sx={{ fontSize: "0.7rem" }}>{item.icon}</Typography>
                <Body sx={{ color: "rgba(255,255,255,0.32)", fontSize: "0.68rem" }}>{item.text}</Body>
              </Box>
            ))}
          </Stack>
        </Grid>
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <Grid item xs={6} sm={3} md={2} key={col}>
            <Label sx={{ color: C.g3, mb: 3, fontSize: "0.52rem" }}>{col}</Label>
            <Stack spacing={1.5}>
              {links.map((link, i) => (
                <Typography key={i} component="a" href="#" sx={{
                  fontFamily: C.sans, fontWeight: 300, fontSize: "0.68rem",
                  color: "rgba(255,255,255,0.28)", textDecoration: "none",
                  letterSpacing: "0.04em", transition: "color 0.25s",
                  "&:hover": { color: C.white },
                }}>
                  {link}
                </Typography>
              ))}
            </Stack>
          </Grid>
        ))}
      </Grid>
      <Box sx={{
        borderTop: "0.5px solid rgba(255,255,255,0.07)", pt: 4,
        display: "flex", flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between", alignItems: "center", gap: 2,
      }}>
        <Label sx={{ color: "rgba(255,255,255,0.18)", fontSize: "0.5rem" }}>
          © 2026 Amour Estilo. All Rights Reserved. Bengaluru, India.
        </Label>
        <Stack direction="row" spacing={3}>
          {["Privacy Policy", "Terms of Service", "Instagram"].map((l, i) => (
            <Typography key={i} component="a" href="#" sx={{
              fontFamily: C.sans, fontWeight: 300, fontSize: "0.52rem",
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)", textDecoration: "none",
              transition: "color 0.25s", "&:hover": { color: C.g4 },
            }}>
              {l}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Container>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// STICKY NAV
// ═══════════════════════════════════════════════════════════════════════════════
const StickyNav = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [heroMode,   setHeroMode]   = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      setHeroMode(window.scrollY < window.innerHeight - 100);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["La Maison", "Services", "Portfolio", "Mariée", "Careers", "Contact"];

  return (
    <>
      <Box component="nav" sx={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 72, display: "flex", alignItems: "center",
        justifyContent: "space-between", px: { xs: 3, md: 6 },
        bgcolor: heroMode ? "rgba(10,10,10,0.0)" : "rgba(255,255,255,0.97)",
        backdropFilter: scrolled || !heroMode ? "blur(16px)" : "none",
        borderBottom: scrolled || !heroMode ? `0.5px solid ${C.border}` : "none",
        transition: "background 0.5s, border-color 0.5s",
      }}>
        <Typography component="a" href="/" sx={{
          fontFamily: C.serif, fontWeight: 300, fontSize: "1.15rem",
          letterSpacing: "0.16em", color: heroMode ? C.white : C.black,
          textDecoration: "none", transition: "color 0.4s",
          "& em": { fontStyle: "italic" },
        }}>
          Amour <em>Estilo</em>
        </Typography>
        <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
          {links.map(link => (
            <Typography key={link} component="a" href="#" sx={{
              fontFamily: C.sans, fontWeight: 300, fontSize: "0.58rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: heroMode ? "rgba(255,255,255,0.65)" : C.g3,
              textDecoration: "none", transition: "color 0.3s",
              "&:hover": { color: heroMode ? C.white : C.black },
            }}>
              {link}
            </Typography>
          ))}
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box component="a" href="mailto:book@amourestilo.com" sx={{
            display: { xs: "none", sm: "inline-block" },
            fontFamily: C.sans, fontWeight: 300, fontSize: "0.55rem",
            letterSpacing: "0.32em", textTransform: "uppercase",
            px: 2.5, py: 1.2,
            border: `0.5px solid ${heroMode ? "rgba(255,255,255,0.4)" : C.black}`,
            color: heroMode ? C.white : C.black,
            textDecoration: "none", transition: "all 0.3s",
            "&:hover": { bgcolor: heroMode ? C.white : C.black, color: heroMode ? C.black : C.white },
          }}>
            Book a Session
          </Box>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" }, color: heroMode ? C.white : C.black }}>
            <Typography sx={{ fontFamily: C.sans, fontSize: "0.7rem", letterSpacing: "0.1em" }}>☰</Typography>
          </IconButton>
        </Box>
      </Box>
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: "80vw", maxWidth: 320, bgcolor: C.black, p: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 5 }}>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: C.white }}>
            <Typography sx={{ fontSize: "1rem" }}>✕</Typography>
          </IconButton>
        </Box>
        <Stack spacing={4}>
          {links.map(link => (
            <Typography key={link} component="a" href="#" onClick={() => setMobileOpen(false)} sx={{
              fontFamily: C.serif, fontWeight: 300, fontSize: "1.6rem",
              color: C.white, textDecoration: "none",
              borderBottom: `0.5px solid rgba(255,255,255,0.08)`, pb: 2,
              "&:hover": { color: C.g4 },
            }}>
              {link}
            </Typography>
          ))}
        </Stack>
        <Box sx={{ mt: "auto", pt: 6 }}>
          <BtnPrimary href="mailto:book@amourestilo.com"
            sx={{ background: C.white, color: C.black, width: "100%", textAlign: "center" }}>
            Book a Session
          </BtnPrimary>
        </Box>
      </Drawer>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AmourEstiloHomePage() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: C.white, overflowX: "hidden" }}>
        <StickyNav />
        <HeroSection />
        <BrandsSection />
        <Amourestiloprocessbanner/>
        <PortfolioSection />
        <LooksSection />
        <BookingBanner1 />
        <AboutStrip />
        <BookingBanner2 />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}