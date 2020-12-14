'use strict';

const EMAIL_SERVER_URL  = `https://o4xjvb0dzd.execute-api.us-east-1.amazonaws.com/dev/mail/`;
const NEWS_CATEGORIZER_URL_PT = 'http://3.238.247.57/pt/predict/';
const NEWS_CATEGORIZER_URL_EN = 'http://3.238.247.57/en/predict/';
const AWS_TOKEN = 'D8A928B2043DB77E340B523547BF16CB4AA483F0645FE0A290ED1F20AAB76257';

const randomNumberOneOrTwo = () => {
    return Math.round(Math.random() * (1 - 0) + 0);
  }

module.exports = {
    EMAIL_SERVER_URL,
    NEWS_CATEGORIZER_URL_PT,
    NEWS_CATEGORIZER_URL_EN,
    AWS_TOKEN
};
