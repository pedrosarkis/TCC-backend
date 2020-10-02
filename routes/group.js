const express = require('express');

const router = express.Router();
const Group = require('../model/group');

router.post('/create', (req, res) => {
    const {groupDescription, groupName, groupParticipants, createdBy} = req.body;
    try {
        Group.create({groupDescription, groupName, groupParticipants, createdBy});
        res.json({success: 'ok'})
        
    } catch (error) {
        res.json({error})
    }
})

router.get('/view', async (req, res) => {
    try {
        const group = await Group.find({});
        let allGroups = group.map(item => item.toObject())
        allGroups = allGroups.filter(groupIterator => {
           return groupIterator.groupParticipants.includes(req.session.username);
        });
        let userHasGroup = allGroups[0];
        res.json({userHasGroup})
    } catch (error) {
    }   
})


module.exports = router;