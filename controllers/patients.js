const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  rundomNumber,
  findNearestDoctors,
} = require("../helper/helperFunction.js");

const signup = async (req, res) => {
  try {
    let { password, date_of_birth } = req.body;

    date_of_birth = new Date(date_of_birth);

    date_of_birth = date_of_birth.toISOString();

    const newPatient = { ...req.body, date_of_birth };

    newPatient.verification_code = rundomNumber();

    newPatient.password = bcrypt.hashSync(password, 8);

    newPatient.role = "patient";

    newPatient.location = JSON.stringify(newPatient.location);

    let result = await prisma.patient.create({ data: newPatient });

    res.status(201).send("Patient  Registred ");
  } catch (error) {

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
      return res.status(401).json("Password is incorrect." );
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign(
      {
        patientId: patient.id,
        role:patient.role
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

    res.status(200).json({ loggedUser, token, message: "Login succeeded" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

// getting one specific  doctor 

const getOneDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
     
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json( doctor );
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNear = async (req, res) => {
  try {
    const {city,district}=req.params

    let result = await prisma.doctor.findMany();

    let docNear = findNearestDoctors( result,city, district,(count = 3));

    res.status(200).send(docNear);
  } catch (error) {
    console.log(error);
  }
};

const sendReq = async (req, res) => {
  try {

    const newrequest = {
      message: req.body.message,
      status: "pending",
      patientId: JSON.parse(req.patientId),
      doctorId: null,
    };

    const request = await prisma.request.create({

      data: newrequest,
    });
    res.status(201).json(request);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};
const search = async (req, res) => {
  try {
    const { speciality } = req.params;
    const doctors = await prisma.doctor.findMany({
      where: {
        MedicalExp: {
          speciality: { contains: speciality },
        },
      },
      include: { MedicalExp: true },
    });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ error: " not found" });
    }
    for (let i = 0; i < doctors.length; i++) {
      doctors[i].location = JSON.parse(doctors[i].location);
    }
    res.status(201).json(doctors);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { doctorId } = req.doctorId;
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
    if (phone_number) 
        dataToUpdate.phone_number = phone_number;
    if (location)     
        dataToUpdate.location = location;

    // Check if an image file is provided in the request
    if (req.files && req.files[0] && req.files[0].buffer) {
      const imageBuffer = req.files[0].buffer;

      // Uploading image to Cloudinary
      const imageUrl = await upload(imageBuffer);
      if (imageUrl) dataToUpdate.imageUrl = imageUrl;
    }

    // Update the patient with the specified fields
    const updatePatient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.status(201).send("Patient updated");

  } catch (error) {
    
    res.status(500).json(error);
  }
};

const getMedicalInfo = async (req, res) => {
  try {
    let doctorId = req.doctorId;
    const medicalInfo = await prisma.medicalInfo.findUnique({
      where: {
        patientId: doctorId,
      },
    });
    res.status(201).send(medicalInfo);
  } catch (error) {
    
    res.status(500).json(error);
  }
};

const getPatientDoctors = async (req, res) => {
  try {
    const patientId =req.patientId

    const Patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        doctors: true,
      }
    });

    res.status(200).json(Patient.doctors);

  } catch (error) {

    console.log(error);

    res.status(500).json(error);
  }
};

const getPatientRequests = async (req, res) => {
  try {

    const patientId =req.patientId;

    console.log(patientId);

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

        element.Doctor.location = JSON.parse(element.Doctor.location);
      }

    }

    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
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
  getMedicalInfo,
  getPatientDoctors,
  getPatientRequests,
};
