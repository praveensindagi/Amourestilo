import React from "react";
import {
  Container,
  Typography,
  Grid,
  Checkbox,
  Button,
  Paper,
  Divider,
  Box,
  TextField
} from "@mui/material";
import { styled } from "@mui/material/styles";

const services = [
  "Bridal Makeup",
  "Engagement Makeup",
  "Reception Makeup",
  "Party / Event Makeup",
  "Photoshoot / Editorial Makeup",
  "Hair Styling",
  "Skin Assessment Consultation"
];

const LuxuryTextField = styled(TextField)({
  "& label": {
    color: "#cfc6cc"
  },
  "& label.Mui-focused": {
    color: "#ffffff"
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "#6a5964"
    },
    "&:hover fieldset": {
      borderColor: "#ffffff"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ffffff"
    }
  },
  "& input": {
    color: "#fff"
  }
});

export default function BookAppointment() {
  return (
    <Box
      sx={{
        backgroundColor: "#443742",
        minHeight: "100vh",
        py: 8
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            backgroundColor: "#443742",
            border: "1px solid #6a5964"
          }}
        >
          {/* Heading */}
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontFamily: "Playfair Display, serif",
              fontWeight: 600,
              color: "#fff",
              mb: 1
            }}
          >
            Amour Estilo
          </Typography>

          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontFamily: "Playfair Display, serif",
              color: "#fff",
              mb: 3
            }}
          >
            Book an Appointment
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#cfc6cc",
              mb: 5,
              lineHeight: 1.7
            }}
          >
            Experience luxury beauty services designed to enhance your natural
            elegance. Schedule your appointment with Amour Estilo’s professional
            makeup artists and enjoy a personalized beauty experience tailored
            to your style and event.
          </Typography>

          <Divider sx={{ borderColor: "#6a5964", mb: 4 }} />

          {/* Appointment Details */}
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Appointment Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LuxuryTextField fullWidth label="Full Name" />
            </Grid>

            <Grid item xs={12} md={6}>
              <LuxuryTextField fullWidth label="Phone Number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <LuxuryTextField fullWidth label="Email Address" />
            </Grid>

            <Grid item xs={12} md={6}>
              <LuxuryTextField
                fullWidth
                label="Preferred Appointment Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LuxuryTextField fullWidth label="Preferred Time Slot" />
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#6a5964", my: 4 }} />

          {/* Service Selection */}
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Service Selection
          </Typography>

          <Typography sx={{ color: "#cfc6cc", mb: 2 }}>
            Please select the service you would like to book.
          </Typography>

          <Grid container spacing={1}>
            {services.map((service) => (
              <Grid item xs={12} md={6} key={service}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#cfc6cc",
                      "&.Mui-checked": {
                        color: "#ffffff"
                      }
                    }}
                  />
                  <Typography sx={{ color: "#fff" }}>{service}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <LuxuryTextField fullWidth label="Other Service" sx={{ mt: 2 }} />

          <Divider sx={{ borderColor: "#6a5964", my: 4 }} />

          {/* Event Information */}
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Event Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LuxuryTextField fullWidth label="Event Type" />
            </Grid>

            <Grid item xs={12} md={6}>
              <LuxuryTextField
                fullWidth
                label="Event Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LuxuryTextField fullWidth label="Event Location" />
            </Grid>

            <Grid item xs={12}>
              <LuxuryTextField
                fullWidth
                label="Getting Ready Location (if different)"
              />
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#6a5964", my: 4 }} />

          {/* Additional Requests */}
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Additional Requests
          </Typography>

          <LuxuryTextField
            fullWidth
            multiline
            rows={4}
            placeholder="Please share any special requirements or inspiration references."
          />

          <Divider sx={{ borderColor: "#6a5964", my: 4 }} />

          {/* Booking Policy */}
         <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
  Booking Policy
</Typography>

<Box
  component="ul"
  sx={{
    color: "#cfc6cc",
    pl: 3,
    mb: 4,
    lineHeight: 1.8,
    textAlign: "left"
  }}
>
  <Box component="li" sx={{ mb: 1 }}>
    Appointments are confirmed only after advance booking confirmation.
  </Box>

  <Box component="li" sx={{ mb: 1 }}>
    Clients are requested to arrive with a clean and moisturized face unless
    prior skin preparation is scheduled.
  </Box>

  <Box component="li">
    Any cancellations or rescheduling must be informed at least 24 hours in
    advance.
  </Box>
</Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 1.6,
              fontWeight: 600,
              backgroundColor: "#ffffff",
              color: "#443742",
              "&:hover": {
                backgroundColor: "#e4e0e3"
              }
            }}
          >
            Submit Appointment Request
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}