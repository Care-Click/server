const express = require("express");
const router = express.Router();
const isPatientAuthenticated=require("../middlewares/isPatientAuthenticated")

const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')

const {
    sendMessageToDoctor,
    getMessagesFromDoctor,
    getAllMessagesofPatient, 
    sendMessagesToPatient,
    getMessagesFromPatient,
    getAllMessagesofDoctor,
  } = require("../controllers/messages");

router.post("/patient/send", isPatientAuthenticated, sendMessageToDoctor);

router.get("/messageP/:doctorId", isPatientAuthenticated, getMessagesFromDoctor);

router.get("/messagesPatient", isPatientAuthenticated, getAllMessagesofPatient);

router.post("/messagedoctor/send", isDoctorAuthenticated, sendMessagesToPatient);

router.get("/messageD/:patientId", isDoctorAuthenticated, getMessagesFromPatient);

router.get("/messagesDoc", isDoctorAuthenticated, getAllMessagesofDoctor);


  module.exports = router;
