import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Stack, Snackbar, Alert } from "@mui/material";
import { useSocket } from "../context/SocketContext";

export default function ContactForm() {
  const { socket, connected } = useSocket();
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.email || !form.mensaje) {
      setSnack({ open: true, msg: "Completá todos los campos", sev: "warning" });
      return;
    }

    if (!connected || !socket) {
      setSnack({ open: true, msg: "Error de conexión. Recargá la página.", sev: "error" });
      return;
    }

    setSending(true);

    try {
      socket.emit("new_message", {
        ...form,
        createdAt: new Date().toISOString()
      });

      // Escuchar confirmación
      const confirmationHandler = (data) => {
        console.log("✅ Confirmación recibida:", data);
        setSnack({ open: true, msg: "Mensaje enviado correctamente!", sev: "success" });
        setForm({ nombre: "", email: "", mensaje: "" });
        setSending(false);
        socket.off("message_confirmation", confirmationHandler);
      };

      socket.on("message_confirmation", confirmationHandler);

      // Timeout por si falla
      setTimeout(() => {
        setSending(false);
        socket.off("message_confirmation", confirmationHandler);
      }, 5000);

    } catch (error) {
      console.error("❌ Error al enviar:", error);
      setSnack({ open: true, msg: "Error al enviar el mensaje", sev: "error" });
      setSending(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Formulario de contacto {!connected && "(Desconectado)"}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth required />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />
          <TextField label="Mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} multiline minRows={4} fullWidth required />
          <Button type="submit" variant="contained" disabled={sending || !connected}>
            {sending ? "Enviando…" : connected ? "Enviar Mensaje" : "Desconectado"}
          </Button>
        </Stack>
      </form>
      
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev}>{snack.msg}</Alert>
      </Snackbar>
    </Paper>
  );
}