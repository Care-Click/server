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
    const doctorId = req.doctorId;
    const result = await prisma.request.update({
      where: { id: parseInt(req.params.requestId) },
      data: {
        doctorId: doctorId,
        status: "Accepted",
      },
    });

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: parseInt(doctorId),
      },
      include: {
        patients: true,
      },
    });

    const patient = await prisma.patient.findUnique({
      where: {
        id: parseInt(result.patientId),
      },
    });
    let test = true;
    for (let index = 0; index < doctor.patients.length; index++) {
      const element = doctor.patients[index];
      if (element.id === patient.id) {
        test = false;
        break;
      }
    }
    if (test) {
      const newPatients = [...doctor.patients, patient];
      const docpat = await prisma.doctor.update({
        where: {
          id: parseInt(doctorId),
        },
        data: {
          patients: {
            set: newPatients,
          },
        },
      });
    }
    res.status(200).send({ docpat });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
const getRequests = async (req, res) => {
  try {
   let doctorId=req.doctorId
    const Requests = await prisma.request.findMany({
      include: {
        Patient: {
          select: {
            FullName: true,
            phone_number: true,
            profile_picture: true,
          },
        },
      },
    });
    const reversed = Requests.reverse();
    res.status(200).send({ reversed, doctorId });
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
      patientId:req.patientId,
      doctorId: null,
    };
    if (req.params.doctorId) {
      newrequest.doctorId = doctorId;
    }
    const request = await prisma.request.create({
      data: newrequest,
    });

    res.status(201).json(request);

  } catch (error) {
    
    res.status(401).json(error);
  
  }
};

const automateFill = async (req, res) => {

  const { patientId } = req.params;

  try {
    let newMedInfo = {};

    const patientMedicalInfo = await prisma.medicalInfo.findUnique({
      where: { id: parseInt(patientId) },
    });

    for (let key in req.body) {
      if (Array.isArray(patientMedicalInfo[key])) {
        newMedInfo[key] = [...patientMedicalInfo[key], ...req.body[key]];
      } else {
        newMedInfo[key] = req.body[key];
      }
    }

    const updatedMedicalInfo = await prisma.medicalInfo.update({
      where: { id: parseInt(patientId)},
      data: newMedInfo,
    });
    
    res.status(201).json(updatedMedicalInfo);

  } catch (error) {
    res.status(401).json(error);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  getRequests,
  sendReq,
  createReport,
  accepteRequest,
  automateFill,
};
