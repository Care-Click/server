const express = require('express');
const router = express.Router();
const { signup, getOne, signin, getAllPatient, updatePatientMed, search, sendReq, createMedExp } = require('../controllers/doctors.js')

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createMedExp/:doctor_id", createMedExp)
router.get("/getAllPatient", getAllPatient)
router.get("/getOnePatient/:id", getOne)

router.put("/repport/:id", updatePatientMed)
router.get("/search/:searched", search);
router.post("/sendRequest", sendReq);
module.exports = router    