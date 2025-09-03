import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


//este endpoint dice que el servidor esta ok
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

//es otra manera de levnatar el servidor de express para luego usarlo con socket.io
const server = http.createServer(app);


// se crea una instancia socket y se le pasa como parametro el servidor que creamos explicitamente, de esta manera socket.io y express comparten el mismo puerto 
const io = new Server(server, {
  cors: { origin: "*" } //aca se le permite a otros puertos pueden conectarse al servidor socket.io
});

    io.on("connection", (socket) => {
    console.log(`Cliente Socket.IO conectado: ${socket.id}`);

        socket.on("new_message", (data) => {
        console.log("Mensaje recibido:", data);

        // Emitir notificación de vuelta
        socket.emit("admin_notification", { text: "Mensaje recibido correctamente!" });
    });


    socket.on("disconnect", () => {
        console.log(`Cliente Socket.IO desconectado: ${socket.id}`);
    });
    });

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor HTTP+Socket.IO en http://localhost:${PORT}`);
});