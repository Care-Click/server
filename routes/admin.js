const express = require('express');
const router = express.Router();

const {allPatients,allDoctors,getAllDoctors,getAllPatients,getonePatient,getOneDoctor,totalbySpeciality,searchbyNameSpeaciality,getAllDoctorsNotVerified,verifyDoctor,signin}=require("../controllers/admin")

router.get("/totalPatients",allPatients)
router.get("/totalDoctors",allDoctors)
router.get("/getallPatients",getAllPatients)
router.get("/getallDoctors",getAllDoctors)
router.get("/getonePatient/:id",getonePatient)
router.get("/getoneDoctor/:id",getOneDoctor)
router.get("/totalbySpeciality",totalbySpeciality)
router.get("/srachbyNameSpeciality",searchbyNameSpeaciality)
router.get("/notVerifiedDoctor",getAllDoctorsNotVerified)
router.put("/verifyDoctor/:id",verifyDoctor)
router.post("/signin",signin)


module.exports=router