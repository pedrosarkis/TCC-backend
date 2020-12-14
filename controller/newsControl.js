'use strict'

const News = require('../model/news');
const {NEWS_CATEGORIZER_URL_PT, NEWS_CATEGORIZER_URL_EN, AWS_TOKEN} = require('../helper/constants');
const axios = require('axios');
const Iconv = require('iconv').Iconv;
const extractor = require('unfluff');
const iconv = new Iconv('UTF-8', 'ISO-8859-1');
const { handleNotification } = require('../components/newsComponent');
const lgDetect = require('languagedetect');
const languageDetector = new lgDetect();


const scrapContent = async (req, res) => {
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
}

const getAllNews = async (req, res) => {
    try {
        const news = await News.find({}).lean();
        res.json({
            news,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false
        })
    }
}

const createNews = async (req, res) => {
    const { content , url = '', verifiedBy } = req.body;
    
    try {
        let veredict = await axios.post('https://httpbin.org/post', {content}, {
            headers: {
            'content-type': 'application/json',
            'authorization': AWS_TOKEN
        }
        });
        const propability = veredict;
        
        veredict = veredict.prediction > 0.5 ? true : false
        if(!veredict) {
            //await handleNotification(verifiedBy, content, url);
        }
        await News.create({ verifiedBy, content, url, isFakeNews: veredict });
        res.json({
            veredict: false,
            success: true,
            propability
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error,
        });
    }
}

module.exports = {
    scrapContent,
    getAllNews,
    createNews
}