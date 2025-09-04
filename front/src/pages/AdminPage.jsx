import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Box, Chip } from "@mui/material";
import { useSocket } from "../context/SocketContext";

export default function AdminPage() {
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    console.log("🎯 Admin escuchando notificaciones...");

    const notificationHandler = (data) => {
      console.log("📨 Notificación recibida en admin:", data);
      setNotifications(prev => [{
        id: data.id || Date.now(),
        title: data.title || `Nuevo mensaje de ${data.nombre}`,
        body: data.body || data.mensaje,
        createdAt: data.createdAt || new Date().toISOString(),
        read: false
      }, ...prev]);
    };

    socket.on("admin_notification", notificationHandler);

    return () => {
      socket.off("admin_notification", notificationHandler);
    };
  }, [socket]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administración
        </Typography>
        
        <Chip 
          label={connected ? "CONECTADO" : "DESCONECTADO"} 
          color={connected ? "success" : "error"}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Notificaciones ({notifications.length})
        </Typography>
        
        {notifications.length === 0 ? (
          <Typography color="text.secondary">
            No hay notificaciones aún...
          </Typography>
        ) : (
          notifications.map((notif) => (
            <Paper key={notif.id} sx={{ p: 2, mb: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {notif.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {notif.body}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {new Date(notif.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))
        )}
      </Paper>
    </Container>
  );
}