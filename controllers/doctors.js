const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");
const { upload } = require("../helper/helperFunction.js");
const {
  sendVerification,
  rundomNumber,
} = require("../helper/helperFunction.js");
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
let verification_code=rundomNumber()
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
      status: false,
      profile_picture: imageUrl,
      speciality,
      verification_code 
    };




    let result = await prisma.doctor.create({ data: newDoctor });
    sendVerification(FullName,email,verification_code)
    res.status(200).json(result);
  } catch (error) {
    res.status(401).send(error);
    console.log(error);
  }
};

const signin = async (req, res) => {

  const { email, password, patientId } = req.body;

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
    
    if(doctor.verified === false) {
      return res.status(403).json("Sorry , you're not verified yet ")
    }
    if (doctor.verified && !doctor.subscribed ) {
      const subtoken = jwt.sign(
        {
          doctorId: doctor.id,
          role: doctor.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return res.status(405).json({mes:"You have to subscribe.",subtoken});
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

  const { doctorId } = req.params;
  const parsedId = JSON.parse(doctorId)

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

const getDoctor = async (req, res) => {
  const doctorId = req.doctorId
  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId
      },
      include: {
        MedicalExp: true
      }
    })
    res.status(201).json(doctor)
  } catch (error) {
    console.log(error);
    res.status(400).send(error)
  }
}

const updateDoctors = async (req, res) => {
  const doctorId = req.doctorId
  try {
    const location = req.body.location
    const { FullName, email, phone_number, bio, } =
      JSON.parse(req.body.data)
    // Initialize an empty object to store the fields to update
    let dataToUpdate = {};

    // Check each field and add it to the dataToUpdate object if it's provided in the request body
    if (FullName) dataToUpdate.FullName = FullName;

    if (email) dataToUpdate.email = email;

    if (phone_number)
      dataToUpdate.phone_number = phone_number;
    if (location)
      dataToUpdate.location = location;

    
    const { imageUrl } = req.body;
    // Uploading image to Cloudinary
    if (imageUrl) {

      const image = await upload(imageUrl);
      dataToUpdate.profile_picture = image;
    }

    // Update the patient with the specified fields
    await prisma.doctor.update({
      where: { id: doctorId },
      data: dataToUpdate,
    });

    let medicalExpdataToUpdate = {};
    if (bio) {
      medicalExpdataToUpdate.bio = bio
    }
    
    const { id_card } = req.body

    if (id_card) {
      const card = await upload(id_card)
      medicalExpdataToUpdate.id_card = card
    }

    await prisma.medicalExp.update({
      where: { doctor_id: doctorId },
      data: medicalExpdataToUpdate
    });

    res.status(201).json("Doctor updated");

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}


const verifydoctor = async (req, res) => {
  const doctorId =parseInt(req.params.doctorId)
  console.log(doctorId);
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (doctor.verification_code ==parseInt(req.body.code)) {

       await prisma.doctor.update({
        where: { id: doctorId },
        data: {status:true},
      });
   
      return res.status(201).json("Doctor updated");
    }
    res.status(400).json(" wrong code ");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

module.exports = {
  signup,
  signin,
  getDoctorPatients,
  createMedExp,
  getOnePatient,
  getDoctor,
  updateDoctors,
  verifydoctor
};
