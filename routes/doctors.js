const express = require('express');
const router = express.Router();
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')

const { signup, signin, createMedExp ,getDoctorPatients,getOnePatient} = require('../controllers/doctors.js')

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/createMedExp", isDoctorAuthenticated, createMedExp)

router.get("/patients", isDoctorAuthenticated, getDoctorPatients)

router.get("/patient/:patientId", isDoctorAuthenticated, getOnePatient)

module.exports = router    