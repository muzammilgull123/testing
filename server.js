const express = require('express');
const app = express();
const pool = require("./dbconfig");

app.use(express.json());
app.use(express.static('public'));

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
  connection.release();
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

const speakeasy = require('speakeasy');
const sendOTPByEmail = require('./helper/nodemailer');
const { getOtpDetail } = require('./services/services');

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
  
  
    const secret = speakeasy.generateSecret({ length: 20 });
   console.log("secret",secret.base32);
//    console.log("secret ", secret.base32.toString());

 
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 60, // 60 seconds per step
      window: 1, // Allow 1 step drift
      expires: 3600
    });
    sendOTPByEmail(name,email,otp,secret.base32,secret);
    
    // You can now use 'otp' variable to store or send the OTP as per your requirements
  
    res.send({ 
        name: name, 
        email: email, 
        password: password, 
        otp: otp
    });
});

app.post('/verify', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve the OTP secret from the database based on the provided email
        const secretotp = await getOtpDetail(email);
       console.log("secret",secretotp);
        let secret = secretotp[0].secret;
        if (secretotp.length > 0) {
            console.log({
                secret: secret,
                encoding: 'base32',
                token: otp, // The OTP provided by the user
                step: 60, // 60 seconds per step
                window: 1 // Allow 1 step drift
            });
            // OTP secret found, attempt OTP verification
            const verified = await speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: otp, // The OTP provided by the user
                step: 60, // 60 seconds per step
                window: 1 // Allow 1 step drift
            });
            console.log(verified);

            if (verified) {
                // OTP verification successful
                res.status(200).json({ message: 'Token is valid' });
            } else {
                // OTP verification failed
                res.status(401).json({ message: 'Token is invalid' });
            }
        } else {
            // OTP not found in the database
            res.status(404).json({ message: 'OTP not found for the provided email' });
        }
    } catch (error) {
        // Handle database query errors or other unexpected errors
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


const express = require("express")
const verifyToken = require('../middlewares/verifyToken')
// const app = express
const slackrouter = express.Router()


const { githubcall, githubWebhook, } = require("../controllers/githubController")
const { webhookresult } = require("../services/githubServices")
const { slackCallBack, LoginToSlackApp, slackAccessToken, getSlackAccounts, channelId, addChannelId } = require("../controllers/slackController")


slackrouter.get('/login/slack',LoginToSlackApp)
slackrouter.get('/slack/callback', slackCallBack)

slackrouter.post ('/webhook/github',webhookresult)
slackrouter.post ('/accesstoken',slackAccessToken)
slackrouter.get ('/getslackaccount',getSlackAccounts)
slackrouter.post('/chanelid',addChannelId)




// slackrouter.get('/login/slack',);
  


module.exports = slackrouter;
