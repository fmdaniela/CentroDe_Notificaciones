import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { useSocket } from "../context/SocketContext";
import NotificationBell from "../components/NotificationBell";
import NotificationList from "../components/NotificationList";

export default function AdminPage() {
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const notificationHandler = (data) => {
      console.log("📨 Datos recibidos:", data); // Para debug

      // Manejar ambas estructuras: vieja y nueva
      const title =
        data.title || `Nuevo mensaje de ${data.nombre || "Cliente"}`;
      const body = data.body || data.mensaje || "Sin mensaje";
      const createdAt = data.createdAt || new Date().toISOString();

      const item = {
        id: Date.now(),
        title: title,
        body: body,
        at: new Date(createdAt),
        read: false,
      };

      setNotifications((prev) => [item, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("admin_notification", notificationHandler);

    return () => {
      socket.off("admin_notification", notificationHandler);
    };
  }, [socket]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Estadísticas
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Por leer</Typography>
              </Box>
              <Typography variant="h4" color="error">
                {stats.unread}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DoneAllIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Leídos</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.read}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Panel principal */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Panel de Administración
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona las consultas en tiempo real
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={connected ? "CONECTADO" : "DESCONECTADO"}
              color={connected ? "success" : "error"}
              variant="outlined"
            />
            <NotificationBell
              notifications={notifications}
              unread={unreadCount}
              onMarkAllRead={markAllRead}
            />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Historial de notificaciones
        </Typography>

        <NotificationList notifications={notifications} />
      </Paper>
    </Container>
  );
}
