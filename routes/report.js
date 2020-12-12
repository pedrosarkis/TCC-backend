'use strict';
const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportControl');


router.get('/extract', reportController.getReport);

module.exports = router;
