const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "User not authorized please sign in" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //get user id from token
    const user = await User.findById(verified.id);
    console.log("token user");
    console.log(user);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    req.json({ msg: error.message });
  }
};
module.exports = protect;
