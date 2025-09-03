// src/pages/UserPage.jsx
import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import ContactForm from "../components/ContactForm";
import contactIllustration from "../assets/undraw_contact-us_kcoa.svg";

export default function UserPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Encabezado */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🛍️ G3 Market
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          ¿Tienes una pregunta? Escríbenos y te responderemos a la brevedad.
        </Typography>

        {/* Ilustración */}
        <Box
          component="img"
          src={contactIllustration} 
          alt="Ilustración de contacto"
          sx={{
            width: "100%",
            maxWidth: 500,
            height: "auto",
            opacity: 0.9,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            mb: 4,
          }}
        />
      </Box>

      {/* Formulario */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <ContactForm />
      </Paper>

      {/* Pie de página */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        © 2025 TiendaOnline. Todos los mensajes se envían en tiempo real.
      </Typography>
    </Container>
  );
}