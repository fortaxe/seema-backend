import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  mobile?: string;
  message: string;
}

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, message }: ContactFormData = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // SMTP Configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Prepare message content (optional)
    const messageHtml = message
      ? `<div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>`
      : "";

    const messageText = message
      ? `

Message:
${message}
`
      : "";

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECEIVER_EMAIL, // Send to your own email
      subject: `Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E1251B; border-bottom: 2px solid #E1251B; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Full Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${mobile ? `<p><strong>Mobile:</strong> ${mobile}</p>` : ''}
          </div>
          
          ${messageHtml}
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This email was sent from your website contact form.
            </p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Contact Details:
        - Full Name: ${name}
        - Email: ${email}
        ${mobile ? `- Mobile: ${mobile}` : ''}
        ${messageText}
        This email was sent from your website contact form.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send email"
    });
  }
};
