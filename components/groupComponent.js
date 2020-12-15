'use strict';
const users = require('../model/user');
const Group = require('../model/group');

const handleInvitation = async (participants) => {
    const promisesToCheckUserGroup = participants.map(user => {
        return Group.findOne({
                $or: [{groupParticipantsAccepted: user }, {createdBy: user}, {groupParticipantsPending: user}]
            }).lean()
        
    })
    const userStatus = await Promise.all(promisesToCheckUserGroup);

    const participantsToInvite = userStatus.map((usr, index) => {
        return {
            user: participants[index],
            status: usr,
        }
    }).filter(userToInvite => {
        return userToInvite.status == null;
    }).map(onlyMail => onlyMail.user);

    return participantsToInvite;
};

module.exports = {
    handleInvitation,
};
