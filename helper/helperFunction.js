
const cloudinary = require("../utils/cloudinary");
const { Readable } = require("stream");
const prisma = require("../db/prisma");
const nodemailer = require("nodemailer");
const { send } = require("process");

const rundomNumber =  () => {
    const rundom = Math.floor(1000 + Math.random() * 9000);
    return rundom;
};
const upload = async (buffer) => {
    const imageStream = Readable.from(buffer);
    const cloudinaryResult = await new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        imageStream.pipe(upload_stream);
    });
    return cloudinaryResult.secure_url;
};
  


  function findNearestDoctors(doctors, city, district, count = 3) {
    const sortedDoctors = [];

    for (const doctor of doctors) {

       doctor.location=JSON.parse(doctor.location);

        if(doctor.location.place.city===city&&doctor.location.place.district===district) 
       
        sortedDoctors.push(doctor);
    };
    return sortedDoctors.slice(0, count);
    };
  const emails = ["laarifamine5569@gmail.com"]

    const sendemail =  async (message,patientName)=>{

        const transporter=nodemailer.createTransport({
            logger: true,
    debug: true,
    port: 465,
    secure: true,
            service:'Outlook365',
            auth: {
                user:  "careclick@outlook.fr",
                pass: "innoeajwluzlmkot"
              }
        })
   
        try {
             const doctor = await prisma.doctor.findMany({
                where: {
                    verified : true
                }
             })

       for (let i=0 ; i<emails.length ; i++) {
    
       
     transporter.sendMail({
            from:"careclick@outlook.fr",
            to: emails[i],
            subject:"Emergency request",
            html:
            `
            <div>
            <h1>New emergency request </h1>
              
              <p> Greetings you have a new Request from ${patientName} 
              these are the descriptions ${message}
      </p>
                
     
              </div>`
      
})
       }
       

        } catch (error) {
            console.log(error)
        }
 

    }
  
    const sendVerification =  async (FullName,email,verification_code)=>{

        const transporter=nodemailer.createTransport({
            logger: true,
            debug: true,
            port: 465,
            secure: true,
            service:'Outlook365',
            auth: {
                user:  "careclick@outlook.fr",
                pass: "innoeajwluzlmkot"
              }
         })
   
         try {
             transporter.sendMail({
            from:"careclick@outlook.fr",
            to: email,
            subject:"Email verification",
            html:
            `
            <div>
            <h1>hello ${FullName} </h1>
              <p> 
              this is your verification code : ${verification_code}
              </p>
              </div>`
      
        })      
        } catch (error) {
            console.log(error)
        }
 

    }
  
  

module.exports = { upload, rundomNumber,findNearestDoctors , sendemail,sendVerification};

