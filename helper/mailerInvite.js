
'use strict';
const nodemailer = require('nodemailer');

const sendInvite =  async (participants, groupId) => {
    const emailSent = [];
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'ahgorabookclub@gmail.com',
            pass : process.env.PASSWORD,
        },
    });

    participants.forEach(element => {
        const emailcorpo = {
            from: 'ahgorabookclub@gmail.com',
            to: element,
            subject: 'Você foi convidado para juntar-se a um grupo',
            text: `https://tcspedro.netlify.app/group/pendingInvitation?groupId=${groupId}`,
        };

        emailSent.push(transporter.sendMail(emailcorpo));
    });
    try {
        const allEmails = await Promise.allSettled(emailSent);
        return allEmails;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    sendInvite,
};
