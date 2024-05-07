const prisma = require("./prisma");
const doctors = require("../data/doctors.json");
const doctorsmedinfos = require("../data/doctorsmedinfo.json");
const patients = require("../data/patiens.json");
const patientsMedInfos = require("../data/patientsMedInfo.json");
const requests=require("../data/requests.json")
const appoitments=require("../data/appoitment.json")
const messages =require ("../data/messages.json")
const seed = async () => {
  await prisma.doctor
    .createMany({ data: doctors, skipDuplicates: true })
    .then((response) => {
      console.log("doctors seeded  ", response);
    });

  await prisma.patient
    .createMany({ data: patients, skipDuplicates: true })
    .then((response) => {
      console.log("patients seeded  ", response);
    });

  await prisma.medicalExp
    .createMany({ data: doctorsmedinfos, skipDuplicates: true })
    .then((response) => {
      console.log("doctorsmedinfos seeded  ", response);
    });

  await prisma.medicalInfo
    .createMany({ data: patientsMedInfos, skipDuplicates: true })
    .then((response) => {
      console.log("patientsMedInfos seeded  ", response);
    });
    await prisma.appointment.createMany({ data: appoitments, skipDuplicates: true })
    .then((response) => {
      console.log("patientsMedInfos seeded  ", response);
    });
    await prisma.request
    .createMany({ data: requests, skipDuplicates: true })
    .then((response) => {
      console.log("patientsMedInfos seeded  ", response);
    });
  //   await prisma.message.createMany({
  //     data: messages,
  //     skipDuplicates: true 
  //   }).then((response) => {

  //   console.log("Messages seeded: ", response);
  // })

  console.log("All data Seeded  successfully");
  await prisma.$disconnect();
};
seed().catch((error) => {
  console.error("Error seeding database:", error);
});
