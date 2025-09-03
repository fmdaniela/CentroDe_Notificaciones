import { sendAdminEmail } from '../modules/mailer.js';

const testMessage = {
  name: 'Daniela',
  email: 'centronotificacionesenvio@gmail.com',
  message: '¡Holass! Esto es una prueba de notificación.',
};

sendAdminEmail(testMessage)
  .then(() => console.log('Test completado: correo enviado con éxito.'))
  .catch((err) => console.error('Test fallido:', err));
