const { log } = require("console");
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
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  }
  


  function findNearestUsers(doctors, yourLat, yourLon, count = 3) {
    const sortedDoctors = [];
    for (const doctor of doctors) {
        let location=JSON.parse(doctor.location)
        console.log(location);
        const distance = calculateDistance(location.latitude, location.longitude, yourLat, yourLon);
        sortedDoctors.push({ ...doctor, distance });
    }
        sortedDoctors.sort((a, b) => a.distance - b.distance);
    return sortedDoctors.slice(0, count);

    }
  

  
  
  
  
  

module.exports = { upload, rundomNumber,findNearestUsers };

