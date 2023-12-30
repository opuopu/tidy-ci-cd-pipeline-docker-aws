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
async function sendEmail(receiverGmail, subject, text, children) {
  try {
    const info = await transporter.sendMail({
      from: `tidy bayti admin ${config.nodemailer_host_email}`, // sender address
      to: receiverGmail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: children, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }
}

export default sendEmail;
