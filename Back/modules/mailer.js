import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env'), override: true });

const { GMAIL_USER, GMAIL_PASS, ADMIN_EMAIL } = process.env;

console.log('GMAIL_USER:', GMAIL_USER, process.env.GMAIL_USER);
console.log('ADMIN_EMAIL:', ADMIN_EMAIL, process.env.ADMIN_EMAIL);

// Creamos el transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * Envía un email al administrador con el contenido del mensaje
 * @param {Object} messagePayload - objeto con { name, email, message }
 * @returns {Promise<void>}
 */

export const sendAdminEmail = async (messagePayload) => {
  const { name, email, message } = messagePayload;

  const mailOptions = {
    from: `"Notificaciones E-commerce" <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `Nueva notificación de ${name}`,
    text: `Mensaje de ${name} (${email}):\n\n${message}`,
    html: `<p><strong>Mensaje de ${name} (${email}):</strong></p><p>${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
};
