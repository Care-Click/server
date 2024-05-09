const express = require("express");
const router = express.Router();


const {
   add,verifypayment
  } = require("../controllers/payment");

  router.post("/", add);
  router.post ("/:id",verifypayment)
  
  
module.exports = router;