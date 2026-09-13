// Supabase Edge Function: send-notification
//
// Invoked by a Postgres trigger (via pg_net) on INSERT/UPDATE of
// job_applications, internship_applications, and inquiries.
// Ports the email content from server/src/utils/emailTemplates.ts
// (the old Express app) so behaviour matches exactly.
//
// Auth: this function is called server-to-server by a Postgres trigger,
// not by end users, so it is NOT protected by Supabase's publishable/secret
// API-key scheme. Instead the caller must send a shared secret in the
// `x-webhook-secret` header, matched against the WEBHOOK_SECRET function
// secret. Nothing else can call this function successfully.
import "@supabase/functions-js/edge-runtime.d.ts";
import nodemailer from "npm:nodemailer@6.9.14";

const SMTP_HOST = Deno.env.get("SMTP_HOST") ?? "";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") ?? "587");
const SMTP_USER = Deno.env.get("SMTP_USER") ?? "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";
const MAIL_FROM = Deno.env.get("MAIL_FROM") || SMTP_USER;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";

const isSmtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

type MailInput = { to: string; subject: string; text: string; html: string };

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!isSmtpConfigured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

async function safeSend(label: string, input: MailInput): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.warn(`[send-notification] SMTP not configured — skipped ${label} to ${input.to}`);
    return false;
  }
  try {
    await t.sendMail({ from: MAIL_FROM, to: input.to, subject: input.subject, text: input.text, html: input.html });
    return true;
  } catch (error) {
    console.error(`[send-notification] Failed to send ${label}:`, error);
    return false;
  }
}

// ---- Templates (ported 1:1 from server/src/utils/emailTemplates.ts) ----

function jobApplicationEmail(input: {
  email: string;
  fullName: string;
  jobTitle: string;
  referenceNumber: string;
}): MailInput {
  const subject = `Job application received — ${input.referenceNumber}`;
  const text = [
    `Hi ${input.fullName},`,
    "",
    `Thank you for applying for the ${input.jobTitle} role at Quantum Digital Labs.`,
    "",
    `Your application reference number is: ${input.referenceNumber}`,
    "",
    "Our team will review your application and contact you if there is a match.",
    "",
    "You can track your application status after signing in on the website.",
    "",
    "— Quantum Digital Labs",
  ].join("\n");
  const html = `
    <p>Hi ${input.fullName},</p>
    <p>Thank you for applying for the <strong>${input.jobTitle}</strong> role at Quantum Digital Labs.</p>
    <p>Your application reference number is: <strong>${input.referenceNumber}</strong></p>
    <p>Our team will review your application and contact you if there is a match.</p>
    <p>You can track your application status after signing in on the website.</p>
    <p>— Quantum Digital Labs</p>
  `;
  return { to: input.email, subject, text, html };
}

function internshipApplicationEmail(input: {
  email: string;
  fullName: string;
  internshipTitle: string;
  referenceNumber: string;
}): MailInput {
  const subject = `Internship application received — ${input.referenceNumber}`;
  const text = [
    `Hi ${input.fullName},`,
    "",
    `Thank you for applying for the ${input.internshipTitle} internship at Quantum Digital Labs.`,
    "",
    `Your application reference number is: ${input.referenceNumber}`,
    "",
    "Our team will review your application and contact you if there is a match.",
    "",
    "You can track your application status after signing in on the website.",
    "",
    "— Quantum Digital Labs",
  ].join("\n");
  const html = `
    <p>Hi ${input.fullName},</p>
    <p>Thank you for applying for the <strong>${input.internshipTitle}</strong> internship at Quantum Digital Labs.</p>
    <p>Your application reference number is: <strong>${input.referenceNumber}</strong></p>
    <p>Our team will review your application and contact you if there is a match.</p>
    <p>You can track your application status after signing in on the website.</p>
    <p>— Quantum Digital Labs</p>
  `;
  return { to: input.email, subject, text, html };
}

