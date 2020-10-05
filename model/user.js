const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

UserSchema.pre('save', async function (next) {
    let user = this;
    if(!user.isModified('userPassword')) return next();
    user.userPassword = await bcrypt.hash(user.userPassword, 10);
    user.userName = await user.userName.toLowerCase();
    return next();
  })


module.exports = mongoose.model('User', UserSchema);