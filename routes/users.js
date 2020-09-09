const express = require('express');

const router = express.Router();
const User = require('../model/user');

router.post('/create', async (req, res) => {
    const { email, password} = req.body;
    try {
        await  User.create({userName: email, userPassword: password});
        req.session.username = email;
        req.session.password = password;
        res.json({sucess: 'Ok'});
    } catch (error) {
        res.json({error: error});
        
    }
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
})

router.get('/register', (req, res) => {
    res.render('register.ejs');
})

router.post('/logout', (req, res) => {
    
    try {
        req.session.destroy();
        res.json({success: ok});
    } catch (error) {
        
    } 
})

router.post('/login', async (req, res) => {
    const {userName, userPassword} = req.body;
    const user = await User.findOne({userName});
    if(!user) {
        res.json({error: 'Usuário não encontrado'});
    }
    const isPasswordRight = user._doc.userPassword === userPassword;
    if(isPasswordRight){
        req.session.username = userName;
        req.session.password = userPassword;
    } else {
        res.json({error: "A senha está incorreta"});
    }
    res.json({success: 'Ok'})
})


module.exports = router;