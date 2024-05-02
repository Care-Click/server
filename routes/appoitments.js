const express = require('express');
const router = express.Router();
const {addAppointment,getAppointements } = require('../controllers/appointments.js')
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')

router.post("/addAppointement/:doctorId",addAppointment);

router.get("/getAppointements/:doctorId",getAppointements)

module.exports = router    