import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import notificationsController from "./controllers/notifications.controller.js";
import notificationsRoutes from "./routes/notifications.routes.js";

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger de requests
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString("es-ES");
  console.log(`📡 [${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Inicializar SQLite
const dbFile = path.join(process.cwd(), "Back", "db", "notifications.sqlite");
notificationsController.initDb(dbFile);

// Rutas REST
app.use("/api", notificationsRoutes);

// --- SOCKET.IO ---
io.on("connection", (socket) => {
  console.log(`Cliente Socket.IO conectado: ${socket.id}`);

  // Unirse a room de admins
  socket.on("join", ({ role, token }) => {
    if (role === "admin" && token === process.env.ADMIN_TOKEN) {
      socket.join("admins");
      console.log(`Socket unido a room admins: ${socket.id}`);
    }
  });

  // Recibir mensajes de usuarios
  socket.on("new_message", (data) => {
    console.log("Mensaje recibido:", data);

    // Guardar en DB
    const notif = notificationsController.createNotification({
      name: data.name,
      email: data.email,
      subject: data.subject,
      body: data.body,
      timestamp: data.timestamp || new Date().toISOString(),
      source: "socket_message"
    });

    // Emitir a todos los admins
    io.to("admins").emit("admin_notification", notif);

    // Confirmar al usuario
    socket.emit("message_received", { status: "ok", id: notif.id });
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente Socket.IO desconectado: ${socket.id}`);
  });
});

// Eventos del controlador para sincronizar lectura
notificationsController.events.on("notification_created", (notif) => {
  io.to("admins").emit("admin_notification", notif);
});

notificationsController.events.on("notification_read", (notif) => {
  io.to("admins").emit("notification_read", notif);
});

// Cierre seguro
["SIGTERM","SIGINT"].forEach(sig => 
  process.on(sig, () => {
    console.log(`🛑 Señal ${sig} recibida, cerrando servidor...`);
    server.close(() => process.exit(0));
  })
);

// Pequeño manejo de errores
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Promesa rechazada no manejada:", promise, "razón:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("🚨 Excepción no capturada:", error);
  process.exit(1);
});

// iniciar servidor
server.listen(PORT, () => {
  console.log(`⚡ Servidor escuchando en http://localhost:${PORT}`);
  console.log(`🔐 ADMIN_TOKEN configurado: ${process.env.ADMIN_TOKEN ? "✅" : "❌"}`);
});
