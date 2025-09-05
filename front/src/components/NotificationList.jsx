import React from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  MarkEmailRead as ReadIcon,
  Circle as UnreadIcon
} from "@mui/icons-material";
import { timeAgo } from "../utils/formatDate";

export default function NotificationList({ notifications, onMarkAsRead }) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      {notifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body1">No hay notificaciones por ahora</Typography>
        </Box>
      ) : (
        <>
          {notifications.map((n) => (
            <React.Fragment key={n.id}>
              <Card
                sx={{
                  boxShadow: "none",
                  bgcolor: n.read ? "transparent" : "action.hover",
                  borderLeft: n.read ? "none" : "4px solid",
                  borderColor: "primary.main",
                  '&:hover': {
                    bgcolor: n.read ? 'action.hover' : 'action.selected'
                  }
                }}
              >
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={n.read ? "normal" : "bold"}
                        component="div"
                      >
                        {n.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {n.body}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap", mr: 1 }}
                      >
                        {timeAgo(n.at)}
                      </Typography>
                      
                      {!n.read && (
                        <Tooltip title="Marcar mensaje como leído">
                          <IconButton
                            size="small"
                            onClick={() => onMarkAsRead(n.id)}
                            color="primary"
                          >
                            <ReadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {n.read && (
                        <Tooltip title="Marcada como leída">
                          <UnreadIcon fontSize="small" color="disabled" />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Divider />
            </React.Fragment>
          ))}
        </>
      )}
    </Paper>
  );
}