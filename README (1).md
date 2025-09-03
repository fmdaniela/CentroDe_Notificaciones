
# 🛠️ Proyecto Backend - Notificaciones en Tiempo Real

Este backend permite manejar mensajes entrantes, notificar a administradores en tiempo real mediante **Socket.IO** y enviar correos usando **Nodemailer**. Además, incluye endpoints REST para consultar y actualizar notificaciones.

---

## ✅ Estructura del Proyecto

```
backend/
├── server.js                        # Punto de entrada (B1)
├── sockets/
│   └── socketHandler.js             # Lógica de sockets (B2)
├── modules/
│   ├── mailer.js                    # Envío de correos (B3)
│   └── notifications.js             # Lógica de notificaciones (B2)
├── controllers/
│   └── notifications.controller.js  # Endpoints API (B4)
├── models/
│   └── notifications.model.js       # Persistencia simple (B4)
├── routes/
│   └── notifications.routes.js      # Rutas para la API (B4)
├── utils/
│   └── logger.js                    # (Opcional) Logs de eventos
├── test/
│   ├── testSocket.js                # Probar conexión socket (B1, B2)
│   └── testMailer.js                # Probar correo (B3)
└── .env.example                     # Variables de entorno
```

---

## 👥 **Asignación de Tareas (B1–B4)**

### **B1 – Server básico Express + Socket.IO (Core)**  
**Archivos:**  
- `server.js`  
- `test/testSocket.js`  

**Responsabilidades:**  
- Levantar servidor Express y Socket.IO en el mismo puerto.
- Crear endpoint básico `GET /health` que devuelva `{ status: "ok" }`.
- Configurar CORS para permitir conexión desde el frontend.
- Emitir logs cuando un cliente se conecta/desconecta.

**Comando de prueba:**  
```bash
node server.js
```

---

### **B2 – Lógica de Eventos (Socket + Notificaciones)**  
**Archivos:**  
- `sockets/socketHandler.js`  
- `modules/notifications.js`  

**Responsabilidades:**  
- En `socketHandler.js`: escuchar evento `new_message` y llamar a `handleNewMessage(payload, io)`.
- En `notifications.js`:
  - Emitir `admin_notification` a los administradores.
  - Llamar al módulo `mailer.js` (B3) para enviar email.
  - Guardar la notificación (usando modelo B4 cuando esté listo).

**Ejemplo:**  
```js
socket.on('new_message', (payload) => {
  handleNewMessage(payload, io);
});
```

---

### **B3 – Integración Nodemailer (Gmail)**  
**Archivos:**  
- `modules/mailer.js`  
- `test/testMailer.js`  

**Responsabilidades:**  
- Crear función `sendAdminEmail(messagePayload)` que recibe `{ name, email, message }`.
- Configurar variables en `.env`:
  ```
  GMAIL_USER=tuemail@gmail.com
  GMAIL_PASS=tu_app_password
  ADMIN_EMAIL=admin@gmail.com
  ```
- Probar envío real con `node testMailer.js`.

---

### **B4 – Persistencia + API REST**  
**Archivos:**  
- `models/notifications.model.js`  
- `controllers/notifications.controller.js`  
- `routes/notifications.routes.js`  

**Endpoints a crear:**  
- `GET /api/notifications` → Devuelve últimas N notificaciones.
- `PATCH /api/notifications/:id/read` → Marca como leído.

**Comando de prueba:**  
```bash
curl http://localhost:4000/api/notifications
```

---

## 🔗 **Integración entre módulos**
- **B1 + B2:** B1 expone `io` para que B2 maneje eventos.
- **B2 + B3:** Cuando llega `new_message` → `sendAdminEmail(payload)`.
- **B2 + B4:** `handleNewMessage` guarda notificación en el modelo.
- **Frontend** consumirá:
  - **Socket event:** `admin_notification`
  - **API REST:** `/api/notifications`

---

## ⚙️ Variables de Entorno (.env.example)
```
PORT=4000
GMAIL_USER=tuemail@gmail.com
GMAIL_PASS=tu_app_password
ADMIN_EMAIL=admin@gmail.com
NODE_ENV=development
```

---

## ✅ Comandos útiles
- Instalar dependencias:
```bash
npm install express socket.io nodemailer dotenv
```

- Iniciar servidor:
```bash
node server.js
```

---

### **¿Cómo trabajar en paralelo sin bloqueos?**
✔ B1 implementa servidor y socket.  
✔ B2 crea lógica de eventos y usa mock para email/persistencia.  
✔ B3 hace `mailer.js` con test independiente.  
✔ B4 implementa modelo y endpoints, probando con Postman.  

---

📌 **Consejo:** Primero clonar el esqueleto, instalar dependencias y hacer commits separados por módulo.
