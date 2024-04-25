const { where } = require("sequelize");
const prisma = require("../db/prisma");
const jwt = require("jsonwebtoken");
const createReport = async (req, res) => {
  const { request } = req.params;
  const {
    Familial_Medical_History,
    Imaging_test_results,
    Allergies,
    PastIllness,
    Surgeries,
    Medications,
    Chronic_Illness,
  } = req.body;

  try {
    const result = await prisma.report.create({
      data: {
        request: { connect: { id: parseInt(request) } },
        Familial_Medical_History: Familial_Medical_History,
        Allergies: Allergies,
        PastIllness: PastIllness,
        Surgeries: Surgeries,
        Medications: Medications,
        Chronic_Illness: Chronic_Illness,
        Imaging_test_results: Imaging_test_results,
      },
    });

    res.status(201).send(result);
  } catch (error) {
    res.send(error);
  }
};

const accepteRequest = async (req, res) => {
  try {
    const decodedToken = jwt.decode(req.params.token);
    const doctorId = decodedToken.userId;
    const result = await prisma.request.update({
      where: { id: parseInt(req.params.requestId) },
      data: {
        doctorId: parseInt(doctorId),
        status: "Accepted",
      },
    });
    console.log(result);

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
const getRequests = async (req, res) => {
  try {
    const decodedToken = jwt.decode(req.params.token);
    const doctorId = decodedToken.userId;
    const pendingRequests = await prisma.request.findMany({
      include: {
        Patient: {
          select: {
            FullName: true,
            phone_number: true,
          },
        },
      },
    });
    const reversed = pendingRequests.reverse();
    res.status(200).json({ reversed, doctorId });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendReq = async (req, res) => {
  try {
    const newrequest = {
      message: req.body.message,
      status: "pending",
      patientId: JSON.parse(req.params.id),
      doctorId: null,
    };
    const request = await prisma.request.create({
      // let result = await prisma.patient.create({ data: newPatient });

      data: newrequest,
    });
    res.status(201).json(request);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

const automateFill = async (req, res) => {
  const { patientId } = req.params;
  try {
    const patientMedicalInfo = await prisma.medicalInfo.findUnique({
      where: { id: parseInt(patientId) },
    });
    console.log(patientMedicalInfo,patientId);

    console.log(patientMedicalInfo);
    
    let newMedInfo = {};

    for (let key in req.body) {

      console.log(patientMedicalInfo[key]);

      if (Array.isArray(patientMedicalInfo[key])) {

        newMedInfo[key] = [...patientMedicalInfo[key], ...req.body[key]];

      } else {
        newMedInfo[key] = req.body[key];
      }
    }

    const updatedMedicalInfo = await prisma.medicalInfo.update(
        {where :{id:patientMedicalInfo.id},
            data:newMedInfo});
console.log(updatedMedicalInfo);

    res.status(201).json(updatedMedicalInfo);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};
module.exports = {
  getRequests,
  sendReq,
  createReport,
  accepteRequest,
  automateFill,
};
