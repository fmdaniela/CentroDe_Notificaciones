import React from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import ContactForm from "../components/ContactForm";
import contactIllustration from "../assets/undraw_contact-us_kcoa.svg";
import BackButton from "../components/BackButton";

export default function UserPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <BackButton 
        variant="home" 
        sx={{ 
          alignSelf: "flex-start", 
          mb: 2,
          position: { xs: 'relative', sm: 'absolute' },
          top: { sm: 24 },
          left: { sm: 24 }
        }} 
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
          justifyContent: "center",
        }}
      >
        {/* Sección izquierda - Ilustración y texto */}
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            maxWidth: { md: 500 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            🛍️ G3 Market
          </Typography>
          
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight="600"
            sx={{ 
              color: 'primary.main',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            ¡Hola, nos alegra verte de nuevo!
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            ¿Tienes una pregunta? Escríbenos y te responderemos a la brevedad.
          </Typography>

          {/* Ilustración */}
          <Box
            component="img"
            src={contactIllustration}
            alt="Ilustración de contacto"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              opacity: 0.9,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(33, 150, 243, 0.15)",
              mb: 2,
              display: { xs: 'none', md: 'block' }
            }}
          />
        </Box>

        {/* Sección derecha - Formulario */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={4}
            sx={{
              width: "100%",
              maxWidth: 500,
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: "1px solid",
              borderColor: "divider",
              transform: "translateY(0)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.2)"
              }
            }}
          >
            <ContactForm />
          </Paper>
        </Box>
      </Box>

      {/* Ilustración para móviles */}
      <Box
        component="img"
        src={contactIllustration}
        alt="Ilustración de contacto"
        sx={{
          width: "100%",
          maxWidth: 300,
          height: "auto",
          opacity: 0.9,
          borderRadius: 2,
          boxShadow: "0 6px 16px rgba(33, 150, 243, 0.15)",
          mt: 4,
          mx: 'auto',
          display: { xs: 'block', md: 'none' }
        }}
      />

      {/* Pie de página */}
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mt: 4,
          textAlign: 'center',
          opacity: 0.8
        }}
      >
        © 2025 TiendaOnline. Todos los mensajes se envían en tiempo real.
      </Typography>
    </Container>
  );
}