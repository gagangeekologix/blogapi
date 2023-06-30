const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const generateData = require("../component/result");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created ${user}`);
  if (user) {
    const jsonData = generateData(201,1,"Register successfully!","No Error, All good !",{ _id: user.id, email: user.email });
    res.status(201).json(jsonData);
    // res.status(201).json({ _id: user.id, email: user.email });
  } else {
    // res.status(400);
    const jsonData = generateData(201,1,"Enter Valid Data","User data us not valid");
    res.status(400).json(jsonData);
    throw new Error("User data us not valid");
  }
  res.json({ message: "Register the user" });
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // console.log(" login ")
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "25m" }
    );
    console.log({accessToken})
    // res.status(200).json({ accessToken });
    const jsonData = generateData(200,1,"Login successfully!","error",{ accessToken });
    res.status(200).json(jsonData);
    // console.log(jsonData)
  } else {
    // res.status(401);
    const jsonData = generateData(401,0,"Email or password is not valid","error");
    res.status(401).json(jsonData);
    throw new Error("email or password is not valid");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  const jsonData = generateData(200,1,"Current user details","no error",req.user);
  res.status(200).json(jsonData);
  // res.json(req.user);
});


const change_pass = asyncHandler( async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    if (!username || !currentPassword || !newPassword) {
      // res.status(400);
      const jsonData = generateData(400,0,"Enter All Data","All fields are mandatory!");
      res.status(400).json(jsonData);
      throw new Error("All fields are mandatory!");
    }
    // Retrieve the user from the database
    const user = await User.findOne({ username });

    if (!user) {
      const jsonData = generateData(404,0,"User Not Found");
      return res.status(404).json(jsonData);
    }

    // Compare the provided current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      const jsonData = generateData(401,0,"Invalid current password");

      return res.status(401).json(jsonData);
    }
    console.log(newPassword)
    // Generate a new password hash
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    console.log(newPasswordHash)
    // Save the new password hash to the user in the database
    user.password = newPasswordHash;
    console.log(user.password)
    await user.save();
    const jsonData = generateData(200,1,"Password changed successfully");
    res.status(200).json(jsonData);
    // res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    const jsonData = generateData(500,0,"Internal server error");
    res.status(500).json(jsonData);
  }
});


module.exports = {change_pass, registerUser, loginUser, currentUser };
