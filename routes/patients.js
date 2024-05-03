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
  getInfo,
  getPatientDoctors,
  getPatientRequests
} = require("../controllers/patients");

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/getNearByDoctors",isPatientAuthenticated, getNear);

router.get("/getOneDoctor/:doctorId",isPatientAuthenticated,getOneDoctor);

router.get("/getInfo",isPatientAuthenticated, getInfo) 

router.get("/search/:speciality",isPatientAuthenticated,search);

router.put("/updateProfile",isPatientAuthenticated,updateProfile);

router.get("/getPatientDoctors",isPatientAuthenticated,getPatientDoctors);

router.get("/getPatientRequests",isPatientAuthenticated,getPatientRequests);

module.exports = router;
