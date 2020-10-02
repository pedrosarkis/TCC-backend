const express = require('express');
const router = express.Router();
const { pup } = require('../helper/pupFinder');

const News = require('../model/news');

const axios = require('axios');
const extractor = require('unfluff');

router.get('/', async (req, res) => {
    let news = await News.find({isFakeNews: true});
    

    res.render('home.ejs', {query: req.session.username, news: news.length});
});

router.post('/scrap', async (req, res) => {
    const { url } = req.body;
    const data = await axios.get(url);
    const contentData = extractor(data.data);
    res.json(contentData.text);
});

router.post('/create', async (req, res) => {
    const {content , url } = req.body;

    try {
        let veredict = await pup(content);
        veredict = veredict === 'FAKE' ? false : true;
        News.create({verifiedBy: req.session.username, content, url, isFakeNews: veredict});
        res.json({
            veredict,
            success: 'ok',
        })
       
    } catch (error) {
        
    }
})

module.exports = router;