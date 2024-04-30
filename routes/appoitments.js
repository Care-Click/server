const express = require('express');
const router = express.Router();
const {addAppoitement,getAppoitements } = require('../controllers/appoitments.js')

router.post("/addAppoitement", addAppoitement);

router.get("/getAppoitements/:doctorId", getAppoitements)

module.exports = router    