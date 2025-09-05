import React from "react";
import { Container, Typography, Box, Button, Grid, Paper } from "@mui/material";
import { 
  Person as PersonIcon, 
  AdminPanelSettings as AdminIcon 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        🛍️ G3 Market
      </Typography>
      
      <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }} align="center">
        Centro de Notificaciones en Tiempo Real
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Área de Clientes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Envía tus consultas y preguntas
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/user')}
            >
              Ir a Formulario
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <AdminIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Panel Administrativo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Gestiona notificaciones y mensajes
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => navigate('/admin')}
            >
              Ir al Panel
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}