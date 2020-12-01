'use strict';
const express = require('express');
const router = express.Router();
const { pup } = require('../helper/pupFinder');
const cors = require('cors');

const News = require('../model/news');

const axios = require('axios');

const Iconv = require('iconv').Iconv;
const extractor = require('unfluff');
const authChecker = require('../middleware/authChecker');
const iconv = new Iconv('UTF-8', 'ISO-8859-1');

router.post('/scrap', cors(), async (req, res, next) => {
    const apiClient = axios.create();
    apiClient.interceptors.response.use(function (response) {
        if (response.headers['content-type'].includes('utf') || response.headers['content-type'].includes('UTF') || response.headers['content-type'] === 'text/html') {
            response.data = iconv.convert(response.data);
        }
        return response;
    }, function (error) {
        console.log('rejeitou a promise');
        return Promise.reject(error);
    });

    const { url } = req.body;
    console.log(url);
    try {
        const data = await apiClient.get(url, {
            responseEncoding: 'latin1',
        });

        const contentData = extractor(data.data, 'pt');
        res.status(200).json({
            content: contentData.text,
        });

    } catch (error) {
        return res.json({
            success: false,
            message: 'Houve um erro ao coletar a notícia'
        })
    }
});

router.post('/create', authChecker, async (req, res) => {
    const { content , url, verifiedBy } = req.body;
    try {
        let veredict = await pup(content);
        veredict = veredict === 'FAKE' ? false : true;
        await News.create({ verifiedBy, content, url, isFakeNews: !veredict });
        res.json({
            veredict,
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error,
        });
        
    }
    
});

module.exports = router;
