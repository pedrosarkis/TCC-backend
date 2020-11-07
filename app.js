
'use strict';
const express = require('express');
const app = express();

const cors = require('cors');
const bodyparser = require('body-parser');
const userRoute = require('./routes/users');
const newsRoute = require('./routes/news');
const suggestionRoute = require('./routes/suggestion');
const groupRoute = require('./routes/group');
const reportRoute = require('./routes/report');
const database = require('./database/connection');
const cookieParser = require('cookie-parser');
app.use(cors());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//     res.header('Access-Control-Allow-Headers', '*');
//     app.use(cors());
//     next();
// });
app.options('/news/scrap', cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

app.use('/user', userRoute);
app.use('/news', newsRoute);
app.use('/suggestion', suggestionRoute);
app.use('/group', groupRoute);
app.use('/report', reportRoute);
database.connectDabatase();

const port = process.env.PORT || 8080;
app.listen(port);
