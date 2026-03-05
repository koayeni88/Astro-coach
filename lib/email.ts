import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

const FROM = process.env.EMAIL_FROM || "Astro Coach <noreply@astrocoach.app>";

export async function sendEmail(to: string, subject: string, html: string) {
  const t = getTransporter();
  if (!t) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return false;
  }
  
  try {
    await t.sendMail({ from: FROM, to, subject, html });
    return true;
  } catch (error) {
    console.error("[Email] Failed:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  return sendEmail(to, "Reset Your Astro Coach Password", `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1a1035; color: #e2e0f0; border-radius: 16px;">
      <h1 style="color: #c4b5fd; font-size: 24px;">✦ Astro Coach</h1>
      <p>You requested a password reset. Click the button below to set a new password:</p>
      <a href="${resetUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">Reset Password</a>
      <p style="color: #a78bfa; font-size: 12px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `);
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  
  return sendEmail(to, "Verify Your Astro Coach Email", `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1a1035; color: #e2e0f0; border-radius: 16px;">
      <h1 style="color: #c4b5fd; font-size: 24px;">✦ Welcome to Astro Coach</h1>
      <p>Please verify your email address to get started:</p>
      <a href="${verifyUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">Verify Email</a>
      <p style="color: #a78bfa; font-size: 12px;">This link expires in 24 hours.</p>
    </div>
  `);
}

export async function sendDailyReadingEmail(to: string, sign: string, quote: string, theme: string) {
  return sendEmail(to, `Your Daily ${sign} Reading ✦`, `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1a1035; color: #e2e0f0; border-radius: 16px;">
      <h1 style="color: #c4b5fd; font-size: 24px;">✦ Daily ${sign} Reading</h1>
      <p style="font-style: italic; font-size: 18px; color: #fff; margin: 16px 0;">"${quote}"</p>
      <p style="color: #a78bfa; font-size: 14px;">Theme: ${theme}</p>
      <a href="${process.env.NEXTAUTH_URL}/daily" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">Read Full Insight →</a>
      <p style="color: #666; font-size: 11px; margin-top: 24px;">Astro Coach · <a href="${process.env.NEXTAUTH_URL}/settings" style="color: #a78bfa;">Manage notifications</a></p>
    </div>
  `);
}
