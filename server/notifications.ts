import nodemailer from "nodemailer";
import twilio from "twilio";
import { Lead } from "@shared/schema";

// Initialize Gmail SMTP transporter
const emailTransporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

export async function sendLeadNotifications(lead: Lead, propertyTitle?: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPhone = process.env.ADMIN_PHONE;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  // Email notification via Gmail SMTP
  if (emailTransporter && adminEmail) {
    try {
      const subject = lead.leadType === "property_inquiry" 
        ? `New Property Inquiry: ${propertyTitle || 'Property'}`
        : 'New Interior Design Consultation Request';

      const htmlContent = `
        <h2>${subject}</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        ${lead.budget ? `<p><strong>Budget:</strong> ₹${lead.budget.toLocaleString('en-IN')}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${lead.message}</p>
        ${lead.requirements ? `<p><strong>Requirements:</strong><br/>${lead.requirements}</p>` : ''}
        <p><strong>Received:</strong> ${new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      `;

      await emailTransporter.sendMail({
        from: `"PropertyHub" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject,
        html: htmlContent,
      });

      console.log(`Email notification sent to ${adminEmail} via Gmail SMTP`);
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  }

  // SMS notification
  if (twilioClient && adminPhone && twilioPhone) {
    try {
      const smsMessage = lead.leadType === "property_inquiry"
        ? `New Property Inquiry from ${lead.name} (${lead.phone}) for ${propertyTitle || 'a property'}. Budget: ${lead.budget ? '₹' + lead.budget.toLocaleString('en-IN') : 'Not specified'}`
        : `New Interior Design Request from ${lead.name} (${lead.phone}). Budget: ${lead.budget ? '₹' + lead.budget.toLocaleString('en-IN') : 'Not specified'}`;

      await twilioClient.messages.create({
        body: smsMessage,
        from: twilioPhone,
        to: adminPhone,
      });

      console.log(`SMS notification sent to ${adminPhone}`);
    } catch (error) {
      console.error("Failed to send SMS notification:", error);
    }
  }
}
