'use strict';
const express = require('express');
const router = express.Router();
const { pup } = require('../helper/pupFinder');
const cors = require('cors');

const News = require('../model/news');

const axios = require('axios');
const apiClient = axios.create();
const Iconv = require('iconv').Iconv;
const extractor = require('unfluff');
const authChecker = require('../middleware/authChecker');

router.post('/scrap', cors(), async (req, res, next) => {
    const iconv = new Iconv('UTF-8', 'ISO-8859-1');
    apiClient.interceptors.response.use(function (response) {
        if (response.headers['content-type'].includes('utf') || response.headers['content-type'].includes('UTF')) {
            response.data = iconv.convert(response.data);
        }
        return response;
    }, function (error) {

        return Promise.reject(error);
    });

    const { url } = req.body;
    const data = await apiClient.get(url, {
        responseEncoding: 'latin1',

    });
    const contentData = extractor(data.data, 'pt');
    res.status(200).json({
        content: contentData.text,
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
