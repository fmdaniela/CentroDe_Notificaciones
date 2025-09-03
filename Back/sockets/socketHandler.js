import { handleNewMessage } from '../modules/notifications.js';

export function socketHandler(io) {
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

    // Evento principal: mensaje nuevo
    socket.on('new_message', async (payload, ack) => {
      try {
        await handleNewMessage(payload, io);
        ack && ack({ ok: true, msg: 'Notificación enviada' });
      } catch (err) {
        console.error('❌ Error en handleNewMessage:', err);
        ack && ack({ ok: false, error: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
}
