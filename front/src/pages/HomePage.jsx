// src/pages/public/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const HomePage = () => {
  return (
    <Box
      sx={{
        
        borderRadius:'2px',
        boxShadow: '0px 4px 10px gray',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Typography
      
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          bgcolor: '#b6c7d7ff', 
          borderRadius:'4px',
          fontWeight: 'bold',
          color: '#353535ff',
          textAlign: 'center',
          boxShadow:'0px 4px 15px #2a2929ff',
          padding:8,
          px: 18,
          py: 6,
        }}
      >
       Centro de Notificaciones
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} mt={5}>
        <Button
          component={Link}
          to="/user"
          variant="contained"
          startIcon={<PersonIcon />}
          sx={{
            bgcolor: '#A6BE41',
            color: '#fff',
            px: 5,
            py: 2,
            fontWeight: 'bold',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#849f19ff',
              transform: 'translateY(-3px)',
              
            },
          }}
        >
          Login de Usuario
        </Button>

        <Button
          component={Link}
          to="/admin"
          variant="contained"
          startIcon={<AdminPanelSettingsIcon />}
          sx={{
            bgcolor: '#5941BE',
            color: '#fff',
            px: 5,
            py: 2,
            fontWeight: 'bold',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#43357eff',
              transform: 'translateY(-3px)',
          
            },
          }}
        >
          Login de Administrador
        </Button>
      </Stack>
    </Box>
  );
};

export default HomePage;

