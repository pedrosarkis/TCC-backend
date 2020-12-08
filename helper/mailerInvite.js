
'use strict';
const nodemailer = require('nodemailer');

const sendInvite =  async (participants, groupId) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'ahgorabookclub@gmail.com',
            pass : process.env.PASSWORD,
        },
    });

    const emailcorpo = {
        from: 'ahgorabookclub@gmail.com',
        to: participants,
        subject: 'Você foi convidado para juntar-se a um grupo',
        text: ` https://tcspedro.netlify.app/group/pendingInvitation?groupId=${groupId} `,
    };

    try {
        const emailSent =  await transporter.sendMail(emailcorpo);
        return emailSent;
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    sendInvite,
};
