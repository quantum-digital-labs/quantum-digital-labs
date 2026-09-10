import nodemailer, { type Transporter } from 'nodemailer';
import { env, isSmtpConfigured } from '../config/env';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!isSmtpConfigured) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail(input: SendMailInput): Promise<void> {
  const from =
    env.MAIL_FROM ?? `Quantum Digital Labs <${env.SMTP_USER}>`;

  await getTransporter().sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

export async function verifySmtpConnection(): Promise<boolean> {
  if (!isSmtpConfigured) {
    console.warn('[mail] SMTP not configured — email sending disabled.');
    return false;
  }

  try {
    await getTransporter().verify();
    console.log(`[mail] SMTP ready (${env.SMTP_USER})`);
    return true;
  } catch (error) {
    console.error('[mail] SMTP verification failed:', error);
    return false;
  }
}
