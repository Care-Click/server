const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  rundomNumber,
  findNearestDoctors,
} = require("../helper/helperFunction.js");



const  sendMessagesToPatient = async (req, res) => {
    const  doctorId = req.doctorId
    let { patientId, content } = req.body;
   
  
    try {
      const message = await prisma.message.create({
        data: {
          content,
          fromDoctorId: doctorId, // Doctor sending the message
          fromPatientId: patientId // Patient receiving the message
        }
      });
  
      res.json(message);
    } catch (error) {
      console.error('Failed to send message from doctor:', error);
      res.status(500).json({ error: "Could not send message due to server error." });
    }
  }
  const  getMessagesFromPatient = async (req, res) => {
    const  doctorId = req.doctorId 
    
    const patientId = parseInt(req.params.patientId)
  
    try {
      const messages = await prisma.message.findMany({
        where: {
        
            fromDoctorId: doctorId, fromPatientId: patientId 
           
          
        },
        orderBy: {
          createdAt: 'desc' 
        },
      });
      res.json(messages);
    } catch (error) {
      console.error('Failed to get messages:', error);
      res.status(500).json({ error: "Could not retrieve messages due to a server error." });
    }
  }
  
  const getAllMessagesofDoctor = async (req, res) => {
    const doctorId = req.doctorId 
  
    try {
      // Retrieve all messages where the doctor is either the sender or the recipient
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { fromDoctorId: doctorId },
            { fromPatientId: doctorId },
          ],
        },
        orderBy: {
          createdAt: 'desc' 
        },
      });
  
      res.json(messages);
    } catch (error) {
      console.error('Failed to get messages:', error);
      res.status(500).json({ error: "Could not retrieve messages due to a server error." });
    }
  }
  
  const sendMessageToDoctor = async (req, res) => {
    const patientId = req.patientId;
    let { doctorId, content } = req.body;
  
    try {
      const message = await prisma.message.create({
        data: {
          content,
          fromPatientId: patientId, // Patient sending the message
          fromDoctorId: doctorId // Doctor receiving the message
        }
      });
  
      res.json(message);
    } catch (error) {
      console.error('Failed to send message from patient:', error);
      res.status(500).json({ error: "Could not send message due to server error." });
    }
  }
  
  
  const getAllMessagesofPatient = async (req, res) => {
    const patientId = req.patientId;
    try {
      const messages = await prisma.message.findMany({
        where: {
         
          OR: [
            { fromDoctorId: patientId },
            { fromPatientId: patientId },
          ],
        },
        orderBy: {
          createdAt: 'desc' 
        },
      });
  
      res.json(messages);
    } catch (error) {
      console.error('Failed to get messages:', error);
      res.status(500).json({ error: "Could not retrieve messages due to a server error." });
    }
  }
  
  const getMessagesFromDoctor = async (req,res) => {
  
    const patientId = req.patientId; 
    const doctorId = parseInt(req.params.doctorId);
  
    try {
      const messages = await prisma.message.findMany({
        where: {
          fromDoctorId: doctorId, // Doctor sending the messages
          fromPatientId: patientId, // Patient receiving the messages
        },
        orderBy: {
          createdAt: 'desc', 
        },
      });
      res.json(messages);
    } catch (error) {
      console.error('Failed to get messages:', error);
      res.status(500).json({ error: "Could not retrieve messages due to a server error." });
    }
  
  }

module.exports = {
    sendMessageToDoctor,
    getMessagesFromDoctor,
    getAllMessagesofPatient,
    sendMessagesToPatient,
    getMessagesFromPatient,
    getAllMessagesofDoctor,

}