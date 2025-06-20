import * as sgMail from '@sendgrid/mail';

//sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Asegúrate de tener esta variable en tu .env

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

  const msg = {
    to,
    from: 'no-reply@gastrosai.com', // Usa un remitente verificado o temporalmente tu Gmail
    subject: 'Verifica tu correo electrónico',
    html: `
      <h3>Bienvenido a GastroSAI</h3>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  };

  await sgMail.send(msg);
};
