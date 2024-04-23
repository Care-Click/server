const prisma = require("../db/prisma");
const signup = async (req, res) => {

};

const signin = async (req, res) => {};

const getOne = async (req, res) => {};

const sendReq = async (req, res) => {};

const search = async (req, res) => {};

const updatePatientMed = async (req, res) => {};

const getAllPatient = async (req, res) => {
  let result= await prisma.medicalExp.findMany()
  console.log(result);
};

module.exports = {
  signup,
  getOne,
  signin,
  getAllPatient,
  updatePatientMed,
  search,
  sendReq,
};
