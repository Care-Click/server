const prisma = require("../db/prisma");



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
        const result = await prisma.doctor.findMany()
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
             include : {patients:true}
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

 


module.exports={
allPatients,
allDoctors,
getAllPatients,
getAllDoctors,
getonePatient,
getOneDoctor,
totalbySpeciality,
searchbyNameSpeaciality
}