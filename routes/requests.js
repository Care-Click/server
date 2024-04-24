const express = require('express');
const router = express.Router();
const {getRequests,
    createReport,
    accepteRequest
  } = require("../controllers/requests");
router.post("/createRepport/:request",createReport);
router.get("/accepteRequest/:requestId/:token",accepteRequest);
router.get('/requests/:token',getRequests)



module.exports = router    