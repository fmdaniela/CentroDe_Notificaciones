// Back/server.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { sendAdminEmail } from "./modules/mailer.js";
import notifications from './controllers/notifications.controller.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import notificationsRoutes from './routes/notifications.routes.js';

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

// ✅ MOVER AQUÍ: Rutas de la API
app.use('/api', notificationsRoutes);

const server = http.createServer(app);
console.log("2. Servidor HTTP creado");

// ✅ MOVER AQUÍ: Inicializar base de datos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
notifications.initDb(join(__dirname, 'db', 'notifications.sqlite'));
console.log('✅ Base de datos inicializada');

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
      // 0. GUARDAR EN BASE DE DATOS (NUEVO)
      const savedNotification = notifications.createNotification({
        name: data.nombre,
        email: data.email,
        subject: `Mensaje de ${data.nombre}`,
        body: data.mensaje,
        timestamp: new Date().toISOString(),
        source: 'web_form'
      });
      console.log("💾 Mensaje guardado en BD:", savedNotification.id);

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

      // 3. Enviar notificación a TODOS (con ID de la BD)
      io.emit("admin_notification", {
        id: savedNotification.id,
        title: `Nuevo mensaje de ${data.nombre}`,
        body: data.mensaje,
        email: data.email,
        createdAt: savedNotification.timestamp,
        read: false
      });

    } catch (error) {
      console.error("❌ Error al procesar mensaje:", error);
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