import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Settings from "../models/Settings.js";


export const signup = async (req, res) => {
  try {
    const { email, password, organizationName } = req.body;

    // Basic validation
    if (!email || !password || !organizationName) {
      return res.status(400).json({
        success: false,
        message: "Email, password and organization name are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create organization
    const organization = await Organization.create({
      name: organizationName,
    });

    // Create default settings for organization
    await Settings.create({
      organization: organization._id,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      organization: organization._id,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        organizationId: organization._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        organizationId: organization._id,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user (explicitly include password)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        organizationId: user.organization,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        organizationId: user.organization,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
