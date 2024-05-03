const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  rundomNumber,
  findNearestDoctors,
} = require("../helper/helperFunction.js");

const sendMessagesToPatient = async (req, res) => {
  const doctorId = req.doctorId;
  let { patientId, content } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        fromDoctorId: doctorId, 
        toPatientId: patientId, 
      },
    });

    res.json(message);
  } catch (error) {
    console.error("Failed to send message from doctor:", error);
    res
      .status(500)
      .json({ error: "Could not send message due to server error." });
  }
};
const getMessagesFromPatient = async (req, res) => {
  const doctorId = req.doctorId;
  const patientId = parseInt(req.params.patientId);

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromDoctorId: doctorId, toPatientId: patientId },
          { fromPatientId: patientId, toDoctorId: doctorId },
        ],
      },
    });

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    console.log(messages);
    res.status(200).send({ messages, doctor, patient });
  } catch (error) {
    console.error("Failed to get messages:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve messages due to a server error." });
  }
};
const getAllMessagesofDoctor = async (req, res) => {
  const doctorId = req.doctorId;

  try {
    const messages = await prisma.message.findMany({
      where: {
        toDoctorId: doctorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      distinct: ["fromPatientId"],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            FullName: true,
            profile_picture: true,
          },
        },
        doctor: {
          select: {
            id: true,
            FullName: true,
            profile_picture: true,
          },
        },
      },
    });

    const enhancedMessages = messages.map((message) => {
      const sender = "Patient"; 
      const receiver = "Doctor";

      return {
        ...message,
        sender,
        receiver,
      };
    });

    res.status(200).json(enhancedMessages);
  } catch (error) {
    console.error("Failed to get messages:", error);
    res
      .status(500)
      .json({ error: "Could not retrieve messages due to a server error." });
  }
};
const sendMessageToDoctor = async (req, res) => {
  const patientId = req.patientId;
  let { doctorId, content } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        fromPatientId: patientId, 
        toDoctorId: doctorId, 
      },
    });

    res.json(message);
  } catch (error) {
    
    res
      .status(500)
      .json({ error: "Could not send message due to server error." });
  }
};

const getAllMessagesofPatient = async (req, res) => {
  const patientId = req.patientId;

  try {
    const messages = await prisma.message.findMany({
      where: {
        toPatientId : patientId 
      },
      orderBy: {
        createdAt: "desc",
      },
      distinct : ["fromDoctorId"],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            FullName: true,
            profile_picture: true,
          },
        },
        doctor: {
          select: {
            id: true,
            FullName: true,
            profile_picture: true,
          },
        },
      },
    });

    const enhancedMessages = messages.map((message) => {
      const sender = "Doctor"; 
      const receiver = "Patient";

      return {
        ...message,
        sender,
        receiver,
      };
    });

    res.status(200).json(enhancedMessages);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve messages due to a server error." });
  }
};

const getMessagesFromDoctor = async (req, res) => {
  const patientId = req.patientId;
  const doctorId = parseInt(req.params.doctorId);

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromDoctorId: doctorId, toPatientId: patientId },
          { fromPatientId: patientId, toDoctorId: doctorId },
        ],
      },
    });
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    
    res.status(200).send({ messages, doctor, patient });
  } catch (error) {
    
    res
      .status(500)
      .json({ error: "Could not retrieve messages due to a server error." });
  }
};

module.exports = {
  sendMessageToDoctor,
  getMessagesFromDoctor,
  getAllMessagesofPatient,
  sendMessagesToPatient,
  getMessagesFromPatient,
  getAllMessagesofDoctor,
};
