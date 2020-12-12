'use strict';
const express = require('express');

const router = express.Router();
const suggestionController = require('../controller/suggestionController');
const authChecker = require('../middleware/authChecker');


router.post('/suggest', suggestionController.createSuggestion);

module.exports = router;