// Back/modules/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { GMAIL_USER, GMAIL_PASS, ADMIN_EMAIL } = process.env;

console.log('📧 Configurando Gmail...');
console.log('GMAIL_USER:', GMAIL_USER ? '✅ Configurado' : '❌ Faltante');
console.log('ADMIN_EMAIL:', ADMIN_EMAIL ? '✅ Configurado' : '❌ Faltante');

// Configurar transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

// Verificar conexión de Gmail
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Error configurando Gmail:', error);
  } else {
    console.log('✅ Gmail configurado correctamente');
  }
});

export const sendAdminEmail = async (messagePayload) => {
  const { name, email, message } = messagePayload;

  console.log('📨 Enviando email through Gmail...');

  const mailOptions = {
    from: `"Sistema de Notificaciones" <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `Nuevo mensaje de ${name}`,
    text: `Mensaje de ${name} (${email}):\n\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p style="color: #666; margin-top: 20px;">
          Mensaje enviado desde el sistema de notificaciones en tiempo real.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado through Gmail');
    console.log('📧 Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error enviando email con Gmail:');
    console.error('   - Message:', error.message);
    
    // Error específico de autenticación de Gmail
    if (error.code === 'EAUTH') {
      console.error('   - Solución: Verifica la contraseña de aplicación de Gmail');
      console.error('   - Ve a: https://myaccount.google.com/apppasswords');
    }
    
    throw error;
  }
};

/// de aca para abajo es para testinggg

/* 
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('📧 Configurando mailer de testing con Ethereal Email...');

let transporter;

// Función para crear el transporter de testing
const createTestTransporter = async () => {
  try {
    // Crear cuenta de testing automáticamente (Ethereal Email)
    const testAccount = await nodemailer.createTestAccount();
    console.log('✅ Cuenta de testing Ethereal creada');
    console.log('📧 Email:', testAccount.user);
    console.log('🔑 Password:', testAccount.pass);
    
return nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
  tls: {
    rejectUnauthorized: false // ← ESTA LÍNEA SOLUCIONA EL ERROR
  }
});
  } catch (error) {
    console.error('❌ Error creando cuenta de testing:', error);
    throw error;
  }
};

// Inicializar el transporter
(async () => {
  try {
    transporter = await createTestTransporter();
    console.log('✅ Transporter de email configurado para testing');
  } catch (error) {
    console.error('❌ Error inicializando mailer:', error);
  }
})();

export const sendAdminEmail = async (messagePayload) => {
  const { name, email, message } = messagePayload;

  console.log('📨 Preparando email con datos:', { name, email });

  const mailOptions = {
    from: '"Sistema de Notificaciones" <notificaciones@test.com>',
    to: 'admin@test.com',
    subject: `Nuevo mensaje de ${name}`,
    text: `Mensaje de ${name} (${email}):\n\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `,
  };

  try {
    if (!transporter) {
      throw new Error('Transporter no inicializado');
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente');
    console.log('📧 Message ID:', info.messageId);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('❌ Error enviando email:');
    console.error('   - Message:', error.message);
    console.error('   - Stack:', error.stack);
    throw error;
  }
}; */