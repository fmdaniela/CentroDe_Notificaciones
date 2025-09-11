import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  useTheme,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';

export default function SimpleMessageChart({ notifications }) {
  const theme = useTheme();
  
  const messagesByDay = notifications.reduce((acc, notification) => {
    const date = new Date(notification.at).toLocaleDateString('es-ES');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const maxMessages = Math.max(...Object.values(messagesByDay), 1);
  const totalMessages = notifications.length;

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mt: 3, 
        borderRadius: 3,
        background: theme.palette.background.paper
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        📈 Estadísticas de Mensajes
      </Typography>

      {/* Card de totales */}
      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {totalMessages}
          </Typography>
          <Typography variant="body2">
            mensajes totales
          </Typography>
        </CardContent>
      </Card>

      {/* Gráfico de barras */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
          Distribución por día:
        </Typography>
        
        {Object.entries(messagesByDay).map(([date, count]) => (
          <Box key={date} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                {date}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {count} mensajes
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(count / maxMessages) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'divider',
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  borderRadius: 4
                }
              }}
            />
          </Box>
        ))}
      </Box>

      {Object.keys(messagesByDay).length === 0 && (
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center', 
            py: 3,
            color: 'text.secondary'
          }}
        >
          No hay actividad aún
        </Typography>
      )}
    </Paper>
  );
}