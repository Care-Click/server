const express = require('express');
const router = express.Router();
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')

const { signup, signin, createMedExp ,getDoctorPatients,getOnePatient,getDoctor,updateDoctors,verifydoctor} = require('../controllers/doctors.js')

router.post("/signup", signup);

router.post("/signin", signin);

router.get('/getDoctor',isDoctorAuthenticated,getDoctor)

router.post("/createMedExp/:doctorId", createMedExp)

router.get("/patients", isDoctorAuthenticated, getDoctorPatients)

router.get("/patient/:patientId", getOnePatient)

router.put("/updateProfile",isDoctorAuthenticated,updateDoctors)

router.post("/verify/:doctorId",verifydoctor)


module.exports = router    