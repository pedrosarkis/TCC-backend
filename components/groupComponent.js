const users = require('../model/user');
const sendInvite = require('../helper/mailerInvite');

const inviteParticipants = async (participants) => {
    const allParticipantsToInvite = participants.split(',');
    try {
        let activeUsers = await users.find({userName: {$in: allParticipantsToInvite }});
        activeUsers = activeUsers.toObject();
    } catch (error) {
        console.log(error);
    }
    const notUsers = allParticipantsToInvite.filter(email => !activeUsers.includes(email));
    //continuar

}