'use strict'

const Group = require('../model/group');
const { sendNotification } = require('../helper/mailerNotification');

const handleNotification = async (user, content, url) => {
    try {
        const group = await Group.findOne(
            {
                $or: [{groupParticipantsAccepted: user }, {createdBy: user} ] 
            }).lean();
        if(!group) return;
        const participantsToNotify = [...group.groupParticipantsAccepted, ...group.createdBy].filter(emailUser => user !== emailUser);
        sendNotification(participantsToNotify, content, url);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    handleNotification
}