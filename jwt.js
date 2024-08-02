const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  //Extract the jwt token from the request headers
  const token = req.headers.authorization.split(" ")[1]; //bearer token ko split kr diea with space
  if (!token) return res.status(401).json({ error: "Unauthorised" });

  try {
    //Verify the JWT token(creating auth middleware)
    const decoded = jwt.verify(token, proces.env.JWT_SECRET, { expiresIn: 30 });

    //Attach user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401)({ error: "Invalid token" });
  }
};

//function to generate JWT Token
const generateToken = (yserData) => {
  //Generate a new JWT token using data
  return jwt.sign(userData, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };
