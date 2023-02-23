const User = require("../model/userModel");
const Token = require("../model/tokenModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (password.length < 6) {
    res.json({ msg: "Password must be greater than 6 characters" });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1 day
      sameSite: "none",
      //secure: true,
    });
    res.status(201).json({
      msg: "User Created",
      token,
    });
  } catch (error) {
    res.json({ err: error.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json("Please add email and password");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json("User not found");
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (passwordIsCorrect) {
      const token = generateToken(user._id);
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite: "none",
        //secure: true,
      });
    }
    if (user && passwordIsCorrect) {
      res.json({ msg: "User logged in" });
    } else {
      res.json({ msg: "Email or password incorrect" });
    }
  } catch (error) {
    res.json({ err: error.message });
  }
};
const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //NOW
    sameSite: "none",
    //secure: true,
  });
  res.status(200).json({ msg: "User Logged Out" });
};
const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        msg: "user found",
      });
    } else {
      res.json({ msg: "user not found" });
    }
  } catch (error) {
    res.json({ err: error.message });
  }
};
const isLogedIn = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    req.json({ msg: error.message });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { email, name, photo, phone, bio } = user;
      user.email = email;
      user.name = req.body.name || name;
      user.phone = req.body.phone || phone;
      user.bio = req.body.bio || bio;
      user.photo = req.body.photo || photo;
      const updatedUser = await user.save();
      res.status(200).json("user updated");
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const oldPassword = req.body.password;
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (isPasswordCorrect) {
        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.confirmNewPassword;
        if (newPassword === confirmNewPassword) {
          user.password = newPassword;
          const updatedUser = await user.save();
          res.cookie("token", "", {
            path: "/",
            httpOnly: true,
            expires: new Date(0), //NOW
            sameSite: "none",
            //secure: true,
          });
          res.json(
            "password updated successfully please sign in with new password"
          );
        } else {
          res.json("Password did not matched");
        }
      } else {
        res.json("You have enterd an incorrect password");
      }
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      await Token.create({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000), // 30 mins
      });
      const resetUrl = `${process.env.Frontend_URL}/resetPassword/${resetToken}`;
      const message = `
      <h2>Hello ${user.name}</h2>
      <p>You requested for a password reset</p>
      <p>Please use the url below to reset passsword</p>
      <p>This link is valid for only 30 minutes</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      <p>Regards</p>
      <p>Pinvent team</p>`;
      res.json(hashedToken);
    } else {
    }
  } catch (error) {
    res.json({ err: error.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  isLogedIn,
  updateUserProfile,
  changePassword,
  resetPassword,
};
