import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Deletion OTP - Kite X Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Account Deletion Request</h2>
        <p>You have requested to delete your Kite X Pro account.</p>
        <p>Your OTP for account deletion is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #dc2626; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>This OTP is valid for 10 minutes only.</strong></p>
        <p>If you did not request this, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Kite X Pro - Smart Trading Platform</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendDeletionConfirmation = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Deletion Confirmation - Kite X Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Account Successfully Deleted</h2>
        <p>Dear ${name},</p>
        <p>Your Kite X Pro account has been successfully deleted as requested.</p>
        <p>All your data including:</p>
        <ul>
          <li>Profile information</li>
          <li>Transaction history</li>
          <li>Account balance</li>
        </ul>
        <p>has been permanently removed from our system.</p>
        <p>Thank you for using Kite X Pro. We're sorry to see you go!</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Kite X Pro - Smart Trading Platform</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};