'use strict';
const express = require('express');

const router = express.Router();
const User = require('../model/user');
const News = require('../model/news');
const generatePassword = require('generate-password');
const mailerNewPassword = require('../helper/mailerPassword');
require('dotenv-safe').config();
const authChecker = require('../middleware/authChecker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.post('/create', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCreated = await User.create({ userName: email, userPassword: password });
        const token = jwt.sign({ userId: userCreated._id }, process.env.SECRET, {
            expiresIn: 86400,
        });
        return res.status(200).send({
            auth: true,
            token,
        });
    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }
});

router.post('/login', async (req, res) => {
    const { userName, userPassword } = req.body;
    
    const user = await User.findOne({ userName });
    if (!user) {
        res.json({ error: 'Usuário não encontrado' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: 86400,
    });

    const isPasswordRight = await bcrypt.compare(userPassword, user._doc.userPassword);
    if(isPasswordRight) {
        res.json({
            success: true,
            token,
       });
    } else {
        res.json({
            success: false,
            error: 'A senha está incorreta',
       });
    }
});

router.get('/history', authChecker, async (req, res) => {
    const params = req.params;
    let news = await News.find({ verifiedBy: params.username });
    news = news.map(item => item.toObject());
    res.json({ news });
});

router.delete('/clean', authChecker, async (req, res) => {
    const { userName } = req.body;
    const token = req.header.authorization;
    
    try {
        await News.deleteMany({ verifiedBy: userName });
        res.json({ success: true });
    } catch (error) {
        res.json({
            success: false,
            error,
          });
    }
});

router.post('/recover', async (req, res) => {
    const { email } = req.body;
    const passwordParams = {
        length: 11,
        uppercase: false,
        numbers: true
    }
    const newPassword = generatePassword.generate(passwordParams);
    const newPasswordHash = await bcrypt.hash(newPassword, 10); 

    const userName = email;

    try {
        const updateUser = { userPassword: newPasswordHash };
        const user = await User.findOneAndUpdate({ userName }, updateUser, {
            new: true,
        });
        if (user !== null) {
            mailerNewPassword.sendEmail(email, newPassword);
            res.status(200).json({ success: true});
        } else {
            res.status(500).json({
                success: false,
                error,
            })
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
