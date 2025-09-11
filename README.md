# 🛎️ Centro de Notificaciones

Repositorio del **Grupo 3** para el **Desafío de la Semana: Hackathon Full-Stack JS**.
Este proyecto implementa un sistema de **notificaciones en tiempo real** y alertas por correo electrónico para un panel de administración de una tienda de e-commerce.

[Repositorio en GitHub](https://github.com/fmdaniela/CentroDe_Notificaciones.git)

---

## 🎯 Objetivo del Proyecto

Permitir al equipo de soporte de una tienda de comercio electrónico **recibir notificaciones instantáneas** cuando un usuario envía un mensaje o realiza acciones importantes. Además, el sistema envía una copia de estas notificaciones por correo electrónico al administrador.

---

## 📝 Requisitos Funcionales

### Frontend (React)
- **Vista de Usuario:** Formulario de contacto simple donde un usuario puede enviar un mensaje.
- **Vista de Administrador:**
  - Ícono de "campana" de notificaciones en la zona de administración.
  - Indicador visual (punto rojo) cuando llega una nueva notificación.
  - Al hacer clic en la campana, se despliega una lista con las últimas notificaciones **en tiempo real**, sin recargar la página.

### Backend (Node.js / Express + Socket.IO)
- Servidor Express que también funciona como servidor Socket.IO.
- Al recibir un mensaje desde el formulario:
  1. Guarda la notificación en la base de datos.
  2. Envía un correo electrónico al administrador usando Nodemailer (Gmail con App Password).
  3. Emite la notificación a todos los administradores conectados (`admin_notification`).

---

## ⚙️ Tecnologías Clave

- **React.js**: Frontend de la aplicación.
- **Node.js + Express**: Backend de la aplicación.
- **Socket.IO**: Comunicación bidireccional en tiempo real entre cliente y servidor.
- **Nodemailer**: Envío de correos electrónicos desde el backend.
- **Gmail App Password**: Requerido para que Nodemailer funcione con Gmail de forma segura.

---

## 💡 Introducción a Socket.IO y Nodemailer

### Socket.IO
Socket.IO es una librería de JavaScript que permite **comunicación en tiempo real y bidireccional** entre cliente y servidor. Se usa en chats, notificaciones y juegos online.

#### Instalación
```bash
# Servidor (Node.js)
npm install express socket.io

# Cliente (React)
npm install socket.io-client
```

#### Ejemplo de Servidor (server.js)
```js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import notifications from './controllers/notifications.controller.js';
import { sendAdminEmail } from "./modules/mailer.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("new_message", async (data) => {
    const savedNotification = notifications.createNotification({
      name: data.nombre,
      email: data.email,
      subject: `Mensaje de ${data.nombre}`,
      body: data.mensaje,
      timestamp: new Date().toISOString(),
      source: 'web_form'
    });

    await sendAdminEmail({ name: data.nombre, email: data.email, message: data.mensaje });

    io.emit("admin_notification", {
      id: savedNotification.id,
      title: `Nuevo mensaje de ${data.nombre}`,
      body: data.mensaje,
      email: data.email,
      createdAt: savedNotification.timestamp,
      read: false
    });
  });
});

server.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
```

#### Ejemplo de Cliente (React - App.js)
```js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

function App() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.on("admin_notification", (msg) => setMensajes(prev => [...prev, msg]));
    return () => socket.off("admin_notification");
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim()) {
      socket.emit("new_message", { nombre: "Usuario", mensaje });
      setMensaje("");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>■ Notificaciones en tiempo real</h1>
      <input value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Escribe un mensaje" />
      <button onClick={enviarMensaje}>Enviar</button>
      <ul>{mensajes.map((m, i) => <li key={i}>{m.title}: {m.body}</li>)}</ul>
    </div>
  );
}

export default App;
```

### Nodemailer
Nodemailer es una librería de Node.js que permite enviar correos electrónicos desde el backend. Útil para notificaciones, registros y recuperación de contraseñas.

#### Instalación
```bash
npm install nodemailer
```

#### Ejemplo de Configuración (mailer.js)
```js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { GMAIL_USER, GMAIL_PASS, ADMIN_EMAIL } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS }, // App Password de Gmail
  tls: { rejectUnauthorized: false }
});

export const sendAdminEmail = async ({ name, email, message }) => {
  await transporter.sendMail({
    from: `"Sistema de Notificaciones" <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `Nuevo mensaje de ${name}`,
    text: `Mensaje de ${name} (${email}): ${message}`
  });
};
```

#### Flujo General
1. El cliente (React) se conecta al servidor con `socket.io-client`.
2. El servidor (Node.js + Socket.IO) recibe y reenvía mensajes en tiempo real.
3. Nodemailer envía correos automáticos al administrador usando Gmail con App Password.

---

## 🚀 Instalación

Instalar las dependencias principales del backend:
```bash
npm install express socket.io nodemailer cors dotenv
```

Instalar las dependencias principales del frontend:
```bash
npm install react react-dom react-router-dom socket.io-client @mui/material @mui/icons-material @emotion/react @emotion/styled
```

Configurar variables de entorno en un archivo `.env`:
```
GMAIL_USER=tuemail@gmail.com
GMAIL_PASS=tu_app_password
ADMIN_EMAIL=admin@dominio.com
```
> **Nota:** `GMAIL_PASS` debe ser una **App Password** generada en tu cuenta de Gmail: [Instrucciones aquí](https://myaccount.google.com/apppasswords).

Ejecutar backend y frontend:
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

---

## 👥 Integrantes del Grupo 3

- Romay Joana Jacqueline  
- Fernández Waldo Ariel  
- Margaritini Rojas Juan Pablo  
- Fulco María Daniela  
- Díaz Mabel Amelia  
- Scopel Aguero Daiana Ayelen  
- Ortega Paula Romina  
- Gil Fernandez María Gimena Idalina  

---

## 📄 Licencia

Proyecto para fines académicos del **Hackathon Full-Stack JS**.

