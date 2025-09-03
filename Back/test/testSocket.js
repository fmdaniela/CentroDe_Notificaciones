// test/testSocket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Cuando se conecta correctamente
socket.on("connect", () => {
  console.log("✅ Conectado al servidor con id:", socket.id);

  // Enviar un mensaje de prueba al servidor
  socket.emit("new_message", { user: "TestUser", text: "Hola servidor!" });
});

// Cuando se recibe una notificación desde el servidor
socket.on("admin_notification", (data) => {
  console.log("📩 Notificación recibida:", data);
});

// Cuando se desconecta del servidor
socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor");
});
