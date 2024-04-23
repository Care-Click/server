const prisma = require("./prisma");
const doctors = require("../data/doctors.json");
const patients = require("../data/patiens.json");
const patientsMedInfos = require("../data/patientsMedInfo.json");
;

const Requests = require("../data/requests.json");
const Reports = require("../data/reports.json");
const doctorsmedinfos = require("../data/doctorsmedinfo.json");


async function seed() {
    for (const doctor of doctors) {
      await prisma.doctor.create({
        data: doctor,
      });
    }

    for (const patient of patients) {
      await prisma.patient.create({
        data: patient,
      });
    }
    for (const patientsMedInfo of patientsMedInfos) {
      await prisma.medicalInfo.create({
        data: patientsMedInfo,
      });
    }
    for (const medicalExp of doctorsmedinfos) {
      await prisma.medicalExp.create({
        data: medicalExp,
      });
    }
  for (const Request of Requests) {
    await prisma.request.create({
      data: Request,
    });
  }
for (const Report of Reports) {
    await prisma.report.create({
      data: Report,
    });
  }

  console.log("Seed completed successfully");
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
