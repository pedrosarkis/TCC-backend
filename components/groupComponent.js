'use strict';
const users = require('../model/user');
const { sendInvite } = require('../helper/mailerInvite');

const inviteParticipants = async participants => {
    const users = [];
    const allParticipantsToInvite = participants.split(',');
    try {
        let activeUsers = await users.find({ userName: { $in: allParticipantsToInvite } });
        activeUsers = activeUsers.toObject();
    } catch (error) {
        console.log(error);
    }
    const notUsers = allParticipantsToInvite.filter(email => !activeUsers.includes(email)); // acho que nao precisa disso, mas ta aqui anyway
    allParticipantsToInvite.forEach(email => {
        const isActiveUser = activeUsers.includes(email);
        users.push({
            email,
            isActiveUser,
        });
    });
    sendInvite(users);
    //continuar
};

module.exports = {
    inviteParticipants,
};
