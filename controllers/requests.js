
const prisma = require("../db/prisma");
const jwt = require("jsonwebtoken");
const { sendemail } = require("../helper/helperFunction");


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
   
      const newPatients = [...doctor.patients, patient];
      var docpat = await prisma.doctor.update({
        where: {
          id: parseInt(doctorId),
        },
        data: {
          patients: {
            set: newPatients,
          },
        },
      });
      const conversation = await prisma.conversation.create({
        data: {
          doctorId,
          patientId: result.patientId,
        },
      });

    res.status(200).send({ conversation });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
const getRequests = async (req, res) => {

  try {
    let doctorId = req.doctorId
    const Requests = await prisma.request.findMany({
      where: {
        OR: [
          { status: "Pending" },
          { doctorId: doctorId },
        ],
      },
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
  const patientId=req.patientId
  try {

const patient = await prisma.patient.findUnique({
  where : {id:patientId}
})

 const name = patient.FullName

    const newrequest = {
      message: req.body.message,
      status: "Pending",
      patientId: patientId,
      doctorId: null,
    };
    if (req.params.doctorId) {
      newrequest.doctorId = doctorId;
    }
    const request = await prisma.request.create({
      data: newrequest,
    });
    sendemail(req.body.message,name)
  



    res.status(201).json(request);

  } catch (error) {
    console.log(error);
    res.status(401).json(error);

  }
};

const automateFill = async (req, res) => {

  const { patientId } = req.params;
  let  newreport = req.body;
  try {
    let newMedInfo = {};

    const patientMedicalInfo = await prisma.medicalInfo.findUnique({
      where: { patientId: parseInt(patientId) },
    });
    if (!patientMedicalInfo) {
      newreport.patientId = parseInt(patientId)
      
      patientMedicalInfo = await prisma.medicalInfo.create(
        {
          data:newreport
        }
      );
    } else {
      for (let key in newreport) {  
          newMedInfo[key] = [...patientMedicalInfo[key], ...newreport[key]];
      }
      
      const updatedMedicalInfo = await prisma.medicalInfo.update({
        where: { patientId: parseInt(patientId) },
        data: newMedInfo,
      });
      res.status(201).json(updatedMedicalInfo);

    }


  } catch (error) {
    console.log(error);
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
