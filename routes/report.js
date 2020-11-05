'use strict';
const express = require('express');
const News = require('../model/news');
const router = express.Router();


router.get('/extract', async (req, res) => {
    try {
        const news = await News.find({ isFakeNews: true }).lean();
        res.json({
            totalNews: news.length,
            totalMail: 10,
        });
    } catch (error) {
        res.json({
            success: false,
            error,
        });
    }
});

module.exports = router;
