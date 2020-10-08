'use strict';
const mongoose = require('mongoose');
const password = process.env.PASSWORD;

const connectDabatase = () => {
    const url = `mongodb+srv://sarkis:${password}@cluster0.5xxb0.mongodb.net/<dbname>?retryWrites=true&w=majority`;

    const options = { reconnectTries: Number.MAX_VALUE,reconnectInterval: 500, useNewUrlParser: true };

    mongoose.connect(url,options);

    mongoose.set('useCreateIndex', true);

    mongoose.connection.on('error', err => {
        if (err) console.log('Erro na conexão com o banco');
    });

    mongoose.connection.on('connected', err => {
        if (err) console.log(err);
        console.log('Sucesso na conexão com o banco');
    });

    mongoose.connection.on('disconnected', err => {
        if (err) console.log(err);
        console.log('Perda de conexão com o banco');
    });
};

exports.connectDabatase = connectDabatase; // usando module.exports não funciona para este caso
