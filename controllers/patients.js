const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  rundomNumber,
  findNearestUsers,
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
    if (newPatient.Gender === "female") {
      newPatient.profile_picture =
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-s3t28RdEh3CJTtyc5ixDrT1oRDoHGPENQQrhnz1kev-OO4tq";
    } else {
      newPatient.profile_picture =
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRdQFCKS5R8Bt__gS9jeUmL2caFy32kcxLkNNsQQXd1c6HV0lrv";
    }
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
    let result = await prisma.doctor.findMany();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: " not found." });
  }
};

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
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({ ...doctor, ...medexp });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNear = async (req, res) => {
  try {
    let result = await prisma.doctor.findMany();
    console.log(result);
    let docNear = findNearestUsers(
      result,
      35.81381620633338,
      10.6001874506261,
      (count = 3)
    );
    console.log(docNear);
    res.send(docNear);
  } catch (error) {
    console.log(error);
  }
}
const search = async (req, res) => {
  try {
    const { specialty } = req.params;
    console.log(specialty);
    const doctors = await prisma.doctor.findMany({
      where: {
        MedicalExp: {
          speciality: { contains: specialty },
        },
      }, //include : {MedicalExp : true},
    });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ error: " not found" });
    }

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
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
      const hashedPassword = bcrypt.hashSync(password, 8);
      dataToUpdate.password = hashedPassword;
    }
    if (phone_number) dataToUpdate.phone_number = phone_number;
    if (location) dataToUpdate.location = location;

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
    console.log(error);
    res.status(500).json(error);
  }
};

const getMedicalInfo = async (req, res) => {
  try {
    let { id } = req.params
    const medicalInfo = await prisma.medicalInfo.findUnique({
      where: {
        patientId: parseInt(id)
      }
    })
    res.status(201).send(medicalInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

}


module.exports = {
  signup,
  signin,
  getAllDoctors,
  getOneDoctor,
  search,
  getNear,
  updateProfile,
  getMedicalInfo,
};
