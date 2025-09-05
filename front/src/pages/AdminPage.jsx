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
  CircularProgress,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
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

  // 1. PRIMERO: Cargar historial de la BD
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

  // 2. DESPUÉS: Escuchar nuevas notificaciones en tiempo real
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

  // Estadísticas
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BackButton variant="home" sx={{ mb: 3 }} />

      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* ... grids de estadísticas ... */}
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
          {/* header */}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Historial de notificaciones
          {filteredNotifications.length !== notifications.length && (
            <Chip
              label={`${filteredNotifications.length} de ${notifications.length}`}
              size="small"
              color="info"
              variant="outlined"
              sx={{ ml: 2 }}
            />
          )}
        </Typography>

        {/* Filtros */}
        <NotificationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Gráfico */}
        {!loadingHistory && notifications.length > 0 && (
          <SimpleMessageChart notifications={notifications} />
        )}

        {/* Mensaje vaacído */}
        {!loadingHistory && filteredNotifications.length === 0 && (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            {notifications.length === 0
              ? "No hay mensajes en el historial"
              : "No se encontraron mensajes con los filtros aplicados"}
          </Typography>
        )}

        {/* Lista de notificaciones */}
        {!loadingHistory && filteredNotifications.length > 0 && (
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
          />
        )}
      </Paper>
    </Container>
  );
}
