'use strict'

const News = require('../model/news');

const getReport = async (req, res) => {
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
}

module.exports = {
    getReport
}