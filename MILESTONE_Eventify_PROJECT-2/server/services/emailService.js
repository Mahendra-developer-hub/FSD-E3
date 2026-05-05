import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: `${process.env.FROM_NAME || 'Eventify'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const getSignupTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #059669; text-align: center;">Welcome to Eventify, ${name}!</h2>
      <p style="font-size: 16px; color: #333;">We're excited to have you on board. Eventify is your premier platform for discovering and booking the best events around.</p>
      <p style="font-size: 16px; color: #333;">Get ready to explore conferences, concerts, workshops, and more!</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/events" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore Events Now</a>
      </div>
      <p style="font-size: 14px; color: #777; text-align: center;">If you have any questions, feel free to reply to this email.</p>
    </div>
  `;
};

export const getTicketTemplate = (name, eventTitle, ticketTierName, quantity, totalAmount, qrCodeDataUrl) => {
  // Using cid to reference embedded image
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #059669; text-align: center;">Your Eventify Ticket Confirmed!</h2>
      <p style="font-size: 16px; color: #333;">Hi ${name}, your booking for <strong>${eventTitle}</strong> is confirmed.</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Booking Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>Ticket Tier:</strong> ${ticketTierName}</li>
          <li style="margin-bottom: 8px;"><strong>Quantity:</strong> ${quantity}</li>
          <li style="margin-bottom: 8px;"><strong>Total Amount:</strong> ₹${totalAmount}</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0; border-top: 1px dashed #ccc; padding-top: 20px;">
        <h3 style="color: #374151;">Your Entry QR Code</h3>
        <p style="font-size: 14px; color: #666;">Please show this QR code at the entrance.</p>
        <img src="cid:qrcode" alt="Ticket QR Code" style="width: 200px; height: 200px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 10px;" />
      </div>

      <p style="font-size: 14px; color: #777; text-align: center;">We look forward to seeing you there!</p>
    </div>
  `;
};
