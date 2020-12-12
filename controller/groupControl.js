'use strict'

const Group = require('../model/group');
const ObjectId = require('mongodb').ObjectID;
const authChecker = require('../middleware/authChecker');
const { handleInvitation } = require('../components/groupComponent');


const deleteAll = async (req, res) => {
    try {
        await Group.deleteMany({});
        res.send('Deletado com sucesso');
    } catch (error) {
        console.log(error);
        res.send('Erro pra deletar tudo');
    }
}

const deleteGroupById = async (req, res) => {
    const { groupId } = req.body;
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
}

const acceptGroupInvitation = async  (req, res) => {
    const {groupId, user} = req.body;
    const operations = [''];
    
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
}

const rejectGroupInvitation = async (req, res) => {
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
}

const leaveGroup = async (req, res) => {
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
}

const getUserGroup = async (req, res) => {
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
}

const createGroup = async (req, res) => {
    const { groupDescription, groupName, groupParticipantsInvited, createdBy} = req.body;
    //const participantsToInvite  = await handleInvitation(groupParticipantsInvited);
    try {
        const groupCreated = await Group.create({ groupDescription, groupName, groupParticipantsInvited, createdBy, groupParticipantsPending: groupParticipantsInvited });
       // await inviteParticipants(groupParticipantsInvited, groupCreated.id);
        res.status(200).json({
            success: true,
            group: groupCreated.id
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}


module.exports = {
    deleteAll,
    deleteGroupById,
    acceptGroupInvitation,
    rejectGroupInvitation,
    leaveGroup,
    getUserGroup,
    createGroup
}