import { handleNewMessage } from '../modules/notifications.js';

export function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // Evento principal para testear
    socket.on('new_message', (payload, ack) => {
      console.log('📨 Nuevo mensaje recibido (TEST):', payload);
      
      // Simula respuesta inmediata
      if (ack) {
        ack({ ok: true, msg: 'Mensaje recibido en backend' });
      }
      
      // Envia notificación de prueba
      const testNotification = {
        nombre: payload.nombre || 'Test User',
        email: payload.email || 'test@test.com',
        mensaje: payload.mensaje || 'Mensaje de prueba',
        createdAt: new Date().toISOString()
      };
      
      io.emit('admin_notification', testNotification);
      console.log('✅ Notificación de prueba enviada');
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
}