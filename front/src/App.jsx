import { useState } from 'react'
import './App.css'
import { AppBar, Toolbar, Typography, Tabs, Tab, Container } from "@mui/material";
import { SocketProvider } from "./context/SocketContext";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <>
     <SocketProvider>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Centro de Notificaciones
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Usuario" />
          <Tab label="Administrador" />
        </Tabs>
      </Container>

      {tab === 0 && <UserPage />}
      {tab === 1 && <AdminPage />}
    </SocketProvider>

    </>
  )
};

