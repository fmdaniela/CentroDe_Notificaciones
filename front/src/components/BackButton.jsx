import React from "react";
import { Button, Box } from "@mui/material";
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function BackButton({ variant = "arrow", sx = {} }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Button
        variant="outlined"
        startIcon={variant === "arrow" ? <ArrowBackIcon /> : <HomeIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 'medium'
        }}
      >
        {variant === "arrow" ? "Volver" : "Inicio"}
      </Button>
    </Box>
  );
}