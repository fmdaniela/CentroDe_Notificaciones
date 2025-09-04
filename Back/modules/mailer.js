import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../.env"), override: true });

const { GMAIL_USER, GMAIL_PASS, ADMIN_EMAIL } = process.env;

let transporter = null;
let isMailerConfigured = false;

try {
  if (GMAIL_USER && GMAIL_PASS && ADMIN_EMAIL) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14
    });
    isMailerConfigured = true;
    console.log("Mailer configurado correctamente");
  } else {
    console.warn("Variables de entorno del mailer no configuradas completamente");
    console.warn("Necesitas: GMAIL_USER, GMAIL_PASS, ADMIN_EMAIL");
  }
} catch (error) {
  console.error("Error configurando mailer:", error.message);
}

// Verifica si el mailer está configurado
export const isConfigured = () => {
  return isMailerConfigured && transporter !== null;
};

// Envía un email al administrador
export const sendAdminEmail = async (messagePayload) => {
  if (!isConfigured()) throw new Error("Mailer no configurado.");

  const { name, email, message, subject = "Nueva notificación" } = messagePayload;

  if (!name || !email || !message) throw new Error("Faltan campos requeridos: name, email, message");

  const mailOptions = {
    from: `"Sistema de Notificaciones" <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `${subject} - ${name}`,
    text: `Mensaje de ${name} (${email}):\n\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nueva Notificación Recibida</h2>
        <p><strong>De:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado al admin:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error enviando correo:", error.message);
    throw error;
  }
};
