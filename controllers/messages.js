const prisma = require("../db/prisma");


const sendMessage = async (req, res) => {
    const { conversationId, senderId, content} = req.body;
  
    if (!conversationId || !senderId || !content ) {
      return res.status(400).json({ message: "All fields including senderType are required" });
    }
  
    try {
      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
          createdAt: new Date(),

        },
      });
      res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Could not send message", error: error.message });
    }
  };


 
module.exports = {sendMessage};
