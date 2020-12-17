
'use strict';
const { EMAIL_SERVER_URL } = require('../helper/constants');
const axios = require('axios');

const sendInvite =  async (participants, groupId) => {

    const body = {
        from: 'pedrosarkisverani@gmail.com',
        to: participants,
        subject: 'Você foi convidado para juntar-se a um grupo',
        body: `Acesse e veja o seu convite em: https://tcspedro.netlify.app/groups`,
    };

    try {
        await axios.post(EMAIL_SERVER_URL, body);
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    sendInvite,
};
