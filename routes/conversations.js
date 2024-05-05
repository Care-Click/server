const express = require("express");
const router = express.Router();
const {createConversation,getMessages,getConversation,getAllConversations} = require("../controllers/conversations.js");

router.post('/', createConversation);
router.get ('/:id',getConversation)
router.get('/:id/messages',getMessages)
router.get('/:userId/Allconversations',getAllConversations)



module.exports = router;