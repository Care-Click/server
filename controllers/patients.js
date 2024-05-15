const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  rundomNumber,
  findNearestDoctors,
} = require("../helper/helperFunction.js");

const {upload}=require("../helper/helperFunction.js")

const signup = async (req, res) => {
  try {
    let { password, date_of_birth } = req.body;

    date_of_birth = new Date(date_of_birth);

    date_of_birth = date_of_birth.toISOString();

    const profile_picture = await upload(req.files[0].buffer);

     const newPatient = { ...req.body, date_of_birth, profile_picture};

    newPatient.verification_code = rundomNumber();

    newPatient.password = bcrypt.hashSync(password, 8);

    newPatient.role = "patient";

    newPatient.location = JSON.stringify(newPatient.location);

    let result = await prisma.patient.create({ data: newPatient });

    res.status(201).send("Patient  Registred ");
  } catch (error) {
    console.log(error)
    res.status(401).send(error);
  }
};
const signin = async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(404).json("Email or Password should be provided");
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: {
        email: email,
      },
    });

    if (!patient) {
      return res.status(404).json("patient not found.");
    }

    const passwordMatch = await bcrypt.compare(password, patient.password);

    if (!passwordMatch) {
      return res.status(401).json("Password is incorrect.");
    }

    // Generate  jwt
    let token = jwt.sign(
      {
        patientId: patient.id,
        role: patient.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    let loggedUser = {
      id: patient.id,
      FullName: patient.FullName,
    };
    token= "Bearer "+token
    res.status(200).json({ loggedUser, token, message: "Login succeeded" });
  } catch (error) {
    console.log(error);
    console.log(error)
    res.status(500).send("Internal server error");
  }
};

// getting one specific  doctor

const getOneDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
console.log(doctor);
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNear = async (req, res) => {
  try {
    const patientId = req.patientId;
    let patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    const { place } = JSON.parse(patient.location);

    let result = await prisma.doctor.findMany();
    
    let docNear = findNearestDoctors(
      result,
      place.city,
      place.district,
      (count = 3)
    );
    res.status(200).send(docNear);
  } catch (error) {
    console.log(error);
  }
};

const search = async (req, res) => {
  try {
    const { speciality } = req.params;
    const doctors = await prisma.doctor.findMany({
      where: {
        speciality: { contains: speciality },
      },
      include: { MedicalExp: true },
    });
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ error: " not found" });
    }

    res.status(201).json(doctors);
  } catch (error) {
    console.log(error);

    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const patientId = req.patientId;
    const { FullName, date_of_birth, email, password, phone_number, location } =
      req.body;
    // Initialize an empty object to store the fields to update
    let dataToUpdate = {};

    // Check each field and add it to the dataToUpdate object if it's provided in the request body
    if (FullName) dataToUpdate.FullName = FullName;
    if (date_of_birth) {
      // Convert and format date_of_birth if provided
      const formattedDateOfBirth = new Date(date_of_birth).toISOString();
      dataToUpdate.date_of_birth = formattedDateOfBirth;
    }
    if (email) dataToUpdate.email = email;
    if (password) {
      // Hash the password if provided
      dataToUpdate.password = bcrypt.hashSync(password, 8);
    }
    if (phone_number) dataToUpdate.phone_number = phone_number;
    if (location) dataToUpdate.location = JSON.stringify(location);

    // Check if an image file is provided in the request
    if (req.files[0].buffer) {
      // Uploading image to Cloudinary
      const image = await upload(req.files[0].buffer);
      dataToUpdate.profile_picture = image;
    }

    // Update the patient with the specified fields
    const updatePatient = await prisma.patient.update({
      where: { id: patientId },
      data: dataToUpdate,
    });

    res.status(201).send("Patient updated");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getInfo = async (req, res) => {
  let  patientId  = req.patientId;

  try {
    const patientWithMedicalInfo = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { 
        medicalInfo: true,
        favoriteDoctors :{
          include:{
            doctor:true
          }
        }
       },
    });

    res.status(200).json(patientWithMedicalInfo);
  } catch (error) {
    res.status(404).send(error);
  }
};

const getPatientDoctors = async (req, res) => {
  try {
    const patientId = req.patientId;

    const Patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        doctors: true,
      },
    });

    res.status(200).json(Patient.doctors);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};

const getPatientRequests = async (req, res) => {
  try {
    const patientId = req.patientId;
    const requests = await prisma.request.findMany({
      where: {
        patientId: patientId,
      },
      include: {
        Doctor: {
          select: {
            id: true,
            FullName: true,
            location: true,
          },
        },
      },
    });

    for (let index = 0; index < requests.length; index++) {
      const element = requests[index];

      if (element.Doctor) {
        // element.Doctor.location = JSON.parse(element.Doctor.location);
      }
    }

    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addToFavorite = async (req, res) => {
  const { doctorId } = req.params;
  const patientId = req.patientId;

  try {
    // Check if the doctor is already a favorite
    const existingFavorite = await prisma.favoriteDoctor.findFirst({
      where: {
        patientId: patientId,
        doctorId: parseInt(doctorId),
      },
    });

    if (existingFavorite) {
      // If the doctor is already a favorite, remove it from favorites
      await prisma.favoriteDoctor.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      res.status(200).json({ message: "Doctor removed from favorites successfully" });
    } else {
      // If the doctor is not a favorite, add it to favorites
      const favorite = await prisma.favoriteDoctor.create({
        data: {
          patientId: patientId,
          doctorId: parseInt(doctorId),
        },
      });
      res.status(201).json({ message: "Doctor added to favorites successfully", favorite });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = {
  signup,
  signin,
  getOneDoctor,
  search,
  getNear,
  updateProfile,
  getInfo,
  getPatientDoctors,
  getPatientRequests,
  addToFavorite
};
