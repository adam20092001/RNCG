import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tp1upc2025@gmail.com',
    pass: 'auei nqnj kvmx ucqu', // ⚠️ Usa App Password de Gmail
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const url = `http://localhost:3000/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: '"GastroSAI" <adam20092001@gmail.com>',
    to,
    subject: 'Verifica tu correo',
    html: `<p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu cuenta:</p><a href="${url}">Verificar correo</a>`,
  });
};
