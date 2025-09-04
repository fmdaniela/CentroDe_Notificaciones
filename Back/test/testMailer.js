import dotenv from "dotenv";
import { sendAdminEmail, isConfigured } from "../modules/mailer.js";

dotenv.config();

// Verificar variables de entorno necesarias
const requiredEnvVars = ["GMAIL_USER", "GMAIL_PASS", "ADMIN_EMAIL"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error("❌ Faltan las siguientes variables de entorno:");
  missingVars.forEach((v) => console.error(`   - ${v}`));
  console.error("\n💡 Asegúrate de tener un archivo .env con estas variables configuradas.");
  process.exit(1);
}

if (!isConfigured()) {
  console.error("❌ Mailer no está configurado correctamente. Verifica credenciales y conexión.");
  process.exit(1);
}

// Mensaje de prueba
const testMessage = {
  name: "Daniela",
  email: "centronotificacionesenvio@gmail.com",
  message: "¡Hola! Esto es una prueba de notificación desde el sistema.",
  subject: "Prueba de notificación"
};

console.log("📧 Enviando mensaje de prueba al administrador...");
console.log(`   Nombre: ${testMessage.name}`);
console.log(`   Email remitente: ${testMessage.email}`);
console.log(`   Mensaje: ${testMessage.message}`);
console.log(`   Destino: ${process.env.ADMIN_EMAIL}\n`);

(async () => {
  try {
    await sendAdminEmail(testMessage);
    console.log("✅ Test completado: correo enviado con éxito.");
    console.log("El sistema de notificaciones por email está funcionando correctamente.");
  } catch (err) {
    console.error("❌ Test fallido:", err.message);
    console.error("\n🔍 Posibles causas:");
    console.error("   - Credenciales de Gmail incorrectas");
    console.error("   - Contraseña de aplicación no configurada");
    console.error("   - Conexión a internet");
    console.error("   - Configuración de seguridad de Gmail (acceso a apps menos seguras / OAuth)");
  }
})();
