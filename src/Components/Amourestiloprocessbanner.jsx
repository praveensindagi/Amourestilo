import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

/**
 * AmourEstiloProcessBanner (Material UI version)
 * Maison-style monochrome process banner — pure black & white only.
 * All centering and spacing is explicit via MUI `sx` props, so it
 * cannot be overridden by a host app's own CSS resets or missing
 * Tailwind config — every alignment rule lives in this file.
 */
const STEPS = [
  { num: "01", title: "Consultation", desc: "A complimentary skin consultation with our specialist." },
  { num: "02", title: "Dermat Review", desc: "A certified dermatologist examines your skin in detail." },
  { num: "03", title: "Trial", desc: "The look is tested, refined, perfected." },
  { num: "04", title: "The Day", desc: "Everything arrives, calmly, as planned." },
];

const fontDisplay = "'Cormorant Garamond', Georgia, serif";
const fontLabel = "'Jost', 'Helvetica Neue', sans-serif";

export default function AmourEstiloProcessBanner() {
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150);
    return () => clearTimeout(t);
  }, []);

  const fadeSx = (delay) => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    "@media (prefers-reduced-motion: reduce)": {
      opacity: 1,
      transform: "none",
      transition: "none",
    },
  });

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        bgcolor: "#000000",
        color: "#FFFFFF",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Font import — keep once per page if reused elsewhere */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');
      `}</style>

      <Box
        sx={{
          maxWidth: "1152px",
          mx: "auto",
          px: { xs: 3, sm: 5 },
          py: { xs: 8, sm: 10 },
        }}
      >
        {/* Headline — explicitly centered, can't be pulled left by a host app */}
        <Typography
          component="h2"
          align="center"
          sx={{
            ...fadeSx(0.05),
            fontFamily: fontDisplay,
            fontWeight: 300,
            fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
            letterSpacing: "0.02em",
            mb: 1,
            width: "100%",
          }}
        >
          The Art of Arrival
        </Typography>

        {/* Subline with flanking rules — centered via flex, not text-align inheritance */}
        <Box
          sx={{
            ...fadeSx(0.05),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: { xs: 7, sm: 9 },
            width: "100%",
          }}
        >
          <Box sx={{ width: 28, height: "1px", bgcolor: "#FFFFFF", opacity: 0.5 }} />
          <Typography
            sx={{
              fontFamily: fontLabel,
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              opacity: 0.6,
            }}
          >
            How the journey works
          </Typography>
          <Box sx={{ width: 28, height: "1px", bgcolor: "#FFFFFF", opacity: 0.5 }} />
        </Box>

        {/* Steps row — CSS grid via sx, with the connecting line as a single borderTop */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            borderTop: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          {STEPS.map((step, i) => (
            <Box
              key={step.num}
              sx={{
                ...fadeSx(0.35 + i * 0.15),
                textAlign: "center",
                px: { xs: 2, sm: 3 },
                pt: 4.5,
                pb: 3,
                borderBottom: { xs: "1px solid rgba(255,255,255,0.15)", md: "none" },
                borderLeft: { md: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)" },
                "&:last-of-type": { borderBottom: "none" },
                "&:hover .step-title": { opacity: 0.6 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontDisplay,
                  fontWeight: 300,
                  fontSize: "2.5rem",
                  opacity: 0.9,
                  mb: 2,
                }}
              >
                {step.num}
              </Typography>
              <Typography
                className="step-title"
                sx={{
                  fontFamily: fontLabel,
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  mb: 1.5,
                  transition: "opacity 0.3s ease",
                }}
              >
                {step.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontLabel,
                  fontSize: "12px",
                  lineHeight: 1.6,
                  opacity: 0.55,
                }}
              >
                {step.desc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* CTA — centered with flex, MUI Button styled to match the monochrome system */}
        <Box
          sx={{
            ...fadeSx(1.05),
            display: "flex",
            justifyContent: "center",
            mt: { xs: 6, sm: 8 },
            width: "100%",
          }}
        >
          <Button
            disableElevation
            onClick={() => navigate("/AmourAppointmentBooking")}
            sx={{
              fontFamily: fontLabel,
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              bgcolor: "#FFFFFF",
              color: "#000000",
              border: "1px solid #FFFFFF",
              borderRadius: 0,
              px: 5,
              py: 1.5,
              "&:hover": {
                bgcolor: "#000000",
                color: "#FFFFFF",
              },
            }}
          >
            Begin Step One
          </Button>
        </Box>
      </Box>
    </Box>
  );
}