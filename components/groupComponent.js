'use strict';
const users = require('../model/user');
const { sendInvite } = require('../helper/mailerInvite');

const inviteParticipants = async (participants, groupId) => {
    let activeUsers = [];
    const allParticipantsToInvite = participants.split(',').map(mail => mail.trim());
    try {
        activeUsers = await users.find({ userName: { $in: allParticipantsToInvite } });
        activeUsers = activeUsers.map(obj => obj._doc.userName);
     } catch (error) {
        console.log(error);
    }
    sendInvite(allParticipantsToInvite, groupId);
};

module.exports = {
    inviteParticipants,
};
