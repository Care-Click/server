const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  signup,
  signin,
  getAllDoctors,
  getOneDoctor,
  sendReq,
  search,
  getNear,
  updateProfile
} = require("../controllers/patients");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getNearByDoctors", getNear);
router.get("/getAllDoctors",getAllDoctors);
router.get("/getOneDoctor/:id", getOneDoctor);
router.get("/search/:searched", search);
router.post("/emergencyRequest", sendReq);
router.post("/updateProfile", updateProfile);

module.exports = router;
