const prisma = require("../db/prisma");


const createConversation = async (req, res) => {
  const { doctorId, patientId } = req.body;

 
  if (!doctorId || !patientId) {
    return res.status(400).json({ message: "Doctor ID and Patient ID are required." });
  }

  try {
    const conversation = await prisma.conversation.create({
      data: {
        doctorId,
        patientId,
      }
    });
    res.status(201).json({ message: "Conversation is created", data: conversation });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Could not create conversation", error: error.message });
  }
};

const getMessages =  async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(id),
      },
      include: {
        conversation: {
          include: {
            doctor: true,  
            patient: true  
          }
        }
      }
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: "Could not fetch messages", error: error.message });
  }
};

const getConversation = async (req, res) => {
  const { id } = req.params;
  
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: true, 
        doctor: true, 
        patient: true, 
      },
    });
    if (conversation) {
      res.status(200).json(conversation);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not fetch conversation", error: error.message });
  }
};

const getAllConversations = async (req, res) => {
  const { userId } = req.params; // Assume userId is a path parameter

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { doctorId: parseInt(userId) },
          { patientId: parseInt(userId) }
        ],
      },
      include: {
      //   doctor: {
      //     select: {
      //       id: true,
      //       fullName: true,
      //       profile_picture: true
      //     }
      //   },
      //   patient: {
      //     select: {
      //       id: true,
      //       fullName: true,
      //       profile_picture: true
      //     }
      //   },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 
        }
      },
    });

    if (conversations.length === 0) {
      return res.status(404).json({ message: "No conversations found" });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
};


module.exports = {createConversation,getMessages,getConversation,getAllConversations};