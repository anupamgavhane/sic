const express = require('express')
const authUser =require('../middleware/auth.middleware')
const {getMessages}=require('../controllers/message.controller')

const router = express.Router()

router.get("/:roomId/messages", authUser, getMessages);

module.exports=router;