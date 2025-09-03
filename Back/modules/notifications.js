import * as mailer from './mailer.js'; // lo hará tu compañero en B3
import * as NotificationsModel from '../models/notifications.model.js';

/**
 * Maneja un nuevo mensaje proveniente de un usuario
 * @param {Object} payload - { name, email, message }
 * @param {Object} io - Instancia de Socket.IO
 */
export async function handleNewMessage(payload, io) {
  try {
    console.log('📩 Procesando nuevo mensaje:', payload);

    // 1. Emitir notificación a los admins (solo a la sala 'admins')
    io.to('admins').emit('admin_notification', payload);

    // 2. Enviar correo al administrador
    if (mailer?.sendAdminEmail) {
      await mailer.sendAdminEmail(payload);
    } else {
      console.warn('⚠️ Módulo mailer no implementado aún.');
    }

    // 3. Guardar en base de datos
    const saved = await NotificationsModel.create(payload);
    return saved;

    console.log('✅ Notificación procesada correctamente.');
    return payload; // mientras tanto devolvemos el payload original
  } catch (err) {
    console.error('❌ Error en handleNewMessage:', err);
    throw err;
  }
}
