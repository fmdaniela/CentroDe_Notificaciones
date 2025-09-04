// Back/server.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { sendAdminEmail } from "./modules/mailer.js";

console.log("1. Iniciando servidor...");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  console.log("Health check recibido");
  res.json({ status: "ok", message: "Servidor funcionando" });
});

const server = http.createServer(app);
console.log("2. Servidor HTTP creado");

// Socket.IO CONFIGURACIÓN
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

console.log("3. Socket.IO configurado");

// Manejo básico de sockets
io.on("connection", (socket) => {
  console.log("✅ Cliente conectado:", socket.id);

  socket.on("new_message", async (data) => {
    console.log("📨 Mensaje recibido:", data);

    try {
      // 1. ENVIAR EMAIL AL ADMIN
      await sendAdminEmail({
        name: data.nombre,
        email: data.email,
        message: data.mensaje,
      });
      console.log("📧 Email enviado al administrador");

      // 2. Responder al cliente
      socket.emit("message_confirmation", {
        success: true,
        message: "Mensaje recibido y email enviado",
      });

      // 3. Enviar notificación a TODOS
      io.emit("admin_notification", {
        id: Date.now(),
        title: `Nuevo mensaje de ${data.nombre}`,
        body: data.mensaje,
        email: data.email,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Error completo al procesar mensaje:", error);
      console.error("❌ Stack trace:", error.stack);
      socket.emit("message_confirmation", {
        success: false,
        message: "Error al procesar el mensaje",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

// INICIAR SERVIDOR
server.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log("4. Servidor escuchando en puerto", PORT);
});

// Agregar manejador de errores
server.on("error", (error) => {
  console.error("❌ Error del servidor:", error);
});

console.log("5. Configuración completada");
