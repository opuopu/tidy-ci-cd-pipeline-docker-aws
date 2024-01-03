import nodemailer from "nodemailer";
import config from "../config/index.js";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.nodemailer_host_email,
    pass: config.nodemailer_host_pass,
  },
});
async function sendEmail(receiverGmail, subject, text, otp) {
  try {
    const info = await transporter.sendMail({
      from: `tidy bayti admin ${config.nodemailer_host_email}`, // sender address
      to: receiverGmail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <h2 style="color: #3498db; text-align: center;">One-Time Verification Code</h2>
        <p style="font-size: 16px;">Your one-time verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #2ecc71; text-align: center;">${otp}</p>
        <p style="font-size: 16px;">This code is valid for 1 hour.</p>
        <p style="font-size: 14px; color: #888;">Please do not share this code with anyone for security reasons.</p>
      </div>
    `, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }
}

export default sendEmail;
