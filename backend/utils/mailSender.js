import { createTransport } from "nodemailer";
const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  const transporter = createTransport({
    host: process.env.Email_Host,
    port: 587,
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: sent_from,
    reply: reply_to,
    to: send_to,
    subject: subject,
    html: message,
  };
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
export default sendEmail;
