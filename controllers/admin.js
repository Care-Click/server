const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const allPatients =  async (req,res) =>{
    try {
        const result =  await prisma.patient.count()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const allDoctors = async (req,res)=>{

    try {
        const result = await prisma.doctor.count()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }

}



const getAllDoctors = async (req,res)=>{
    try{
        const result = await prisma.doctor.findMany({
            where : {
                verified : true
            }
        })
        res.status(200).json(result)
    } catch(error){
        res.status(500).json(error)
    }
}

const getAllDoctorsNotVerified = async (req,res)=>{
    try{
        const result = await prisma.doctor.findMany({
            where : {
                verified : false
            }
        })
        res.status(200).json(result)
    } catch(error){
        res.status(500).json(error)
    }
}

const getAllPatients = async (req,res)=>{
    
    try {
        
        const result = await prisma.patient.findMany()

    res.status(200).json(result)

    } catch (error) {
        res.status(500).json(error)
    }
    
}

const getonePatient = async (req,res)=>{
    let {id}=req.params
try {
    const result = await prisma.patient.findUnique({
        where : {id:parseInt(id)},
        include : {doctors:true}
    })
    res.status(200).json(result)
} catch (error) {
    
    res.status(500).json(error)
}
    
}

const getOneDoctor = async (req,res)=>{
    let {id}=req.params 
    try {
        const result = await prisma.doctor.findUnique({
            where :  {id:parseInt(id)},
             include : {patients:true ,MedicalExp:true}
        })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}


 const totalbySpeciality = async (req,res)=>{
try {
    const result = await prisma.doctor.groupBy({
        by : ["speciality"] ,
        _count:true
    })
    res.status(200).json(result)
} catch (error) {
    console.log(error)
   res.status(500).json(error) 
}

 }

 const searchbyNameSpeaciality = async(req,res)=>{
   const {FullName}=req.body
   const {speciality}=req.body
  
    try {

        if(FullName&&speciality){
            
            const result = await prisma.doctor.findMany({
                where : {FullName:FullName,speciality:speciality}
            })

            res.status(200).json(result)
            return 
        }
        

       else if(FullName) {
            const result = await prisma.doctor.findMany({
                where : {FullName:FullName}
            })
            res.status(200).json(result)
            
        }
        
        else if (speciality){
            const result = await prisma.doctor.findMany({
                where: {
                   
                    speciality : { contains: speciality },
                    
                  },
                  
            })
            
            res.status(200).json(result)
  
        }
        else if(!speciality&&!FullName){
            const result = await prisma.doctor.findMany()
            res.status(200).json(result)
        }    
    } catch (error) {
        console.log(error)
       res.status(500).json(error) 
    }
 }

 const verifyDoctor = async(req,res)=>{
   const  {id} = req.params
    try {
        const result = await prisma.doctor.update({
       where : {id:parseInt(id)},
      data :{verified:true}
        })
        res.status(203).json(result)
    } catch (error) {
        res.status(400).json(error)
        console.log(error)
    }
 }


 const signin = async (req, res) => {

    const { email, password ,patientId} = req.body;
  
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

    if(doctor.role !== "admin"){
    return res.status(500).json("this is not an admin account please sign in with an admin account ")
    }
  
      let loggedUser = {
        id: doctor.id,
        FullName: doctor.FullName,

      };
  
      res.status(200).json({ loggedUser, token, message: "Login succeeded" });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
 
    }
}

module.exports={
allPatients,
allDoctors,
getAllPatients,
getAllDoctors,
getonePatient,
getOneDoctor,
totalbySpeciality,
searchbyNameSpeaciality,
getAllDoctorsNotVerified,
verifyDoctor,
signin,
}