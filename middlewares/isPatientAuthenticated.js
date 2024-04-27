const jwt = require("jsonwebtoken");

const isPatientAuthenticated = (req, res, next) => {
  if (!req || !req.headers) {
    return res.status(400).json({ error: 'Invalid request' });
}
  const token = req.headers["token"];
  
  if (!token) {
  
    return res.status(403).send("provid a token❌");

  }

  jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {

    if ((err) ||(decoded.role!=="patient")) {

      return res.status(401).send( "Unauthorized❌");
    }

    req.patientId = decoded.patientId;

    next();

  });
};

module.exports = isPatientAuthenticated;
