import * as mailer from './mailer.js';
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
      console.log('📧 Correo enviado al admin.');
    } else {
      console.warn('⚠️ Módulo mailer no implementado aún.');
    }

    // 3. Guardar en la persistencia (modelo de notificaciones)
    const saved = await NotificationsModel.create(payload);
    console.log('💾 Notificación guardada:', saved);
    console.log('✅ Notificación procesada correctamente.');
    return saved;
  } catch (err) {
    console.error('❌ Error en handleNewMessage:', err);
    throw err;
  }
}
