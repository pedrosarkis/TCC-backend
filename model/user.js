const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {type: String, required: true},
    userPassword: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', UserSchema);