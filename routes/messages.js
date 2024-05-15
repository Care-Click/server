const express = require("express");
const router = express.Router();
const {sendMessage} = require("../controllers/messages.js")
const isPatientAuthenticated=require("../middlewares/isPatientAuthenticated")
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')

router.post("/", sendMessage);


module.exports = router 