const express = require('express');
const router = express.Router();
const { signup, signin, getAllPatient, updatePatientMed, search, handleReq, createMedExp,getRequests } = require('../controllers/doctors.js')

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createMedExp/:doctor_id", createMedExp)
router.get("/getAllPatient", getAllPatient)
router.put("/repport/:id", updatePatientMed)
router.get("/search/:searched", search);

module.exports = router    