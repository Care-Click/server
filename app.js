const express = require("express");
const cors = require("cors");
const multer = require("multer");
var morgan = require("morgan");

const patientRouter = require("./routes/patients");
const doctorRouter = require("./routes/doctors");
const requestRouter = require("./routes/requests");
const messageRouter = require ("./routes/messages");

const app = express();
const upload = multer();

const port = 3000;

app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/patients", patientRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/requests", requestRouter);
app.use("/api/messages", messageRouter);

app.listen(3000, () => {
  console.log(`app listening on port ${port}`);
});
