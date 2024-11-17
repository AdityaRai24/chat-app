import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({ msg: "Email and password is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });
    res.cookie("jwt", createToken(email, user._id), {
      secure: true,
      maxAge,
      sameSite: "none",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({ msg: "Email and password is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ msg: "Invalid password." });
    }
    res.cookie("jwt", createToken(email, user._id), {
      secure: true,
      maxAge,
      sameSite: "none",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User with the given id not found...");
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profilePic: userData.profilePic,
      profileSetup: userData.profileSetup,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, profilePic } = req.body;

    if (!firstName || !lastName || !profilePic) {
      return res.status(500).json({ msg: "All the fields are required" });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        profilePic,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profilePic: userData.profilePic,
      profileSetup: userData.profileSetup,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true ,sameSite: "None"});
    res.status(200).send("Logout successfull");
  } catch (error) {
    res.status(500).send("Error logging out");
  }
};
