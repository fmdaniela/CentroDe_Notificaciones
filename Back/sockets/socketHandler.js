import { handleNewMessage } from '../modules/notifications.js';

/* export function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // Verificar si el cliente es admin desde query (?role=admin)
    const { role } = socket.handshake.query || {};
    if (role === 'admin') {
      socket.join('admins');
      console.log(`👑 Admin conectado a la sala: ${socket.id}`);
    }

    // Permitir que un cliente se una explícitamente a la sala de admins
    socket.on('join_admin', () => {
      socket.join('admins');
      console.log(`👑 Admin unido por evento: ${socket.id}`);
    });

// Evento principal: mensaje nuevo desde el formulario
    socket.on('new_message', async (payload, ack) => {
      console.log('📨 Nuevo mensaje recibido:', payload);
      try {
        await handleNewMessage(payload, io);
        // Enviar confirmación al cliente que envió el mensaje
        ack && ack({ ok: true, msg: 'Mensaje recibido correctamente' });
      } catch (err) {
        console.error('❌ Error en handleNewMessage:', err);
        ack && ack({ ok: false, error: err.message });
      }
    });

    // Evento para simular notificaciones (testing)
    socket.on('__simulate_admin_notification', (demoData) => {
      console.log('🧪 Simulando notificación:', demoData);
      io.to('admins').emit('admin_notification', demoData);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
}
 */

// Back/sockets/socketHandler.js
export function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // Evento principal simplificado para testing
    socket.on('new_message', (payload, ack) => {
      console.log('📨 Nuevo mensaje recibido (TEST):', payload);
      
      // Simular respuesta inmediata
      if (ack) {
        ack({ ok: true, msg: 'Mensaje recibido en backend' });
      }
      
      // Enviar notificación de prueba
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