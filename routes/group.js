'use strict';
const express = require('express');

const router = express.Router({ mergeParams: true});
const Group = require('../model/group');
const authChecker = require('../middleware/authChecker');
const { inviteParticipants } = require('../components/groupComponent');

router.post('/create', authChecker, async (req, res) => {
    const { groupDescription, groupName, groupParticipants, createdBy} = req.body;
    try {
        const groupCreated = await Group.create({ groupDescription, groupName, groupParticipants, createdBy });
        await inviteParticipants(groupParticipants, groupCreated.id);
        
    } catch (error) {
        res.json({ error });
    }
});

router.get('/accept'), async (req, res) => {
    const params = req.params;

}

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
