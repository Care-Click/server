const express = require("express");
const router = express.Router();

const {
  sendReq,
  getRequests,
  createReport,
  accepteRequest,
  automateFill
} = require("../controllers/requests");


router.post("/createRepport/:request", createReport);

router.get("/accepteRequest/:requestId/:token", accepteRequest);

router.get("/requests/:token", getRequests);

router.post("/emergencyRequest/:id", sendReq);

router.post("/raport/:id/:token", createReport);


router.post("/raport/:patientId", automateFill);

module.exports = router;
