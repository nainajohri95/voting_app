const express = require("express");
const router = express.Router();
const User = request("../models/user.js");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

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

//Login
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

// GET API to get person acc to its  worktype
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (workType == "chef" || workType == "manager" || workType == "waiter") {
      const response = await Person.find({ work: workType });
      console.log("response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid work type" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//GET mehtod to get the person
router.get("/", async (req, res) => {
  try {
    const data = await Person.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id; //Extract the id from the URL parameter
    const updatedPersonData = req.body; //Updated data for the person
    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, //Return the updated document
        runValidators: true, // Run Mongoose Validation
      }
    );
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

router.delete("/:id", async (res, req) => {
  try {
    const personId = req.params.id;

    const response = await Person.findByIdAndRemove(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log("data deleted");
    res.status(200).json({ message: "Person Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

module.exports = router;
