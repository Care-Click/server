const express = require('express');
const router = express.Router();

const { signup, signin, getAllPatient, createMedExp ,getPatientsToDoctor} = require('../controllers/doctors.js')



router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createMedExp/:doctor_id", createMedExp)
router.get("/getAllPatient", getAllPatient)
router.get("/:doctorId/patients",getPatientsToDoctor )

module.exports = router    