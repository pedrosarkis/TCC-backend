const nodemailer = require('nodemailer');

const sendEmail = async  (destinatario, newPassword) => {

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port : 587,
    secure : false,
  auth : {
    user : 'ahgorabookclub@gmail.com',
    pass : process.env.PASSWORD
  }
});

    let emailcorpo = {
      from: "ahgorabookclub@gmail.com",
      to: destinatario,
      subject: 'Nova senha',
      text: `Sua nova senha é ${newPassword}`

    }
    
    try {
      const emailSent = await transporter.sendMail(emailcorpo);
      return emailSent;
    } catch (error) {
      console.log(error);
    }
};

exports.sendEmail = sendEmail;