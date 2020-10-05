
'use strict';
const nodemailer = require('nodemailer');

const sendInvite =  async participants => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'ahgorabookclub@gmail.com',
            pass : 'ssffdd66',
        },
    });

    const emailcorpo = {
        from: 'ahgorabookclub@gmail.com',
        to: destinatario,
        subject: 'Nova senha',
        text: `Sua nova senha é ${newPassword}`,

    };

};

module.exports = {
    sendInvite,
};
