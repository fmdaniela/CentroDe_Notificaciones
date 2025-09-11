import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  MarkunreadMailbox as MarkEmailUnreadIcon,
  MarkEmailRead as MarkEmailReadIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { useSocket } from "../context/SocketContext";
import NotificationBell from "../components/NotificationBell";
import NotificationList from "../components/NotificationList";
import { useSound } from "../hooks/useSound";
import BackButton from "../components/BackButton";
import NotificationFilters from "../components/NotificationFilters";
import SimpleMessageChart from "../components/SimpleMessageChart";

export default function AdminPage() {
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { play } = useSound();
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  // Función para manejar cambios de filtros
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      status: "",
      search: "",
    });
  };

  // Función para filtrar notificaciones
  const filteredNotifications = notifications.filter((notification) => {
    // Filtro por estado
    if (filters.status === "read" && !notification.read) return false;
    if (filters.status === "unread" && notification.read) return false;

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        notification.body.toLowerCase().includes(searchTerm) ||
        notification.title.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  // 1: Cargar historial de la base de datos
  useEffect(() => {
    const loadNotificationHistory = async () => {
      try {
        console.log("📂 Cargando historial desde BD...");
        const response = await fetch(
          "http://localhost:3000/api/notifications",
          {
            headers: {
              "x-admin-token": "cdnissrc2025", // Tu token del .env
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Historial cargado:", data.items.length, "mensajes");

          const historicalNotifications = data.items.map((item) => ({
            id: item.id,
            title: `Mensaje de ${item.name || "Cliente"}`,
            body: item.body,
            at: new Date(item.timestamp),
            read: !!item.read, // convierte cualquier valor a booleano
          }));

          setNotifications(historicalNotifications);
          setUnreadCount(historicalNotifications.filter((n) => !n.read).length);
        }
      } catch (error) {
        console.error("❌ Error cargando historial:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadNotificationHistory();
  }, []);

  // 2: Escuchar nuevas notificaciones en tiempo real
  useEffect(() => {
    if (!socket) return;

    const notificationHandler = (data) => {
      console.log("📨 Notificación en tiempo real:", data);
      play();

      const newNotification = {
        id: data.id || Date.now(),
        title: data.title || `Nuevo mensaje de ${data.nombre || "Cliente"}`,
        body: data.body || data.mensaje || "Sin mensaje",
        at: new Date(data.createdAt || new Date()),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("admin_notification", notificationHandler);

    return () => {
      socket.off("admin_notification", notificationHandler);
    };
  }, [socket]);

  const markAsRead = async (notificationId) => {
    try {
      console.log("🔍 [FRONTEND] Marcando como leída:", notificationId);

      const response = await fetch(
        `http://localhost:3000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": "cdnissrc2025",
          },
          body: JSON.stringify({ read: true }),
        }
      );

      console.log("🔍 [FRONTEND] Respuesta del servidor:", response.status);

      if (response.ok) {
        const updatedNotification = await response.json();
        console.log(
          "✅ [FRONTEND] Notificación actualizada:",
          updatedNotification
        );

        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => prev - 1);
      } else {
        console.error(
          "❌ [FRONTEND] Error en respuesta:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("❌ [FRONTEND] Error marcando como leída:", error);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Estadísticas con mejor presentación
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header con título y campanita de notificaciones */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MarkEmailReadIcon fontSize="large" />
          Centro de Notificaciones
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <NotificationBell
            notifications={notifications}
            unread={unreadCount}
            onMarkAllRead={markAllRead}
            onMarkAsRead={markAsRead}
          />
          <BackButton />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Panel de estadísticas */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f5f7fa 0%, #d4ddebff 100%)",
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Resumen de Notificaciones
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <Chip
                icon={<NotificationsIcon />}
                label={`Total: ${stats.total}`}
                variant="outlined"
                color="primary"
                sx={{ fontSize: "1rem", p: 2 }}
              />
              <Chip
                icon={<MarkEmailUnreadIcon />}
                label={`No leídas: ${stats.unread}`}
                variant="filled"
                color="error"
                sx={{ fontSize: "1rem", p: 2 }}
              />
              <Chip
                icon={<MarkEmailReadIcon />}
                label={`Leídas: ${stats.read}`}
                variant="filled"
                color="success"
                sx={{ fontSize: "1rem", p: 2 }}
              />
            </Box>

            <Button
              variant="contained"
              onClick={markAllRead}
              startIcon={<DoneAllIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              }}
            >
              Marcar todo como leído
            </Button>
          </Paper>

          {/* Filtros de notificaciones */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <NotificationFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Paper>

          {/* Lista de notificaciones */}
          {!loadingHistory && filteredNotifications.length > 0 && (
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
            />
          )}
        </Grid>

        {/* Gráfico de estadísticas */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Mensajes por Día
            </Typography>
            <SimpleMessageChart notifications={notifications} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
