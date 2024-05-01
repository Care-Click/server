const express = require("express");
const router = express.Router();
const isPatientAuthenticated=require("../middlewares/isPatientAuthenticated")
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')

const {
  sendReq,
  getRequests,
  createReport,
  accepteRequest,
  automateFill
} = require("../controllers/requests");


router.post("/createRepport/:request",  createReport);

router.get("/accepteRequest/:requestId", isDoctorAuthenticated, accepteRequest);

router.get("/requests", isDoctorAuthenticated, getRequests);

router.post("/emergencyRequest",isPatientAuthenticated,sendReq);

router.post("/raport/:patientId",  automateFill);

module.exports = router;
