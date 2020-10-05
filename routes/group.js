'use strict';
const express = require('express');

const router = express.Router();
const Group = require('../model/group');
const { inviteParticipants } = require('../components/groupComponent');

router.post('/create', async (req, res) => {
    const { groupDescription, groupName, groupParticipants, createdBy } = req.body;
    try {
        await Group.create({ groupDescription, groupName, groupParticipants, createdBy });
        await inviteParticipants(groupParticipants);

        res.json({ success: 'ok' });

    } catch (error) {
        res.json({ error });
    }
});

router.get('/view', async (req, res) => {
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
