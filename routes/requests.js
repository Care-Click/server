const express = require('express');
const router = express.Router();
const {sendReq}  = require ("../controllers/patients")

router.post("/emergencyRequest/:id", sendReq);

module.exports = router    