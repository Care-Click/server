const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");
const { upload } = require("../helper/helperFunction.js");

const signup = async (req, res) => {

  let {
    FullName,
    email,
    password,
    gender,
    location,
    phone_number,
    date_of_birth,
    speciality
  } = req.body;
  date_of_birth = new Date(date_of_birth);
  date_of_birth = date_of_birth.toISOString();
  try {

    const checkemail = await prisma.doctor.findUnique({
      where: { email: email }
    });

    if (checkemail) {
      return res.status(400).json("account exist ");
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    if (!req.files || !req.files[0].buffer) {
      return res
        .status(400)
        .json("Image buffer is missing from request");
    }

    const imageBuffer = req.files[0].buffer;

    const imageUrl = await upload(imageBuffer);

    const newDoctor = {
      FullName,
      email,
      password: hashedPassword,
      date_of_birth,
      phone_number,
      gender,
      location,
      role: "doctor",
      verified: true,
      status: true,
      profile_picture: imageUrl,
      speciality
    };

    let result = await prisma.doctor.create({ data: newDoctor });

    res.status(200).send(result);
  } catch (error) {
    res.status(401).send(error);
    console.log(error);
  }
};

const signin = async (req, res) => {

  const { email, password ,patientId} = req.body;

  if (!email || !password) {
    return res.status(404).json("Email or Password should be provided");
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        email: email,
      },
    });
    if (!doctor) {
      return res.status(404).json("doctor not found");
    }

    const cofirmPassword = await bcrypt.compare(password, doctor.password);

    if (!cofirmPassword) {
      return res.status(401).json("Password is incorrect.");
    }

    const token = jwt.sign(
      {
        doctorId: doctor.id,
        role: doctor.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    let loggedUser = {
      id: doctor.id,
      FullName: doctor.FullName,
    };

    res.status(200).json({ loggedUser, token, message: "Login succeeded" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
// creating the doctor  medical experience
const createMedExp = async (req, res) => {
  let { bio, medical_id } = req.body;

  const {doctorId} = req.params;
  const parsedId= JSON.parse(doctorId)

  const card = req.files[0].buffer;

  const image = await upload(card);

  try {
    let medicalExp = await prisma.medicalExp.create({
      data: {
        id_card: image,
        bio,
        doctor_id: parsedId,
        medical_id,
      },
    });
    res.status(201).send(medicalExp);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// getting the  patiens that the  doctor had consulted

const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.doctorId
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
      include: {
        patients: true,
      },
    });
    res.status(200).json(doctor.patients);
  } catch (err) {
    res.status(404).send(" not found");
  }
};
// getting the patient  medical and personel  detail for the doctor
const getOnePatient = async (req, res) => {
  let { patientId } = req.params;

  try {
    const patientWithMedicalInfo = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
      include: { medicalInfo: true },
    });

    res.status(200).json(patientWithMedicalInfo);
  } catch (error) {
    res.status(404).send(error);
  }
};
module.exports = {
  signup,
  signin,
  getDoctorPatients,
  createMedExp,
  getOnePatient,
};
