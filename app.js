const express = require("express");
const cors = require("cors");
const multer = require("multer");
const patientRouter = require("./routes/patients");
const doctorRouter = require("./routes/doctors");

var morgan = require("morgan");
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

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
