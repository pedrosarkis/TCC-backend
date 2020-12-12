'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true});
const groupController = require('../controller/groupControl');
const authChecker = require('../middleware/authChecker');


router.post('/create', groupController.createGroup);

router.delete('/deleteGroups', groupController.deleteAll);

router.delete('/delete', groupController.deleteGroupById);

router.post('/accept', groupController.acceptGroupInvitation);

router.post('/reject', groupController.rejectGroupInvitation);

router.post('/leaveGroup', groupController.leaveGroup);

router.get('/view', groupController.getUserGroup);

module.exports = router;
