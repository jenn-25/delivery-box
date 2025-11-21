import axios from 'axios';

export const sendPasswordResetOTPEmail = async(receiverEmail, receiverName, otp) =>{
    try {
    const response = await axios.post(
      process.env.BREVO_EMAIL_API_ENDPOINT,
      {
        sender: { email: process.env.SENDER_EMAIL_ID , name: 'NORSU - SC Delivery Box capstone project' },
        to: [{ email: receiverEmail, name: receiverName }],
        subject: 'NORSU - SC Delivery Box capstone project Password Reset verification OTP',
        htmlContent: `Your NORSU - SC Delivery Box capstone project Password Reset OTP code is ${otp}. Please verify your account using this code to reset your password.`
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email: ', error.response?.data || error.message);
  }

}

export const sendNewPasswordEmail = async(receiverEmail, receiverName, password) =>{
    try {
    const response = await axios.post(
      process.env.BREVO_EMAIL_API_ENDPOINT,
      {
        sender: { email: process.env.SENDER_EMAIL_ID , name: 'NORSU - SC Delivery Box capstone project' },
        to: [{ email: receiverEmail, name: receiverName }],
        subject: "Welcome to NORSU - SC Delivery Box capstone project",
        htmlContent: `Welcome NORSU - SC Delivery Box capstone project. You have successfully registered your account with email: `+receiverEmail+"\n\nWe generated a random password for you: "+password+"\n\nTo ensure the security of you account please change this password when you login.\n\nThank you."
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email: ', error.response?.data || error.message);
  }

}