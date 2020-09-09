const express = require('express');
const router = express.Router();

const axios = require('axios');
const extractor = require('unfluff');

router.get('/', (req, res) => {
    res.render('home.ejs', {query: req.session.username});
});

router.post('/scrap', async (req, res) => {
    const { url } = req.body;
    const data = await axios.get(url);
    const contentData = extractor(data.data);
    res.json(contentData.text);
});

module.exports = router;