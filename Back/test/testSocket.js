import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

// Cliente simulando un usuario normal
const userSocket = io(SERVER_URL, {
  query: { role: 'user' },
});

// Cliente simulando un administrador
const adminSocket = io(SERVER_URL, {
  query: { role: 'admin' },
});

// Cuando el admin recibe una notificación
adminSocket.on('admin_notification', (notif) => {
  console.log('🔔 Admin recibió notificación:', notif);
});

// Cuando el servidor confirma con ack
userSocket.on('connect', () => {
  console.log('✅ Usuario conectado:', userSocket.id);

  // Emitimos un mensaje nuevo con ack
  userSocket.emit(
    'new_message',
    {
      name: 'Test User',
      email: 'user@test.com',
      message: 'Hola desde testSocket.js',
    },
    (response) => {
      console.log('📬 Respuesta del servidor (ack):', response);
    }
  );
});

// Logs para el admin
adminSocket.on('connect', () => {
  console.log('👑 Admin conectado:', adminSocket.id);
});

// Manejo de errores/desconexiones
userSocket.on('disconnect', () => console.log('❌ Usuario desconectado'));
adminSocket.on('disconnect', () => console.log('❌ Admin desconectado'));
