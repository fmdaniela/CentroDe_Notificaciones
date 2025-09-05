//animación campanita
import React from "react";
import { Badge } from "@mui/material";

const AnimatedBadge = ({ badgeContent, color, max, children }) => {
  return (
    <Badge
      badgeContent={badgeContent}
      color={color}
      max={max}
      sx={{
        "& .MuiBadge-badge": {
          animation: "pulse 1.5s ease-in-out infinite",
          boxShadow: "0 0 0 2px #fff",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.2)" },
            "100%": { transform: "scale(1)" },
          },
        },
      }}
    >
      {children}
    </Badge>
  );
};

export default AnimatedBadge;
