const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "../config/.env" });

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
   service:"gmail",
    auth: {
      user: process.env.SEND_GRID_USERNAME,
      pass: process.env.SEND_GRID_PASSWORD,
    },
  });
 

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

 

  const info = await transporter.sendMail(message);



  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
