const express = require('express');
const router = express.Router();
const {addAppointment,getAppointements } = require('../controllers/appointments.js')
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')

router.post("/addAppointement", isDoctorAuthenticated,addAppointment);

router.get("/getAppointements", isDoctorAuthenticated,getAppointements)

module.exports = router    