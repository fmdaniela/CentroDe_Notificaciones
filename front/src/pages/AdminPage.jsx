import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Stack } from "@mui/material";
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

  // Simular notificación
  const simulateIncoming = () => {
    const demo = {
      nombre: "Cliente Demo",
      mensaje: "Hola, ¿me ayudan?",
      createdAt: new Date().toISOString(),
    };
    socket.emit("__simulate_admin_notification", demo);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          Panel Admin {connected ? "🟢" : "⚪"}
        </Typography>
        <NotificationBell
          notifications={notifications}
          unread={unread}
          onMarkAllRead={markAllRead}
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={markAllRead}>Marcar todas como leídas</Button>
        <Button variant="contained" onClick={simulateIncoming}>Simular notificación</Button>
      </Stack>

      <NotificationList notifications={notifications} />
    </Container>
  );
}