const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp, sendOtpEmail } = require("../services/otp.service");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const allowedDomains = ["iiitn.ac.in"];
function isValidInstituteEmail(email) {
  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
}

async function googleLoginController(req, res) {
  try {
    const { token } = req.body; // ID token from frontend

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;

    // ✅ restrict domain
    if (!email.endsWith("@iiitn.ac.in")) {
      return res.status(403).json({
        message: "Only institute email allowed",
      });
    }

    let user = await userModel.findOne({ email });

    // 🆕 create user if not exists
    if (!user) {
      user = await userModel.create({
        fullName: {
          firstName,
          lastName,
        },
        email,
        password: "", // no password needed
        isVerified: true,
        lastActive: new Date(),
      });
    } else {
      // update activity
      user.lastActive = new Date();
      user.isVerified = true;
      await user.save();
    }

    // 🔐 generate JWT
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/"
});

    res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Google login failed" });
  }
}

async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    user.lastActive = new Date();

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/"
});

    res.status(200).json({
      message: "Email verified and logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function resendOtpController(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const now = Date.now();

    // 🛡️ prevent spam
    if (user.otpLastSent && now - user.otpLastSent < 60 * 1000) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP",
      });
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpLastSent = now; // ✅ FIX (you missed this)

    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function registerController(req, res) {
  try {
    const {
      fullName: { firstName, lastName },
      email,
      password,
    } = req.body;

    if (!isValidInstituteEmail(email)) {
      return res.status(403).json({
        message: "Only institute email allowed",
      });
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const user = await userModel.create({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password: hashedPassword,
      lastActive: new Date(),
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      otpLastSent: Date.now(),
    });

    // const token = jwt.sign({
    //     id:user._id
    // },process.env.JWT_SECRET)

    // res.cookie("token", token, {
    //         httpOnly: true,
    //         sameSite: "strict"
    //     });

    // res.status(201).json({
    //     message:"User registered successfully",
    //     user:{
    //         email:user.email,
    //         id:user._id,
    //         fullName:user.fullName
    //     }
    // })
    await sendOtpEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!isValidInstituteEmail(email)) {
    return res.status(403).json({
      message: "Only institute email allowed",
    });
  }

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: "Please verify your email first",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid Password",
    });
  }

  user.lastActive = new Date();
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/"
});

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      email: user.email,
      id: user._id,
      fullName: user.fullName,
    },
  });
}

async function getMeController(req, res) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
}

function logoutController(req, res) {
  res.cookie("token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 0
});
  res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  registerController,
  loginController,
  verifyOtpController,
  resendOtpController,
  googleLoginController,
  logoutController,
  getMeController,
};
