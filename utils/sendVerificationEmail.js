const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({email, verificationToken, origin}) => {
  try {
    const verifyEmail = `${origin}/verify-email?token=${verificationToken}&email=${email}`;
    const message = `
      <h4>Thank you for joining!</h4>
      <p>Please verify your email address by clicking on the following link:</p>
      <p><a href="${verifyEmail}">Verify Email</a></p>`;
  
    await sendEmail({
      to: email,
      subject: "Confirm your account!",
      html: `
        <h4>Hello there!</h4>
        <br>
        ${message}`
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendVerificationEmail;