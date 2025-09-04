// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { useSocket } from "../context/SocketContext";
import NotificationBell from "../components/NotificationBell";
import NotificationList from "../components/NotificationList";

export default function AdminPage() {
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const handler = (payload) => {
      const item = {
        id: crypto.randomUUID(),
        title: `Nuevo mensaje de ${payload.nombre}`,
        body: payload.mensaje,
        at: new Date(payload.createdAt),
        read: false,
      };
      setNotifications((prev) => [item, ...prev]);
      setUnread((n) => n + 1);
    };

    socket.on("admin_notification", handler);

    return () => socket.off("admin_notification", handler);
  }, [socket]);

  const markAllRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  // Simular notificación (para testing)
  const simulateIncoming = () => {
    const demo = {
      nombre: "Cliente Demo",
      mensaje: "Hola, ¿me ayudan?",
      createdAt: new Date().toISOString(),
    };
    socket.emit("__simulate_admin_notification", demo);
  };

  return (
    
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
       <Typography variant="h3" fontWeight="bold" align="left">
              ¡Hola Admin, nos alegra verte de nuevo!
       </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
    
          my:5,
          bgcolor: "background.paper",
        }}
      >
        
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          
          <Box>
           
            <Typography variant="h5" fontWeight="bold">
              🛎️ Panel de Soporte
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona las consultas de los clientes en tiempo real.
            </Typography>
          </Box>

          {/* Indicador de conexión */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: connected ? "success.lighter" : "grey.200",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: connected ? "success.main" : "grey.500",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {connected ? "Conectado" : "Desconectado"}
            </Typography>
          </Box>
        </Stack>

        {/* Botones de acción */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" color="primary" onClick={markAllRead}>
            Marcar todas como leídas
          </Button>
          <Button variant="contained" color="secondary" onClick={simulateIncoming}>
            Simular notificación
          </Button>
        </Stack>
      </Paper>

      {/* Notificaciones */}
      <Stack spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="medium">
            Últimas notificaciones
          </Typography>
          <NotificationBell
            notifications={notifications}
            unread={unread}
            onMarkAllRead={markAllRead}
          />
        </Box>

        <NotificationList notifications={notifications} />
      </Stack>
    </Container>
  );
}