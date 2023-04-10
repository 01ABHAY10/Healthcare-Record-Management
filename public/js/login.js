// const CryptoJS = require("crypto-js");
// const nodemailer = require('nodemailer');

// Email verification function
$("button.signup").on(click, function() {
    // Get the user's email address
    

    // Generate a verification token
    var verificationToken = generateToken();

    // Send the verification email
    sendVerificationEmail(userEmail, verificationToken);

    // Prompt the user to check their email for the verification link
    alert(
      "A verification link has been sent to your email. Please click the link to complete registration."
    );
});

// Token generation function
function generateToken() {
  // Generate a random token using a library like CryptoJS
  var token = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

  // Store the token in the database, associated with the user's email address

  // Return the token
  return token;
}

// Email sending function
function sendVerificationEmail(email, token) {
  // Construct the verification URL using the token and your application's base URL
  var verifyUrl = "https://example.com/verify-email?token=" + token;

  // Construct the email message with the verification URL
  var emailBody =
    "Thank you for registering with our application. Please click the following link to verify your email address and complete registration: " +
    verifyUrl;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "healthcare.record.management@gmail.com", // Replace with your email address
      pass: "hrm@12345", // Replace with your email password
    },
  });
  const mailOptions = {
    from: "healthcare.record.management@gmail.com", // Replace with your email address
    to: email, // Replace with the recipient's email address
    subject: "Test Email from Nodemailer",
    text: emailBody,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
