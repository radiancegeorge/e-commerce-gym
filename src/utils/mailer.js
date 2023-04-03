const nodemailer = require("nodemailer");

const sendMail = async ({ name, to, subject = "Hello", text = "", html }) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"${name}" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
