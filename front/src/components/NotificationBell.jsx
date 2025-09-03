import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography, Divider, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import NotificationList from "./NotificationList";

export default function NotificationBell({ notifications, unread, onMarkAllRead }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled>
          <Typography variant="subtitle2">Notificaciones</Typography>
        </MenuItem>
        <Divider />
        {notifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2">Sin novedades</Typography>
          </MenuItem>
        )}
        {notifications.slice(0, 5).map((n) => (
          <MenuItem key={n.id} onClick={handleClose}>
            {!n.read && <CircleIcon fontSize="small" color="error" />}
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2">{n.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {n.body}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => { onMarkAllRead(); handleClose(); }}>Marcar todas como leídas</MenuItem>
      </Menu>
    </>
  );
}