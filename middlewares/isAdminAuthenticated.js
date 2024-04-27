const jwt = require("jsonwebtoken");

const isAdminAuthenticated = (req, res, next) => {
  
  const token = req.headers["token"];

  if (!token) {
    return res.status(403).send( "provid a token❌");
  }

  jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") {
      return res.status(401).send( "Unauthorized❌");
    }
    req.adminId = decoded.id;
    next();
  });
};

module.exports = isAdminAuthenticated;
