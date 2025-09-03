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


