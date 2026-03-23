import { Box, Typography, Divider, Button } from "@mui/material";

export default function Careers() {
  return (
    <Box sx={{ bgcolor: "#443742", color: "#fff", minHeight: "100vh" }}>
      
      {/* HERO */}
      <Box
        sx={{
          height: "50vh",
          display: "flex",
          alignItems: "flex-end",
          px: { xs: 4, md: 12 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "36px", md: "52px" },
            fontWeight: 300,
            letterSpacing: "3px",
          }}
        >
          Careers
        </Typography>
      </Box>

      {/* CONTENT */}
      <Box
        sx={{
          px: { xs: 4, md: 12 },
          pb: { xs: 8, md: 12 },
          maxWidth: "820px",
          textAlign: "left",
        }}
      >
        <Section
          title="Working with Amour Estilo"
          text={[
            "Amour Estilo is built on precision, professionalism, and respect for individuality.",
            "We work with artists who value refined technique, calm confidence, and continuous growth.",
            "This is not a volume-based environment. Every detail matters.",
          ]}
        />

        <Section
          title="Our Values"
          list={[
            "Craft over trends",
            "Professionalism in every detail",
            "Calm and respectful work environments",
            "Attention to skin tone and balance",
            "Continuous learning and refinement",
          ]}
        />

        <Section
          title="Who We Work With"
          text={[
            "We collaborate with makeup artists and creatives who demonstrate strong fundamentals, a refined aesthetic, and the ability to work with intention.",
            "Experience is valued, but mindset matters more.",
          ]}
        />

        <Section title="Opportunities">
          <Role
            title="Makeup Artist (Freelance / Part-Time)"
            items={[
              "Strong understanding of skin types and tones",
              "Clean and professional makeup application",
              "Calm and client-focused approach",
              "Experience in bridal, events, or editorial work",
            ]}
          />

          <Role
            title="Intern / Assistant"
            items={[
              "Interest in beauty and fashion",
              "Willingness to learn professional standards",
              "Strong attention to detail",
            ]}
          />

          <Typography sx={{ mt: 2, color: "#cfc6cc" }}>
            We are always open to hearing from talented individuals.
          </Typography>
        </Section>

        <Section
          title="Our Process"
          list={[
            "Submit your details and portfolio",
            "Initial review by our team",
            "Conversation or trial (if shortlisted)",
          ]}
        />

        <Section title="Apply">
          <Typography sx={{ mb: 3, color: "#cfc6cc", lineHeight: 1.7 }}>
            Please share your name, area of expertise, portfolio or Instagram
            link, and a short introduction.
          </Typography>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#fff",
              color: "#443742",
              borderRadius: 0,
              px: 5,
              py: 1.5,
              fontWeight: 500,
              letterSpacing: "2px",
              "&:hover": {
                bgcolor: "#eaeaea",
              },
            }}
          >
            Apply
          </Button>

          <Typography sx={{ mt: 2, fontSize: "13px", color: "#cfc6cc" }}>
            Applications are reviewed on a rolling basis.
          </Typography>
        </Section>
      </Box>
    </Box>
  );
}


/* ---------- SECTION COMPONENT ---------- */

function Section({ title, text, list, children }) {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 400,
          mb: 2,
          letterSpacing: "1px",
        }}
      >
        {title}
      </Typography>

      <Divider sx={{ mb: 3, borderColor: "#6a5964" }} />

      {text &&
        text.map((t, i) => (
          <Typography
            key={i}
            sx={{
              mb: 2,
              color: "#cfc6cc",
              lineHeight: 1.7,
            }}
          >
            {t}
          </Typography>
        ))}

      {list && (
        <Box component="ul" sx={{ pl: 3, m: 0 }}>
          {list.map((item, i) => (
            <Box
              component="li"
              key={i}
              sx={{
                mb: 1.5,
                color: "#cfc6cc",
                lineHeight: 1.6,
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      )}

      {children}
    </Box>
  );
}


/* ---------- ROLE COMPONENT ---------- */

function Role({ title, items }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontWeight: 500, mb: 1.5 }}>
        {title}
      </Typography>

      <Box component="ul" sx={{ pl: 3, m: 0 }}>
        {items.map((item, i) => (
          <Box
            component="li"
            key={i}
            sx={{
              mb: 1,
              color: "#cfc6cc",
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
}