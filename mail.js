const nodemailer = require("nodemailer");

const mail = async() => {
    let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "healthcare.record.management@gmail.com",
        pass: "hrm@12345"
    }
});

let details = {
  from: "healthcare.record.management@gmail.com",
  to: "abhinav.20211055@gmail.com",
  subject: "authentication",
  text: "Test mail"
};

transporter.sendMail().catch(console.error);

};

module.exports = mail;