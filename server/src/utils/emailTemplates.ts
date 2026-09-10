import { env, isSmtpConfigured } from '../config/env';
import { sendMail } from './mail';

async function safeSend(
  label: string,
  input: { to: string; subject: string; text: string; html: string },
): Promise<boolean> {
  if (!isSmtpConfigured) {
    console.warn(`[mail] SMTP not configured — skipped ${label} to ${input.to}`);
    console.warn(`[mail] ${label} preview:\n${input.text}`);
    return false;
  }

  try {
    await sendMail(input);
    return true;
  } catch (error) {
    console.error(`[mail] Failed to send ${label}:`, error);
    return false;
  }
}

export async function sendWelcomeEmail(input: {
  email: string;
  password: string;
  code: string;
  token: string;
}): Promise<boolean> {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(input.token)}`;
  const subject = 'Welcome to Quantum Digital Labs';
  const text = [
    'Welcome to Quantum Digital Labs!',
    '',
    'Your account has been created successfully. Here are your login details:',
    '',
    `Username: ${input.email}`,
    `Password: ${input.password}`,
    '',
    `Your email verification code is: ${input.code}`,
    `Or open this link to verify: ${verifyUrl}`,
    '',
    'This code expires in 24 hours.',
    '',
    'After verification, you can sign in to apply for jobs and internships.',
    '',
    '— Quantum Digital Labs',
  ].join('\n');

  const html = `
    <h2>Welcome to Quantum Digital Labs!</h2>
    <p>Your account has been created successfully. Here are your login details:</p>
    <p>
      <strong>Username:</strong> ${input.email}<br/>
      <strong>Password:</strong> ${input.password}
    </p>
    <p>Your email verification code is: <strong>${input.code}</strong></p>
    <p><a href="${verifyUrl}">Verify your email</a></p>
    <p>This code expires in 24 hours.</p>
    <p>After verification, you can sign in to apply for jobs and internships.</p>
    <p>— Quantum Digital Labs</p>
  `;

  return safeSend('welcome email', {
    to: input.email,
    subject,
    text,
    html,
  });
}

export async function sendVerificationEmail(input: {
  email: string;
  code: string;
  token: string;
}): Promise<boolean> {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(input.token)}`;
  const subject = 'Verify your Quantum Digital Labs account';
  const text = [
    'Please verify your Quantum Digital Labs account.',
    '',
    `Your verification code is: ${input.code}`,
    `Or open this link to verify: ${verifyUrl}`,
    '',
    'This code expires in 24 hours.',
    '',
    '— Quantum Digital Labs',
  ].join('\n');

  const html = `
    <p>Please verify your Quantum Digital Labs account.</p>
    <p>Your verification code is: <strong>${input.code}</strong></p>
    <p><a href="${verifyUrl}">Verify your email</a></p>
    <p>This code expires in 24 hours.</p>
    <p>— Quantum Digital Labs</p>
  `;

  return safeSend('verification email', {
    to: input.email,
    subject,
    text,
    html,
  });
}

export async function sendJobApplicationEmail(input: {
  email: string;
  fullName: string;
  jobTitle: string;
  referenceNumber: string;
}): Promise<boolean> {
  const subject = `Job application received — ${input.referenceNumber}`;
  const text = [
    `Hi ${input.fullName},`,
    '',
    `Thank you for applying for the ${input.jobTitle} role at Quantum Digital Labs.`,
    '',
    `Your application reference number is: ${input.referenceNumber}`,
    '',
    'Our team will review your application and contact you if there is a match.',
    '',
    'You can track your application status after signing in on the website.',
    '',
    '— Quantum Digital Labs',
  ].join('\n');

  const html = `
    <p>Hi ${input.fullName},</p>
    <p>Thank you for applying for the <strong>${input.jobTitle}</strong> role at Quantum Digital Labs.</p>
    <p>Your application reference number is: <strong>${input.referenceNumber}</strong></p>
    <p>Our team will review your application and contact you if there is a match.</p>
    <p>You can track your application status after signing in on the website.</p>
    <p>— Quantum Digital Labs</p>
  `;

  return safeSend('job application email', {
    to: input.email,
    subject,
    text,
    html,
  });
}

export async function sendInternshipApplicationEmail(input: {
  email: string;
  fullName: string;
  internshipTitle: string;
  referenceNumber: string;
}): Promise<boolean> {
  const subject = `Internship application received — ${input.referenceNumber}`;
  const text = [
    `Hi ${input.fullName},`,
    '',
    `Thank you for applying for the ${input.internshipTitle} internship at Quantum Digital Labs.`,
    '',
    `Your application reference number is: ${input.referenceNumber}`,
    '',
    'Our team will review your application and contact you if there is a match.',
    '',
    'You can track your application status after signing in on the website.',
    '',
    '— Quantum Digital Labs',
  ].join('\n');

  const html = `
    <p>Hi ${input.fullName},</p>
    <p>Thank you for applying for the <strong>${input.internshipTitle}</strong> internship at Quantum Digital Labs.</p>
    <p>Your application reference number is: <strong>${input.referenceNumber}</strong></p>
    <p>Our team will review your application and contact you if there is a match.</p>
    <p>You can track your application status after signing in on the website.</p>
    <p>— Quantum Digital Labs</p>
  `;

  return safeSend('internship application email', {
    to: input.email,
    subject,
    text,
    html,
  });
}

export async function sendApplicationStatusEmail(input: {
  email: string;
  fullName: string;
  title: string;
  referenceNumber: string;
  status: string;
  kind: 'job' | 'internship';
}): Promise<boolean> {
  const label = input.kind === 'job' ? 'job' : 'internship';
  const subject = `Your ${label} application update — ${input.referenceNumber}`;
  const text = [
    `Hi ${input.fullName},`,
    '',
    `Your ${label} application for ${input.title} (${input.referenceNumber}) has been updated.`,
    '',
    `New status: ${input.status}`,
    '',
    '— Quantum Digital Labs',
  ].join('\n');

  const html = `
    <p>Hi ${input.fullName},</p>
    <p>Your ${label} application for <strong>${input.title}</strong>
      (<strong>${input.referenceNumber}</strong>) has been updated.</p>
    <p>New status: <strong>${input.status}</strong></p>
    <p>— Quantum Digital Labs</p>
  `;

  return safeSend('application status email', {
    to: input.email,
    subject,
    text,
    html,
  });
}
