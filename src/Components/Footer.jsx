import {
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 12,
        px: { xs: 3, md: 8 },
        py: 8,
        backgroundColor: "#000000",
        borderTop: "1px solid #151515",
      }}
    >
      <Grid container spacing={6}>
        {/* BRAND */}
        <Grid item xs={12} md={3}>
          <Typography
            sx={{
              fontSize: "14px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            Amour Estilo
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#d5d5d5",
              lineHeight: 1.6,
            }}
          > hello 
          </Typography>
        </Grid>

        {/* CUSTOMER CARE */}
        <Grid item xs={12} md={3}>
          <Typography
            sx={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            Customer Care
          </Typography>

          {["Contact Us", "Shipping & Returns", "FAQs"].map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: "12px",
                color: "#d5d5d5",
                mb: 1.2,
                cursor: "pointer",
                "&:hover": { opacity: 0.7 },
              }}
            >
              {item}
            </Typography>
          ))}
        </Grid>

        {/* COMPANY */}
        <Grid item xs={12} md={3}>
          <Typography
            sx={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            Company
          </Typography>

          {["About Us", "Careers", "Sustainability"].map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: "12px",
                color: "#d5d5d5",
                mb: 1.2,
                cursor: "pointer",
                "&:hover": { opacity: 0.7 },
              }}
            >
              {item}
            </Typography>
          ))}
        </Grid>

        {/* SOCIAL */}
        <Grid item xs={12} md={3}>
          <Typography
            sx={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            Follow
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small">
              <InstagramIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <TwitterIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* BOTTOM */}
      <Box
        sx={{
          mt: 8,
          pt: 3,
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            letterSpacing: "1.5px",
            color: "#c9c9c9",
          }}
        >
          © {new Date().getFullYear()} Amour Estilo. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
