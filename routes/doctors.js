const express = require('express');
const router = express.Router();
const { signup, getOne, signin, getAllPatient,getPatientsToDoctor, updatePatientMed, search, handleReq, createMedExp,getRequests } = require('../controllers/doctors.js')

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createMedExp/:doctor_id", createMedExp)
router.get("/getAllPatient", getAllPatient)
router.get("/:doctorId/patients",getPatientsToDoctor )
router.get("/getOnePatient/:id", getOne)
router.get('/requests/:doctorId',getRequests)
router.put('/requests/:requestId',handleReq)

router.put("/repport/:id", updatePatientMed)
router.get("/search/:searched", search);

module.exports = router    