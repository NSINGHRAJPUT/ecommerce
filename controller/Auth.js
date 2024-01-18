const bcrypt = require("bcrypt");
const EcUser = require("../modal/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("request body", req.body);
  try {
    let user = await EcUser.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new EcUser({
      email,
      password: hashedPassword,
      addresses: [],
      role: "user",
    });
    const response = await user.save();
    console.log("database response", response);
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", token: token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EcUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    res
      .status(200)
      .json({ message: "Login successful", id: user._id, role: user.role });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendResetEmail = async (email, resetToken) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `<p>You requested a password reset. Click <a href="http://localhost:3000/reset-password/?token=${resetToken}">here</a> to reset your password.</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    const user = await EcUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    const response = await user.save();
    await sendResetEmail(email, resetToken);
    console.log(response);
    res.status(200).json({ message: "Password reset initiated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.confirmTokenAndSetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log("body data", { token, newPassword });
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await EcUser.findById(decodedToken.userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
