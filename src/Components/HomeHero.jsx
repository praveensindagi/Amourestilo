import { Box, Typography } from "@mui/material";

export default function HomeHero() {
  return (

    <Box
      sx={{
        height: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("/images/home-hero.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          transform: "scale(1.02)", // subtle luxury zoom
        }}
      />

      {/* Soft overlay (very subtle) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.25))",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: { xs: 3, md: 10 },
          pb: { xs: 6, md: 10 },
          color: "#fff",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "14px" },
            letterSpacing: "3px",
            textTransform: "uppercase",
            mb: 1,
            opacity: 0.85,
          }}
        >
          New Collection
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "28px", md: "42px", lg: "52px" },
            fontWeight: 300,
            letterSpacing: "2px",
            lineHeight: 1.1,
            maxWidth: "600px",
          }}
        >
          Modern elegance,
          <br />
          defined by attitude
        </Typography>
      </Box>
    </Box>
  );
}
