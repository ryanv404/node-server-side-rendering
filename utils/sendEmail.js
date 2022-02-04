require('dotenv').config({path: '../.env'});
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({to, subject, html}) => {
  try {
    // Message object
    const msg = {
      to,
      from: 'Ryan <404rv404@gmail.com>', 
      subject,
      html
    };
    
    // Send message via SendGrid
    await sgMail.send(msg);
    return;

  } catch (error) {
    console.error(error);
    if (error.response) {console.error(error.response.body)}
  }
};

module.exports = sendEmail;
