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
        const token = jwt.sign({ user: email }, process.env.SECRET, {
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

router.get('/history', async (req, res) => {
    const { user } = req.query;
    try {
        const news = await News.find({ verifiedBy: user }).lean();

        res.json({
            success: true,
            news,
         });
    } catch (error) {
        res.json({
            success: false,
            error
        })
    }
});

router.delete('/clean', authChecker, async (req, res) => {
    const { user } = req.body;
    
    try {
        await News.deleteMany({ verifiedBy: user });
        res.json({ success: true });
    } catch (error) {
        res.json({
            success: false,
            error,
          });
    }
});

router.post('/changePassword', async (req, res) => {
    const {oldPassword, newPassword, email} = req.body;
    const user = await User.findOne({userName: email}).lean();
    const isCorretPassword = await bcrypt.compare(oldPassword, user.userPassword)
    if(!isCorretPassword) {
        return res.json({
            success: false,
            error: 'A senha antiga informada está incorreta'
        })
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.userPassword);

    if(isSamePassword) {
        return res.json({
            success: false,
            error: 'Sua senha nova não pode ser igual a atual'
        })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10); 
    const dataToUpdate  = {
        userPassword: newPasswordHash
    }
    try {
        await User.findOneAndUpdate({userName: email}, dataToUpdate, {
            new: true
        })
        res.json({
            success: true,
            message: 'A senha foi alterada com sucesso'
        })
        
    } catch (error) {
        
    }
})

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
