'use strict'

const User = require('../model/user');
const News = require('../model/news');
const Group = require('../model/group');
const generatePassword = require('generate-password');
const mailerNewPassword = require('../helper/mailerPassword');
require('dotenv-safe').config();
const authChecker = require('../middleware/authChecker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        await User.create({ userName: email, userPassword: password });
        const token = jwt.sign({ user: email }, process.env.SECRET, {
            expiresIn: 86400,
        });
        return res.status(200).send({
            auth: true,
            token,
            user: email
        });
    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }
}

const deleteUserAccount = async (req, res) => {
    const { user } = req.body;
    const operations = [News.deleteMany({verifiedBy: user}), User.deleteOne({userName: user})];
    try {
        await Promise.allSettled(operations);
        return res.json({
            success: true,
            message: 'Deletado com sucesso'
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: 'Erro ao deletar'
        })
    }    
}

const doLogin = async (req, res) => {
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
}

const deleteAllUser = async (req, res) => {
    const operation = [Group.deleteMany({}), User.deleteMany({}), News.deleteMany({})];
    try {
        await Promise.allSettled(operation);
        res.json({
            message: 'Deletado com sucesso'
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: 'Erro ao deletar'
        })
    } 
}

const getUserHistory = async (req, res) => {
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
}

const deleteAllUserHistory = async (req, res) => {
    const { user } = req.body;
    
    try {
        await News.deleteMany({ verifiedBy: user });
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error,
          });
    }
}

const changeUserPassword = async (req, res) => {
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
}

const sendNewPasswordToUser = async (req, res) => {
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
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {
    createUser,
    deleteUserAccount,
    doLogin,
    getUserHistory,
    deleteAllUserHistory,
    changeUserPassword,
    sendNewPasswordToUser,
    deleteAllUser
}