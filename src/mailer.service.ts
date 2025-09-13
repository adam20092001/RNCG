import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tp1upc2025@gmail.com',
    pass: 'auei nqnj kvmx ucqu', // ⚠️ Usa App Password de Gmail
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const backendUrl = process.env.APP_URL;
  const url = `${backendUrl}/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: '"GastroSAI" <adam20092001@gmail.com>',
    to,
    subject: 'Verifica tu correo',
    html: `<p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu cuenta:</p><a href="${url}">Verificar correo</a>`,
  });


};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL; // ej: https://dg65fiq90y2dx.cloudfront.net
  const url = `${frontendUrl}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: '"GastroSAI" <tp1upc2025@gmail.com>',
    to,
    subject: 'Recupera tu contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${url}">Restablecer contraseña</a>
           <p>Este enlace expira en 15 minutos.</p>`,
  });
};
