/**
 * WhatsApp Notification Service
 * Uses Twilio WhatsApp API or custom Webhook
 */
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('[WhatsApp Service]: Twilio client initialized');
  } catch (err) {
    console.warn('[WhatsApp Service]: Twilio init skipped:', err.message);
  }
}

const sendWhatsAppContactAlert = async ({ name, email, phone, company, subject, message }) => {
  const formattedMsg = `🔔 *New Portfolio Inquiry* 🔔\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'N/A'}\n*Company:* ${company || 'N/A'}\n*Subject:* ${subject || 'Portfolio Inquiry'}\n\n*Message:*\n${message}\n\n_Sent from Portfolio Contact Engine_`;

  if (!twilioClient) {
    console.log('\n[WhatsApp Simulated Notification]:');
    console.log('--------------------------------------------------');
    console.log(formattedMsg);
    console.log('--------------------------------------------------\n');
    return { success: true, simulated: true };
  }

  try {
    const response = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: process.env.ADMIN_WHATSAPP_NUMBER || 'whatsapp:+919876543210',
      body: formattedMsg,
    });
    console.log(`[WhatsApp Message Sent]: ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error(`[WhatsApp Error]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWhatsAppContactAlert };
