const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const { uploadImage } = require("../helpers/cloudinary-helpers");
const fs = require("fs/promises");

const registerUser = async (req, res) => {
  try {
    const { email, password, fullName, profilePic } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
      profilePic,
    });

    // Generate Token
    generateToken(newUser._id, res);

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error on registerUser controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    // Check if password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    generateToken(user._id, res);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res
      .status(200)
      .json({ message: "Succesfully logged in.", user: userWithoutPassword });
  } catch (error) {
    console.error("Error on loginUser controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {}
};

const updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { public_id, secure_url } = await uploadImage(req.file.path);

    await fs.unlink(`src/uploads/${req.file.filename}`);

    const id = req.user._id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic: secure_url },
      { new: true, runValidators: true }
    ).select("-password");

    res
      .status(201)
      .json({ message: "Profile pic updated successfully", user: updatedUser });

    // add image to db
    const newlyAddedImage = await Image.create({
      publicId: public_id,
      url,
      createdBy: req.userInfo._id,
    });

    res
      .status(201)
      .json({ message: "image Added Successfully", image: newlyAddedImage });
  } catch (error) {
    console.log("Error on updateProfile controller");
    res.status(500).json({ message: "Internal Server Error " + error });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error on checkAuth controller");
    res.status(500).json({ message: "Internal Server Error " + error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  checkAuth,
};
