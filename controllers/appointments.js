const prisma = require("../db/prisma");

const addAppointment = async (req, res) => {
;

  const doctorId  = parseInt(req.params.doctorId);

  const app = { ...req.body,doctorId };

  try {
    const newApp = await prisma.appointment.create({
      data: app,
    });
    res.status(201).json(newApp);
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({
          error: "Appointment already exists for this date and doctor.",
        });
    }
    console.log(error);
    
    res.status(500).json({ error: "Error creating appointment." });
  }
};

const getAppointements = async (req, res) => {

  const doctorId = req.params.doctorId;

  try {
    const appoitments = await prisma.appointment.findMany({
      where: {
        doctorId: parseInt(doctorId),
      },
    });
    res.status(201).json(appoitments);
  } catch (error) {
    
    res.status(401).json(error);
  }
};

/////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  addAppointment,
  getAppointements,
};
