const prisma = require("../db/prisma");


const sendMessage = async (req, res) => {
    
    console.log(req.body);
 
   


    try {
      const message = await prisma.message.create({
        data:req.body

      });
      res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: "Could not send message", error: error.message });
    }
  };


 
module.exports = {sendMessage};
