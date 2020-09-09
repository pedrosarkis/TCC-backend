const nodemailer = require('nodemailer');

const sendEmail = async  (destinatario, newPassword) => {

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port : 587,
    secure : false,
  auth : {
    user : 'ahgorabookclub@gmail.com',
    pass : 'ssffdd66'
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
      
    }
};

exports.sendEmail = sendEmail;