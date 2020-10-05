'use strict';
const express = require('express');

const router = express.Router();
const User = require('../model/user');
const News = require('../model/news');
const generatePassword = require('generate-password');
const mailerNewPassword = require('../helper/mailerPassword');
require('dotenv-safe').config();
const jwt = require('jsonwebtoken');


router.post('/create', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCreated = await  User.create({ userName: email, userPassword: password });
        const token = jwt.sign({ userId: userCreated._id }, process.env.SECRET, {
            expiresIn: 86400,
        });
        res.cookie('qwert', token.toString(), { secure: false, httpOnly: true, });
        return res.status(200).send({
            auth: true,
            token,
        });
    } catch (error) {
        res.json({ error: error });
    }
});

router.post('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.json({ success: ok });
    } catch (error) {

    }
});

router.post('/login', async (req, res) => {
    const { userName, userPassword } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
        res.json({ error: 'Usuário não encontrado' });
    }
    const isPasswordRight = user._doc.userPassword === userPassword;
    if (isPasswordRight) {
        req.session.username = userName;
        req.session.password = userPassword;
    } else {
        res.json({
            error: 'A senha está incorreta',
        });
    }
    res.json({ success: 'Ok' });
});

router.get('/history', async (req, res) => {
    const params = req.params;
    let news = await News.find({ verifiedBy: params.username });
    news = news.map(item => item.toObject());
    let user = await User.findOne({ userName: req.session.username });
    user = user.toObject();
    res.json({ user, news });
});

router.delete('/clean', async (req, res) => {

    try {
        await News.deleteMany({ verifiedBy: req.session.username });
        res.json({ success: 'ok' });
    } catch (error) {
        res.json({ error });
    }
});

router.post('/recover',  async (req, res) => {
    const { email } = req.body;
    const newPassword = generatePassword.generate({
        length: 11,
        uppercase: false,
        numbers: true,
    });

    const userName = email;

    try {
        const updateUser = { userPassword: newPassword };
        const user = await User.findOneAndUpdate({ userName }, updateUser, {
            new: true,
        });
        if (user !== null) {
            mailerNewPassword.sendEmail(email, newPassword);
            res.json({ success: 'ok' });
        } else {
            throw new Error('Error message');
        }
    } catch (error) {
        res.send(error);
    }
});

router.get('/recovery', (req, res) => {
    res.render('recovery.ejs');
});

module.exports = router;
