const express = require("express");
const router = express.Router();
const isPatientAuthenticated=require("../middlewares/isPatientAuthenticated")
const {
  signup,
  signin,
  getOneDoctor,
  search,
  getNear,
  updateProfile,
  getMedicalInfo,
  getPatientDoctors,
  getPatientRequests
} = require("../controllers/patients");

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/getNearByDoctors/:city/:district", getNear);

router.get("/getOneDoctor/:id",  getOneDoctor);

router.get("/getMedicalInfo/:id", getMedicalInfo) 

router.get("/search/:speciality",search);

router.put("/updateProfile/:patientId",updateProfile);

router.get("/getPatientDoctors",getPatientDoctors);

router.get("/getPatientRequests/:patientId",getPatientRequests);

module.exports = router;
