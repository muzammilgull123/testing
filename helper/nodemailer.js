const nodemailer = require('nodemailer');
const { storeOTP } = require('../services/services');
// const { storeOTP } = require('../api/user/user.service');

// Function to send OTP to an email address
const sendOTPByEmail = async (name, recipientEmail, otp,secret,secretejson) => {
  try {
    // Create a transporter using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'umarautosmart15@gmail.com', // Sender's email address
        pass: 'rodvhshdrejaeugc' // Sender's email password
      }
    });

    // Email content
    const mailOptions = {
      from: 'nullship@support.com', // Sender's email address
      to: recipientEmail, // Recipient's email address
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    const secretString = JSON.stringify(secret);
    // Store OTP in the database
    await storeOTP(name, recipientEmail,secret,secretString );
  } catch (error) {
    console.error('Error sending email:', error);
    // Handle error here
  }
};

module.exports = sendOTPByEmail;
