const prisma = require("../db/prisma");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const signup = async (req, res) => {
  try {
    let { password, date_of_birth } = req.body;
    date_of_birth = new Date(date_of_birth);
    date_of_birth = date_of_birth.toISOString();
    const newPatient = { ...req.body, date_of_birth };

    newPatient.password = bcrypt.hashSync(password, 8);

    let result = await prisma.patient.create({ data: newPatient });

    res.status(201).send("Patient  Registred ");
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
};
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ error: "Email or Password not found." });
  }

  try {
    // Retrieve doctor from the database by email
    const doctor = await prisma.patient.findUnique({
      where: {
        email: email,
      },
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
      FullName: doctor.FullName,
    };

    res.status(200).json({ loggedUser, token, message: "Login succeeded" });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).send("Internal server error");
  }
};

const getAllDoctors = async (req, res) => {
  try {
    let result = await prisma.doctor.findMany()
    console.log(result);
    res.status(200).json(result)
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: " not found." })
  }
}

const getOneDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const medexp = await prisma.medicalExp.findUnique({
      where: { doctor_id: parseInt(id) },

    });
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },

    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({...doctor,...medexp});
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendReq = async (req, res) => {

};
const search = async (req, res) => {

};
const updateProfile = async (req, res) => {};
const getNear = async (req, res) => {};

module.exports = {
  signup,
  signin,
  getAllDoctors,
  getOneDoctor,
  sendReq,
  search,
  getNear,
  updateProfile,
};

