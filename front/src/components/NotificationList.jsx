import React from "react";
import { Paper, List, ListItem, ListItemText, Divider, Typography } from "@mui/material";

export default function NotificationList({ notifications }) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, mt: 2 }}>
      <List dense>
        {notifications.length === 0 && (
          <ListItem>
            <ListItemText primary="Sin notificaciones por ahora" />
          </ListItem>
        )}
        {notifications.map((n) => (
          <React.Fragment key={n.id}>
            <ListItem sx={{ bgcolor: n.read ? "transparent" : "action.hover" }}>
              <ListItemText
                primary={n.title}
                secondary={`${n.body} — ${n.at.toLocaleString()}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="caption" sx={{ p: 1, display: "block" }}>
        Total: {notifications.length}
      </Typography>
    </Paper>
  );
}