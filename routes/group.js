'use strict';
const express = require('express');
const ObjectId = require('mongodb').ObjectID;

const router = express.Router({ mergeParams: true});
const Group = require('../model/group');
const authChecker = require('../middleware/authChecker');
const { inviteParticipants } = require('../components/groupComponent');

router.post('/create', async (req, res) => {
    const { groupDescription, groupName, groupParticipantsInvited, createdBy} = req.body;
    
    try {
        const groupCreated = await Group.create({ groupDescription, groupName, groupParticipantsInvited, createdBy, groupParticipantsPending: participantsToInvite });
       // await inviteParticipants(groupParticipantsInvited, groupCreated.id);
        res.status(200).json({
            success: true,
            group: groupCreated.id
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

router.delete('/delete', async (req, res) => {
    const {groupId} = req.body;
    try {
        await Group.deleteOne({'_id': ObjectId(groupId)});
        return res.json({
            success: true,
            message: 'Grupo excluído com sucesso'
        })
    } catch (error) {
        return res.json({
            success: false,
            error,
        })
    }    
})



router.post('/accept', async (req, res) => {
    const {groupId, user} = req.body;
    const operations = [];
    
    try {
       operations.push(Group.updateOne({'_id': ObjectId(groupId)},
            {$push: {groupParticipantsAccepted: user}}
        ));

        operations.push(Group.updateOne({'_id': ObjectId(groupId)},
            {$pull: {groupParticipantsPending: user}}
        ));

        await Promise.allSettled(operations);
        res.json({
            success: true,
        })
    
    } catch (error) {
        res.json({
            success: false,
            message: error,
        })
    }
});

router.post('/reject', async (req, res) => {
    const {groupId, user} = req.body;
    const operations = [];
    
    try {
       operations.push(Group.updateOne({'_id': ObjectId(groupId)},
            {$push: {groupParticipantsRejected: user}}
        ));

        operations.push(Group.updateOne({'_id': ObjectId(groupId)},
            {$pull: {groupParticipantsPending: user}}
        ));

        await Promise.allSettled(operations);
        res.json({
            success: true,
        })
    
    } catch (error) {
        res.json({
            success: false,
            message: error,
        })
    }
});

router.post('/leaveGroup', async (req, res) => {
    const {groupId, user} = req.body;
    
    try {
        await  Group.updateOne({'_id': ObjectId(groupId)}, 
        {$pull: {groupParticipantsAccepted: user}});

        return res.json({
            success:true,
            message: 'Você saiu do grupo'

        })
    
    } catch (error) {
        return res.json({
            success: false,
            message:'Erro ao sair do grupo',
            error,
        })
    }
    

});
        


router.get('/view', async (req, res) => {
    const { user } =  req.query;
    try {
        const group = await Group.findOne(
            {
                $or: [{groupParticipantsAccepted: user }, {createdBy: user}, {groupParticipantsPending: user} ] 
            });

       if(!group) {
           return res.json({
               success: true,
               message: 'Usuário não está em nenhum grupo'
           })
       }
       const isMember = (group._doc.groupParticipantsAccepted && group._doc.groupParticipantsAccepted.includes(user)) || group._doc.createdBy === user;
        res.json({
            success: true,
            group: group._doc,
            isMember,
         });
    } catch (error) {
        res.json({
            success: false,
            message: 'Houve um erro ao obter o grupo'
        })
    }
});

module.exports = router;
