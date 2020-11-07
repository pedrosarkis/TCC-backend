'use strict';
const express = require('express');

const router = express.Router();
const authChecker = require('../middleware/authChecker');
const Suggestion = require('../model/suggestion');

router.post('/suggest', async (req, res) => {
    const {user, content} = req.body;

    try {
        await Suggestion.create({
            sentBy: user,
            content
        });
        return res.json({
            success: true,
            message: 'Sugestão enviada com sucesso'
        });
    } catch (error) {
        return res.json({
            success: false,
            error,
        });
    };
})


module.exports = router;