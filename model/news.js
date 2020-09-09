const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    verifiedBy: {type: String, required: true},
    isFakeNews: {type: Boolean, required: true},
    content: {type: String, required: true},
    URL: {type: String},
    createdAt: {type: Date, default: Date.now },
});

module.exports = mongoose.model('News', NewsSchema);