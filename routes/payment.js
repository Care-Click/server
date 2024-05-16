const express = require("express");
const router = express.Router();
const isDoctorAuthenticated=require('../middlewares/isDoctorAuthenticated.js')


const {
   add,verifypayment
  } = require("../controllers/payment");

  router.post("/", add);
  router.get ("/:id",isDoctorAuthenticated,verifypayment)
  
  
module.exports = router;