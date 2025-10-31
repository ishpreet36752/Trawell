const express = require("express");
const messageRouter = express.Router();  

const { userAuth, groupChatAuth} = require("../middlewares/auth.js");
const { getGroupMessage}=require("../controllers/message.controller.js")

messageRouter.get("/group-chat/:groupId", userAuth, groupChatAuth,getGroupMessage);

module.exports=messageRouter; 