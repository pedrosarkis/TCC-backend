'use strict';

const Suggestion = require('../model/suggestion');

const createSuggestion = async (req, res) => {
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
}

module.exports = {
    createSuggestion
}