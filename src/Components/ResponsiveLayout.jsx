import * as React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
  Toolbar,
  Divider,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

const mainMenu = [
 
  { name: "Home", path: "/" },
  { name: "Reserve Your Experience", path: "/Amourappointmentbooking" },
  { name: "Maison Amour Estilo", path: "/AmourEstiloAbout" },
  { name: "Bespoke Experiences", path: "/Amourestiloexperience" },
  { name: "Skin Consultation", path: "/HouseOfAmourEstilo" },
  { name: "Personal Color Analysis", path: "/SkinColorTheory" },
  { name: "Join The Maison", path: "/Amourestilocareers" }


  
];
const subMenu = ["Customer Care", "Store Locator", "Sustainability"];

export default function ArmaniSidebarLayout() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => setOpen((p) => !p);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* APP BAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar>
          {/* MENU ICON + TEXT */}
          <IconButton
            onClick={toggleDrawer}
            sx={{ gap: "6px", textTransform: "uppercase" }}
          >
            <MenuIcon fontSize="small" />
           
          </IconButton>

          {/* CENTER BRAND */}
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: "badoni moda",
                fontSize: "26px",
                letterSpacing: "3px",
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              Amour Estilo
            </Typography>
          </Box>

          <Box sx={{ width: 48 }} />
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        transitionDuration={{ enter: 700, exit: 500 }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "30vw" },
            maxWidth: "420px",
            backgroundColor: "#0f0f0f",
            color: "#fff",
          },
        }}
      >
        <Fade in={open} timeout={800}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              px: 4,
              pt: 6,
            }}
          >
            {/* BRAND LOGO */}
            <Typography
              sx={{
                fontSize: "14px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                mb: 6,
              }}
            >
              Amour Estilo
            </Typography>

            {/* MAIN MENU */}
            <List disablePadding>
  {mainMenu.map((item) => (
    <ListItemButton
      key={item.name}
      component={Link}
      to={item.path}
      onClick={toggleDrawer}
      sx={{
        py: 1.5,
        px: 0,
        textTransform: "uppercase",
        letterSpacing: "2px",
        fontSize: "13px",
        color: "#fff",
        "&:hover": {
          background: "transparent",
          opacity: 0.7,
        },
      }}
    >
      {item.name}
    </ListItemButton>
  ))}
</List>
            <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

            {/* SUB MENU */}
            <Box sx={{ flexGrow: 1 }}>
              {subMenu.map((item) => (
                <Typography
                  key={item}
                  sx={{
                    fontSize: "12px",
                    letterSpacing: "1.5px",
                    mb: 2,
                    opacity: 0.6,
                    cursor: "pointer",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>

            {/* FOOTER SOCIAL */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                pb: 3,
              }}
            >
              <InstagramIcon sx={{ cursor: "pointer", opacity: 0.8 }} />
              <FacebookIcon sx={{ cursor: "pointer", opacity: 0.8 }} />
              <TwitterIcon sx={{ cursor: "pointer", opacity: 0.8 }} />
            </Box>
          </Box>
        </Fade>
      </Drawer>

      {/* PAGE CONTENT */}
     
    </ThemeProvider>
  );
}
