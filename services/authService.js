const User = require("../models/User");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const jwt = require("../lib/jsonwebtoken");

const { SECRET } = require("../config");
const Courses = require("../models/Courses");
exports.register = async (userData) => {
  if (userData.password !== userData.rePassword) {
    throw new Error("Password mismatch");
  }

  const user = await User.findOne({ email: userData.email });
  if (user) {
    throw new Error("User already exist");
  }

  const createdUser = await User.create(userData);

  const token = await generateToken(createdUser);

  return token;
};

exports.login = async ({ email, password }) => {
  // Get user from dB
  const user = await User.findOne({ email });
  //Check password
  if (!user) {
    throw new Error("Email or password is invalid");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Email or password is invalid");
  }

  const token = await generateToken(user);
  // Return token

  return token;
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    if (!user) {
      return res.redirect("/");
    }

    const createdCourses = await Courses.find({ owner: req.params.id }).lean();
    const signedUpCourses = await Courses.find({
      signUpList: req.params.id,
    }).lean();

    res.render("profile", {
      user,
      createdCourses,
      signedUpCourses,
      totalCreatedCourses: createdCourses.length,
      totalSignedUpCourses: signedUpCourses.length,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

function generateToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  return jwt.sign(payload, SECRET, { expiresIn: "2h" });
}