function inquiryReceivedEmail(input: {
  email: string;
  name: string;
  type: "contact" | "quote" | "demo";
  referenceNumber: string;
}): MailInput {
  const labels: Record<typeof input.type, string> = {
    contact: "contact request",
    quote: "quote request",
    demo: "demo request",
  };
  const label = labels[input.type] ?? "request";
  const subject = `We received your ${label} — ${input.referenceNumber}`;
  const text = [
    `Hi ${input.name},`,
    "",
    `Thank you for your ${label} to Quantum Digital Labs.`,
    "",
    `Your reference number is: ${input.referenceNumber}`,
    "",
    "Our team will review this and get back to you shortly.",
    "",
    "— Quantum Digital Labs",
  ].join("\n");
  const html = `
    <p>Hi ${input.name},</p>
    <p>Thank you for your ${label} to Quantum Digital Labs.</p>
    <p>Your reference number is: <strong>${input.referenceNumber}</strong></p>
    <p>Our team will review this and get back to you shortly.</p>
    <p>— Quantum Digital Labs</p>
  `;
  return { to: input.email, subject, text, html };
}

function applicationStatusEmail(input: {
  email: string;
  fullName: string;
  title: string;
  referenceNumber: string;
  status: string;
  kind: "job" | "internship";
}): MailInput {
  const label = input.kind === "job" ? "job" : "internship";
  const subject = `Your ${label} application update — ${input.referenceNumber}`;
  const text = [
    `Hi ${input.fullName},`,
    "",
    `Your ${label} application for ${input.title} (${input.referenceNumber}) has been updated.`,
    "",
    `New status: ${input.status}`,
    "",
    "— Quantum Digital Labs",
  ].join("\n");
  const html = `
    <p>Hi ${input.fullName},</p>
    <p>Your ${label} application for <strong>${input.title}</strong>
      (<strong>${input.referenceNumber}</strong>) has been updated.</p>
    <p>New status: <strong>${input.status}</strong></p>
    <p>— Quantum Digital Labs</p>
  `;
  return { to: input.email, subject, text, html };
}

// ---- HTTP handler ----

type WebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown> | null;
  old_record: Record<string, unknown> | null;
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!WEBHOOK_SECRET || req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const { type, table, record, old_record } = payload;

  try {
    if (table === "job_applications" && type === "INSERT" && record) {
      await safeSend(
        "job application email",
        jobApplicationEmail({
          email: String(record.email),
          fullName: String(record.full_name),
          jobTitle: String(record.title),
          referenceNumber: String(record.reference_number),
        }),
      );
    } else if (
      table === "job_applications" &&
      type === "UPDATE" &&
      record &&
      old_record &&
      record.status !== old_record.status
    ) {
      await safeSend(
        "application status email",
        applicationStatusEmail({
          email: String(record.email),
          fullName: String(record.full_name),
          title: String(record.title),
          referenceNumber: String(record.reference_number),
          status: String(record.status),
          kind: "job",
        }),
      );
    } else if (table === "internship_applications" && type === "INSERT" && record) {
      await safeSend(
        "internship application email",
        internshipApplicationEmail({
          email: String(record.email),
          fullName: String(record.full_name),
          internshipTitle: String(record.title),
          referenceNumber: String(record.reference_number),
        }),
      );
    } else if (
      table === "internship_applications" &&
      type === "UPDATE" &&
      record &&
      old_record &&
      record.status !== old_record.status
    ) {
      await safeSend(
        "application status email",
        applicationStatusEmail({
          email: String(record.email),
          fullName: String(record.full_name),
          title: String(record.title),
          referenceNumber: String(record.reference_number),
          status: String(record.status),
          kind: "internship",
        }),
      );
    } else if (table === "inquiries" && type === "INSERT" && record) {
      await safeSend(
        "inquiry received email",
        inquiryReceivedEmail({
          email: String(record.email),
          name: String(record.name),
          type: record.type as "contact" | "quote" | "demo",
          referenceNumber: String(record.reference_number),
        }),
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[send-notification] handler error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
});
