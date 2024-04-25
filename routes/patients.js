const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  signup,
  signin,
  getAllDoctors,
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

router.get("/getNearByDoctors", getNear);

router.get("/getAllDoctors",getAllDoctors);

router.get("/getOneDoctor/:id", getOneDoctor);

router.get("/getMedicalInfo/:id",getMedicalInfo) 

router.get("/search/:speciality", search);

router.post("/updateProfile/:id", updateProfile);

router.get("/getPatientDoctors/:patientId", getPatientDoctors);

router.get("/getPatientRequests/:patientId", getPatientRequests);

module.exports = router;
