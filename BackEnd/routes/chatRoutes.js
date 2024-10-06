const express = require('express');
const router = express.Router();

const auth= require('../middleware/auth');
const chatController = require('../controller/chatController');

router.get('/getAll',auth.authentication, chatController.getChat);
router.get('/getNew', auth.authentication, chatController.getNewChat);
router.post('/create', auth.authentication, chatController.createChat);

module.exports = router;