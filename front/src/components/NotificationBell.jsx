import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  MarkEmailRead as ReadIcon,
} from "@mui/icons-material";

export default function NotificationBell({
  notifications = [],  // Valor por defecto para evitar el error
  unread = 0,          // Valor por defecto
  onMarkAllRead,
  onMarkAsRead,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = (notification, event) => {
    event.stopPropagation();

    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge 
          badgeContent={unread} 
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              animation: unread > 0 ? "pulse 1.5s infinite" : "none",
              top: -12,
              right: -8,
              minWidth: '18px',
              height: '18px',
              fontSize: '0.6rem',
              boxShadow: '0 0 0 2px #fff',
              border: '1px solid #fff',
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" }
              }
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 360, maxHeight: 400, overflow: "auto" } }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Notificaciones</Typography>
          {unread > 0 && (
            <Box component="span" sx={{ ml: 1, color: "error.main" }}>
              ({unread} sin leer)
            </Box>
          )}
        </MenuItem>
        <Divider />

        {notifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2">Sin novedades</Typography>
          </MenuItem>
        )}

        {notifications.slice(0, 5).map((n) => (
          <MenuItem
            key={n.id}
            onClick={(e) => handleNotificationClick(n, e)}
            sx={{
              bgcolor: n.read ? "transparent" : "action.hover",
              "&:hover": {
                bgcolor: n.read ? "action.hover" : "action.selected",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
              <Box sx={{ mr: 1, mt: 0.5 }}>
                {!n.read ? (
                  <Tooltip title="Marcar como leída">
                    <ReadIcon
                      fontSize="small"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead && onMarkAsRead(n.id);
                      }}
                    />
                  </Tooltip>
                ) : (
                  <CircleIcon fontSize="small" color="disabled" />
                )}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body2"
                  fontWeight={n.read ? "normal" : "bold"}
                >
                  {n.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "250px",
                  }}
                >
                  {n.body}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}

        <Divider />

        {notifications.length > 0 && onMarkAllRead && (
          <MenuItem
            onClick={() => {
              onMarkAllRead();
              handleClose();
            }}
          >
            <ReadIcon fontSize="small" sx={{ mr: 1 }} />
            Marcar todas como leídas
          </MenuItem>
        )}
      </Menu>
    </>
  );
}