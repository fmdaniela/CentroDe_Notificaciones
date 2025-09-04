// Back/modules/notifications.js
import { sendAdminEmail } from './mailer.js';

export async function handleNewMessage(payload, io) {
  const { nombre, email, mensaje, createdAt } = payload;
  
  console.log('📧 Procesando nuevo mensaje:', { nombre, email });
  
  try {
    // 1. Enviar email al administrador
    await sendAdminEmail({
      name: nombre,
      email: email,
      message: mensaje
    });
    
    // 2. Enviar notificación en tiempo real a los admins
    const notificationData = {
      nombre: nombre,
      email: email,
      mensaje: mensaje,
      createdAt: createdAt || new Date().toISOString()
    };
    
    io.to('admins').emit('admin_notification', notificationData);
    console.log('✅ Notificación enviada a admins');
    
  } catch (error) {
    console.error('❌ Error en handleNewMessage:', error);
    throw error;
  }
}