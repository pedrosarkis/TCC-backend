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
            success: true,
            group: groupDescription.id
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

router.post('accept', async (req, res) => {
    const {groupId, user} = req.body;
    
    const group = await Group.update({
        id: groupId},
         {$pull:{groupParticipantsPending: user}},
          {$push: {groupParticipantsAccepted: user}});

    console.log('Continuar essa bosta dps');
});


router.get('/view', async (req, res) => {
    const { user } =  req.query;
    try {
        const group = await Group.findOne(
            {
                $or: [{groupParticipantsAccepted: user }, {createdBy: user} ] 
            });
       if(!group) {
           return res.json({
               success: false,
               message: 'Usuário não está em nenhum grupo'
           })
       }
        res.json({
            success: true,
            group: group._doc,
         });
    } catch (error) {
        res.json({
            success: false,
            message: 'Houve um erro ao criar o grupo'
        })
    }
});

module.exports = router;
