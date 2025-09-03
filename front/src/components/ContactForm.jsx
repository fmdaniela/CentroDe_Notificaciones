import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Stack, Snackbar, Alert } from "@mui/material";
import { useSocket } from "../context/SocketContext";

export default function ContactForm() {
  const { socket } = useSocket();
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
    setSending(true);
    socket.emit("new_message", { ...form, createdAt: new Date().toISOString() });
    setSnack({ open: true, msg: "Mensaje enviado ✅", sev: "success" });
    setForm({ nombre: "", email: "", mensaje: "" });
    setSending(false);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Formulario de contacto
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField label="Mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} multiline minRows={4} fullWidth />
          <Button type="submit" variant="contained" disabled={sending}>
            {sending ? "Enviando…" : "Enviar"}
          </Button>
        </Stack>
      </form>
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.sev}>{snack.msg}</Alert>
      </Snackbar>
    </Paper>
  );
}