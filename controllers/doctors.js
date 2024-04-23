const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require("../db/prisma");
const { PrismaClient } = require('@prisma/client');
const { upload } = require("../helper/helperFunction.js");



const signup = async (req, res) => {
  let { password, date_of_birth, FullName, email, phone_number, gender, location } = req.body;
  date_of_birth = new Date(date_of_birth);
  date_of_birth = date_of_birth.toISOString();
  try {
    //checking if the email is already in use
    const checkemail = await prisma.doctor.findUnique({ where: { email: email } });
    if (checkemail) {
      return res.status(400).json({ error: "existing account  " });
    }
    // Hashing the password
    const hashedPassword = bcrypt.hashSync(password, 8);
    // Check if req.files is defined and contains the file buffer
    if (!req.files || !req.files[0].buffer) {
      return res.status(400).json({ error: "Image buffer is missing from request" });
    }

    // Assuming req.files contains the image buffer, adjust this accordingly based on your setup
    const imageBuffer = req.files[0].buffer;

    // Uploading image to Cloudinary
    const imageUrl = await upload(imageBuffer);

    const newDoctor = {
      FullName,
      email,
      password: hashedPassword,
      date_of_birth,
      phone_number,
      gender,
      location,
      role: 'doctor', // Assuming doctor signup
      verified: true, // Verifie from the admin
      status: true,
      profile_picture: imageUrl
    };

    // Save doctor data to the database
    let result = await prisma.doctor.create({ data: newDoctor });

    res.status(200).send(result);
  } catch (error) {
    res.status(401).send(error);
    console.log(error);
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ error: "Email or Password not found." });
  }

  try {
    // Retrieve doctor from the database by email
    const doctor = await prisma.doctor.findUnique({
      where: {
        email: email
      }
    });

    // Check if doctor exists
    if (!doctor) {
      return res.status(404).json({ error: "User not found." });
    }

    // Checking if the password is valid
    const passwordMatch = await bcrypt.compare(password, doctor.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Password is incorrect." });
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign(
      {
        userId: doctor.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    let loggedUser = {
      id: doctor.id,
      FullName: doctor.FullName
    };

    res.status(200).json({ loggedUser, token, message: "Login succeeded" });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).send("Internal server error");
  }
};

const createMedExp = async (req, res) => {
  let { speciality, bio, medical_id } = req.body
  var { doctor_id } = req.params
  doctor_id = JSON.parse(doctor_id)
  const card = req.files[0].buffer
  const image = await upload(card);
  try {
    let medicalExp = await prisma.medicalExp.create({
      data: {
        speciality,
        id_card: image,
        bio,
        doctor_id,
        medical_id
      }
    })
    res.status(201).send("Medical Experience Added Succesfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

const getOne = async (req, res) => { };

const sendReq = async (req, res) => { };

const search = async (req, res) => { };

const updatePatientMed = async (req, res) => { };


const getAllPatient = async (req, res) => {
  try {
    let result = await prisma.patient.findMany()
    console.log(result);
    res.status(200).json(result)
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: " not found." })
  }
};

module.exports = {
  signup,
  getOne,
  signin,
  getAllPatient,
  updatePatientMed,
  search,
  sendReq,
  createMedExp,
};
