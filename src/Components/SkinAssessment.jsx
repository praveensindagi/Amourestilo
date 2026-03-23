import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
} from "@mui/material";

export default function SkinAssessment() {

  const [step, setStep] = useState(0);

  const [skinType, setSkinType] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [pigmentation, setPigmentation] = useState(30);
  const [oil, setOil] = useState(40);
  const [acne, setAcne] = useState(20);
  const [style, setStyle] = useState("");

  const [result, setResult] = useState(null);

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const generateResult = () => {

    let foundation = "";
    let finish = "";

    if (skinType === "Oily" || oil > 70) {
      foundation = "Oil Free Matte Foundation";
      finish = "Matte Finish";
    } else if (skinType === "Dry") {
      foundation = "Hydrating Dewy Foundation";
      finish = "Dewy Finish";
    } else {
      foundation = "Satin Natural Foundation";
      finish = "Natural Skin Finish";
    }

    setResult({
      foundation,
      finish,
      skinTone,
      style
    });

    next();
  };

  const renderStep = () => {

    switch(step){

      case 0:
        return (
          <>
            <Typography variant="h4" mb={4}>
              What is your skin type?
            </Typography>

            <ToggleButtonGroup
              value={skinType}
              exclusive
              onChange={(e,v)=>setSkinType(v)}
            >
              <ToggleButton value="Dry">Dry</ToggleButton>
              <ToggleButton value="Normal">Normal</ToggleButton>
              <ToggleButton value="Combination">Combination</ToggleButton>
              <ToggleButton value="Oily">Oily</ToggleButton>
            </ToggleButtonGroup>
          </>
        )

      case 1:
        return (
          <>
            <Typography variant="h4" mb={4}>
              Select your skin tone
            </Typography>

            <ToggleButtonGroup
              value={skinTone}
              exclusive
              onChange={(e,v)=>setSkinTone(v)}
            >
              <ToggleButton value="Fair">Fair</ToggleButton>
              <ToggleButton value="Light">Light</ToggleButton>
              <ToggleButton value="Medium">Medium</ToggleButton>
              <ToggleButton value="Tan">Tan</ToggleButton>
              <ToggleButton value="Deep">Deep</ToggleButton>
            </ToggleButtonGroup>
          </>
        )

      case 2:
        return (
          <>
            <Typography variant="h4" mb={4}>
              Pigmentation Level
            </Typography>

            <Slider
              value={pigmentation}
              onChange={(e,v)=>setPigmentation(v)}
            />
          </>
        )

      case 3:
        return (
          <>
            <Typography variant="h4" mb={4}>
              Oil Level
            </Typography>

            <Slider
              value={oil}
              onChange={(e,v)=>setOil(v)}
            />
          </>
        )

      case 4:
        return (
          <>
            <Typography variant="h4" mb={4}>
              Acne Level
            </Typography>

            <Slider
              value={acne}
              onChange={(e,v)=>setAcne(v)}
            />
          </>
        )

      case 5:
        return (
          <>
            <Typography variant="h4" mb={4}>
              Preferred Makeup Style
            </Typography>

            <ToggleButtonGroup
              value={style}
              exclusive
              onChange={(e,v)=>setStyle(v)}
            >
              <ToggleButton value="Natural">Natural</ToggleButton>
              <ToggleButton value="Clean Aesthetic">Clean Aesthetic</ToggleButton>
              <ToggleButton value="Soft Glam">Soft Glam</ToggleButton>
              <ToggleButton value="Full Glam">Full Glam</ToggleButton>
            </ToggleButtonGroup>
          </>
        )

      case 6:
        return (
          <>
            <Typography variant="h3" mb={3}>
              Your Skin Result
            </Typography>

            <Typography>
              Foundation : {result.foundation}
            </Typography>

            <Typography>
              Finish : {result.finish}
            </Typography>

            <Typography>
              Skin Tone : {result.skinTone}
            </Typography>

            <Typography>
              Makeup Style : {result.style}
            </Typography>
          </>
        )

      default:
        return null
    }

  }

  return (

    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f6f6f6"
      }}
    >

      <Fade in timeout={500}>
        <Card
          sx={{
            width: 600,
            textAlign: "center",
            p: 4,
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
          }}
        >

          <CardContent>

            {renderStep()}

            <Box mt={6}>

              {step > 0 && step < 6 && (
                <Button onClick={back} sx={{mr:2}}>
                  Back
                </Button>
              )}

              {step < 5 && (
                <Button
                  variant="contained"
                  onClick={next}
                  sx={{bgcolor:"black"}}
                >
                  Next
                </Button>
              )}

              {step === 5 && (
                <Button
                  variant="contained"
                  onClick={generateResult}
                  sx={{bgcolor:"black"}}
                >
                  Get Result
                </Button>
              )}

            </Box>

          </CardContent>

        </Card>
      </Fade>

    </Box>

  );
}