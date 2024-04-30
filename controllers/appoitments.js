const prisma = require("../db/prisma");
const addAppoitement = async (req, res) => {
  try {
   
    res.status(201).json(request);

  } catch (error) {
    console.log(error);
    res.status(401).json(error);

  }
};

const getAppoitements = async (req, res) => {
  try {
   
    res.status(201).json(request);

  } catch (error) {
    console.log(error);
    res.status(401).json(error);

  }
};

/////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  addAppoitement,getAppoitements 

};
