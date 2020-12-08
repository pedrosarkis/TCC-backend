const { EMAIL_SERVER_URL } = require('../helper/constants');
const axios = require('axios');

const sendEmail = async  (destinatario, newPassword) => {


    let emailcorpo = {
      from: "pedrosarkisverani@gmail.com",
      to: [destinatario],
      subject: 'Plataforma Detecção Fake News - Nova senha',
      body: `Sua nova senha é ${newPassword}`
    }

    try {
      await axios.post(EMAIL_SERVER_URL, emailcorpo);
    } catch (error) {
      console.log(error);
    }
    
    
};

exports.sendEmail = sendEmail;