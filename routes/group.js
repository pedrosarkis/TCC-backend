'use strict';
const express = require('express');

const router = express.Router({ mergeParams: true});
const Group = require('../model/group');
const authChecker = require('../middleware/authChecker');
const { inviteParticipants } = require('../components/groupComponent');

router.post('/create', async (req, res) => {
    const { groupDescription, groupName, groupParticipantsInvited, createdBy} = req.body;
    try {
        const groupCreated = await Group.create({ groupDescription, groupName, groupParticipantsInvited, createdBy });
       // await inviteParticipants(groupParticipantsInvited, groupCreated.id);
        res.status(200).json({
            success: true
        })
        
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get('/group/pending'), async (req, res) => {
    const groupId = req.params.groupId;
    const token = req.header.authorization;

    const group = await Group.findById({id: groupId});

}

router.delete('/deleteGroups', async (req, res) => {
    await Group.deleteMany({});
    
})

router.get('/view', authChecker, async (req, res) => {
    const userParam =  req.params;
    try {
        const group = await Group.find({});
        let allGroups = group.map(item => item.toObject());
        allGroups = allGroups.filter(groupIterator => {
            return groupIterator.groupParticipants.includes(userParam);
        });
        const userHasGroup = allGroups[0];
        res.json({ userHasGroup });
    } catch (error) {
    }
});

module.exports = router;
