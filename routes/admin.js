const express = require('express');
const router = express.Router();

const {allPatients,allDoctors,getAllDoctors,getAllPatients,getonePatient,getOneDoctor,totalbySpeciality,searchbyNameSpeaciality}=require("../controllers/admin")

router.get("/totalPatients",allPatients)
router.get("/totalDoctors",allDoctors)
router.get("/getallPatients",getAllPatients)
router.get("/getallDoctors",getAllDoctors)
router.get("/getonePatient/:id",getonePatient)
router.get("/getoneDoctor/:id",getOneDoctor)
router.get("/totalbySpeciality/",totalbySpeciality)
router.get("/srachbyNameSpeciality",searchbyNameSpeaciality)


module.exports=router