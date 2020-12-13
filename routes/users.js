'use strict';
const express = require('express');

const router = express.Router();
const userController = require('../controller/userControl');

router.post('/create', userController.createUser);

router.delete('/deleteAccount', userController.deleteUserAccount);

router.post('/login', userController.doLogin);

router.get('/history', userController.getUserHistory);

router.delete('/clean', userController.deleteAllUserHistory);

router.post('/changePassword', userController.changeUserPassword);

router.post('/recover', userController.sendNewPasswordToUser);

router.delete('/deleteall', userController.deleteAllUser);

module.exports = router;
