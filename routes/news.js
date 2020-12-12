'use strict';
const express = require('express');
const router = express.Router();
const { pup } = require('../helper/pupFinder');
const cors = require('cors');
const newsController = require('../controller/newsControl');


router.post('/scrap', newsController.scrapContent);

router.get('/getall', newsController.getAllNews);

router.post('/create', newsController.createNews);

module.exports = router;
