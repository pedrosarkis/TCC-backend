const express = require('express');

const router = express.Router();
const User = require('../model/user');
const News = require('../model/news');
const generatePassword = require('generate-password');
const mailerNewPassword = require('../helper/mailerPassword');

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

router.get('/profile', (req,res) => {
    res.render('profile.ejs');
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

router.get('/history', async (req, res) => {
    let news = await News.find({verifiedBy: req.session.username});
    news = news.map(item => item.toObject());
    let user = await User.findOne({userName: req.session.username});
    user = user.toObject();
    res.json({user, news})
    
})

router.get('/clean', async (req, res) => {
    try {
        const deletedNews = await News.deleteMany({verifiedBy: req.session.username})
        res.json({success: 'ok'})
    } catch (error) {
        res.json({error})
    }
})

router.post('/recover',  async (req, res) => {
    const { email } = req.body;
    const newPassword = generatePassword.generate({
      length: 11,
      uppercase: false,
      numbers: true
    })

    let userName = email;
  
    try {
      const updateUser = {userPassword: newPassword};
      const user = await User.findOneAndUpdate({ userName }, updateUser, {
        new: true
      });
      if (user != null) {
        mailerNewPassword.sendEmail(email, newPassword);
        res.json({success: 'ok'});
      } else {
        throw new Error ('Error message');
      }
    } catch (error) {
      res.send(error);
    }
})

router.get('/recovery', (req, res) => {
    res.render('recovery.ejs');
})

module.exports = router;