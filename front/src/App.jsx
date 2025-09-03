import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import "./App.css";
import { AppBar, Toolbar, Typography } from "@mui/material";

import { SocketProvider } from "./context/SocketContext";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        {/* Barra de navegación por ahora */}
        <AppBar position="static" color="default" sx={{ mb: 4 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Centro de Notificaciones
            </Typography>
            <div>
              <Link
                to="/"
                style={{
                  marginRight: 16,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Usuario
              </Link>
              <Link
                to="/admin"
                style={{ color: "white", textDecoration: "none" }}
              >
                Admin
              </Link>
            </div>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Ruta por defecto: redirige cualquier otra a la de usuario */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}


