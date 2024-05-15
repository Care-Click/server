const express = require('express');
const router = express.Router();
const {addAppointment,getAppointements ,getPatientAppointements} = require('../controllers/appointments.js')
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')
const isPatientAuthenticated=require('../middlewares/isPatientAuthenticated.js')

router.post("/addAppointement/:doctorId",addAppointment);

router.get("/getAppointements/:doctorId",getAppointements)
router.get("/getPatientAppointements",isPatientAuthenticated,getPatientAppointements)

module.exports = router    