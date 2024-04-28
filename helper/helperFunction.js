
const cloudinary = require("../utils/cloudinary");
const { Readable } = require("stream");

const rundomNumber =  () => {
    const rundom = ""+ Math.floor(1000 + Math.random() * 9000);
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
    }
    return sortedDoctors.slice(0, count);
    }
  

  
  
  
  
  

module.exports = { upload, rundomNumber,findNearestDoctors };

