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

router.get("/getNearByDoctors/:city/:district", isPatientAuthenticated, getNear);

router.get("/getOneDoctor/:id", isPatientAuthenticated,  getOneDoctor);

router.get("/getMedicalInfo/:id", isPatientAuthenticated, getMedicalInfo) 

router.get("/search/:speciality", isPatientAuthenticated,search);

router.post("/updateProfile/:id", isPatientAuthenticated,updateProfile);

router.get("/getPatientDoctors", isPatientAuthenticated, getPatientDoctors);

router.get("/getPatientRequests", isPatientAuthenticated,getPatientRequests);

module.exports = router;
