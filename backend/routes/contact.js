// routes/contact.js
import { Router } from 'express';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const router = Router();

// 2-a) Límite básico (p.ej. 10 envíos/hora por IP)
router.use(rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
}));

// 2-b) Transportador SMTP: poné tus credenciales en variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // ej. "smtp.mailgun.org"
  port: +process.env.SMTP_PORT,     // 465 SSL o 587 TLS
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/', async (req, res) => {
  const {
    name, email, phone,
    projectType, projectSize, city,
    message,
  } = req.body;

  // 2-c) Pequeña validación de servidor
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // 2-d) Construyo el mail (HTML simple + reply-to del visitante)
  const mailOptions = {
    from: '"Web Contact" <no-reply@mtvd-design.com>',
    to: ['arquitectos@estudiomontevideo.com', 'contact@mtvd-design.com'],
    subject: `Nuevo contacto – ${name}`,
    replyTo: email,
    html: `
      <h3>Datos de contacto</h3>
      <p><b>Nombre:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Teléfono:</b> ${phone || '—'}</p>
      <h3>Sobre el proyecto</h3>
      <p><b>Tipo:</b> ${projectType || '—'}</p>
      <p><b>Tamaño:</b> ${projectSize || '—'}</p>
      <p><b>Ciudad:</b> ${city || '—'}</p>
      <h3>Mensaje</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error('Mailer error:', err);
    res.status(500).json({ error: 'Mailer failed.' });
  }
});

export default router;
