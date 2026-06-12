import React from "react";
import { Box, Typography, Button } from "@mui/material";

const looks = [
  {
    title: "CLEAN GIRL",
    category: "SIGNATURE LOOK",
    tagline: "Fresh luminous skin with natural glow",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
  },
  {
    title: "SOFT GLAM",
    category: "LUXE BEAUTY",
    tagline: "Effortless elegance with sculpted glow",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2"
  },
  {
    title: "GLASS SKIN",
    category: "SKIN PERFECTION",
    tagline: "Ultra hydrated radiant complexion",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
  }
];

export default function LookGallery() {
  return (
    <Box>

      {looks.map((look, index) => (
        <Box
          key={index}
          sx={{
            height: "100vh",
            position: "relative",
            backgroundImage: `url(${look.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >

          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))"
            }}
          />

          {/* Content */}
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              color: "white",
              maxWidth: "600px"
            }}
          >

            <Typography
              sx={{
                letterSpacing: 4,
                fontSize: 12,
                mb: 1
              }}
            >
              {look.category}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 42, md: 64 },
                fontFamily: "Playfair Display",
                mb: 2
              }}
            >
              {look.title}
            </Typography>

            <Typography sx={{ mb: 4 }}>
              {look.tagline}
            </Typography>

            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                px: 4,
                "&:hover": {
                  background: "white",
                  color: "black"
                }
              }}
            >
              Explore Look
            </Button>

          </Box>
        </Box>
      ))}

    </Box>
  );
}