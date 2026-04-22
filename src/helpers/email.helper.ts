import { transporter } from "../config/node.mailer";

export const sendOTPEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Verify your email</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 60 seconds.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};