'use strict';
const users = require('../model/user');
const { sendInvite } = require('../helper/mailerInvite');

const inviteParticipants = async (participants, groupId) => {
    const usersToInvite = [];
    let activeUsers = [];
    const allParticipantsToInvite = participants.split(',').map(mail => mail.trim());
    try {
        activeUsers = await users.find({ userName: { $in: allParticipantsToInvite } });
        activeUsers = activeUsers.map(obj => obj._doc.userName);
     } catch (error) {
        console.log(error);
    }   
    // allParticipantsToInvite.forEach(email => {
    //     const isActiveUser = activeUsers.includes(email);
    //     usersToInvite.push({
    //         email,
    //         isActiveUser,
    //     });
    // });
    sendInvite(allParticipantsToInvite, groupId);
    //continuar
};

module.exports = {
    inviteParticipants,
};
