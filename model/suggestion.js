const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SuggestionSchema = new Schema({
    sentBy: {type: String, required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now },
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);