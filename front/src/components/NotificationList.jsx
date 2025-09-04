import React from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Divider,
  Box
} from "@mui/material";
import { timeAgo } from "../utils/formatDate";

export default function NotificationList({ notifications }) {
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
                }}
              >
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={n.read ? "normal" : "bold"}
                      component="div"
                    >
                      {n.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1, whiteSpace: "nowrap" }}
                    >
                      {timeAgo(n.at)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {n.body}
                  </Typography>
                </CardContent>
              </Card>
              <Divider />
            </React.Fragment>
          ))}
        </>
      )}

      <Box sx={{ p: 1, textAlign: "right" }}>
        <Typography variant="caption" color="text.secondary">
          Total: {notifications.length}
        </Typography>
      </Box>
    </Paper>
  );
}