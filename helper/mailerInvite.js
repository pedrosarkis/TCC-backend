
const nodemailer = require('nodemailer');

const sendInvite =  async (participants) => {
    
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

}