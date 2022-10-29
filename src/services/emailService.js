const nodemailer = require('nodemailer');

const userName = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

console.log(`Username: ${userName}, Password: ${password}`);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: userName,
        pass: password
    }
});



const sendEmail = async (subject, message, contactEmail) => {
    let finalMessage = message + '\nContact Email: ' + contactEmail;
    
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: subject,
        text: finalMessage
    };

    let info = await transporter.sendMail(mailOptions).catch(error => {
        console.log(error);
    });    
};

module.exports = {sendEmail};