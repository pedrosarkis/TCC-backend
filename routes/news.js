'use strict';
const express = require('express');
const router = express.Router();
const { pup } = require('../helper/pupFinder');

const News = require('../model/news');

const axios = require('axios');
const extractor = require('unfluff');
const authChecker = require('../middleware/authChecker');

router.post('/scrap', async (req, res, next) => {
    const { url } = req.body;
    const data = await axios.get(url);
    const contentData = extractor(data.data, 'pt');
    res.status(200).json({
        content: contentData,
    });
});

router.post('/create', authChecker, async (req, res) => {
    const { content , url, verifiedBy } = req.body;
    try {
        let veredict = await pup(content);
        veredict = veredict === 'FAKE' ? false : true;
        News.create({ verifiedBy, content, url, isFakeNews: !veredict });
        res.json({
            veredict,
            success: true,
        });

    } catch (error) {
        res.json({
            success: false,
            error,
        });
    }
});

module.exports = router;
