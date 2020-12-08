
'use strict';
const { EMAIL_SERVER_URL } = require('../helper/constants');
const axios = require('axios');

const sendNotification =  async (users, news, url) => {

    const body = {
        from: 'pedrosarkisverani@gmail.com',
        to: users,
        subject: 'Um de seus colegas de grupo encontrou uma notícia falsa',
        body: `A notícia com o conteúdo abaixo foi pesquisada em nossa plataforma, e nosso algoritmo encontrou uma grande
        probabilidade dela ser falsa: ${news}`,
    };

    try {
        await axios.post(EMAIL_SERVER_URL, body);
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    sendNotification,
};
