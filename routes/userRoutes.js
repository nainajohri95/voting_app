const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//POST API to signup
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //Assuming the request body contains the person data

    //create a new Person document using the Mongoose model
    const newUser = new User(data);

    //save the new person to the database
    const response = await newUser.save();
    console.log("data saved");

    const payload = {
      id: response.id,
    };

    console.log(JSON.stringify(payload));
    const token = generateToken(response.username);

    console.log("Token is:", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//POST API to Login
router.post("/login", async (req, res) => {
  try {
    //Extract aadharCardNumber and password
    const { aadharCardNumber, password } = req.body;

    //Find the user by aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    //If user does not exist or aadharCardNumber does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username and password" });
    }

    //Generate Token
    const payload = {
      id: response.id,
    };

    const token = generateToken(payload);

    //return token as response
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json(500).json({ error: "Internal server error" });
  }
});

//GET API TO get the profile
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = await req.user;
    const userId = userData.id;
    const user = await User.findiById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PUT API so that user can change the password
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user; //Extract the id from the token
    const { currentPassword, newPassword } = req.body; //Extract current and new password from request body

    //Find the user by userID
    const user = await User.findById(userId);

    //If password does not match , return error
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid ysername or password" });
    }

    //Update the user's password
    user.password = newPassword;
    await user.save();

    console.log("Password Updated");
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
