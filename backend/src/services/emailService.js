const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send notification to Admin when contact form is submitted
 */
const sendAdminContactNotification = async ({ name, email, phone, company, subject, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Portfolio Contact" <noreply@hariharan.dev>',
    to: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'admin@hariharan.dev',
    subject: `🚀 New Contact Form Submission: ${subject || 'General Inquiry'} - from ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="color: #38bdf8; margin-top: 0; border-bottom: 1px solid #334155; padding-bottom: 12px;">New Portfolio Contact Message</h2>
        <p style="font-size: 15px; color: #94a3b8;">You received a new message through your personal portfolio website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8; width: 120px;"><strong>Sender Name:</strong></td>
            <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8;"><strong>Phone:</strong></td>
            <td style="padding: 10px 0; color: #f8fafc;">${phone || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8;"><strong>Company:</strong></td>
            <td style="padding: 10px 0; color: #f8fafc;">${company || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 0; color: #94a3b8;"><strong>Subject:</strong></td>
            <td style="padding: 10px 0; color: #f8fafc;">${subject || 'General'}</td>
          </tr>
        </table>

        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin-top: 16px;">
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;"><strong>Message Content:</strong></p>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #e2e8f0;">${message}</p>
        </div>

        <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #64748b;">
          Submitted at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)
        </div>
      </div>
    `,
  };

  if (!transporter) {
    console.log('[Email Mock] SMTP credentials not set. Simulated sending Admin notification:');
    console.log(`To: ${mailOptions.to}, From: ${name} (${email}), Subject: ${mailOptions.subject}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent to Admin]: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error - Admin Notification]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send auto-reply confirmation to the user
 */
const sendUserAutoReply = async ({ name, email }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Hariharan Ravikumar" <hariharan@example.com>',
    to: email,
    subject: `Thank you for reaching out, ${name}! | Hariharan Ravikumar`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="color: #38bdf8; margin-top: 0;">Hi ${name},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          Thank you for contacting me. I have received your message and will review it promptly.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          I usually respond within 24 business hours. If your inquiry is urgent, feel free to connect with me directly on LinkedIn or WhatsApp.
        </p>

        <div style="margin: 28px 0; padding: 16px; background: #1e293b; border-left: 4px solid #38bdf8; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #f8fafc; font-weight: 600;">Hariharan Ravikumar</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Full Stack Software Engineer & MERN Specialist</p>
          <p style="margin: 6px 0 0 0; font-size: 13px;">
            <a href="https://linkedin.com/in/hariharan-ravikumar" style="color: #38bdf8; text-decoration: none; margin-right: 12px;">LinkedIn</a>
            <a href="https://github.com/hariharan-ravikumar" style="color: #38bdf8; text-decoration: none; margin-right: 12px;">GitHub</a>
            <a href="https://hariharan.dev" style="color: #38bdf8; text-decoration: none;">Portfolio</a>
          </p>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
          This is an automated confirmation sent from Hariharan's Portfolio System.
        </p>
      </div>
    `,
  };

  if (!transporter) {
    console.log(`[Email Mock] Auto-reply simulated for ${email}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Auto-reply Sent to User]: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error - Auto-reply]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { sendAdminContactNotification, sendUserAutoReply };
