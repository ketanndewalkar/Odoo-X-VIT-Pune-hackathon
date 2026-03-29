import bcrypt from "bcryptjs";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { getCurrencyByCountry } from "../utils/currency.js";


export const signupAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      companyName,
      country,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !companyName ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const defaultCurrency = await getCurrencyByCountry(country);
    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      name: companyName.trim(),
      country: country.trim(),
      defaultCurrency,
    });

    const adminUser = await User.create({
      companyId: company._id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "ADMIN",
    });

    company.createdBy = adminUser._id;
    await company.save();

    const token = generateToken(adminUser._id);

    return res.status(201).json({
      success: true,
      message: "Admin signup successful",
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        companyId: adminUser.companyId,
      },
      company: {
        _id: company._id,
        name: company.name,
        country: company.country,
        defaultCurrency: company.defaultCurrency,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during signup",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).populate("companyId", "name country defaultCurrency");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId?._id || user.companyId,
      },
      company: user.companyId
        ? {
            _id: user.companyId._id,
            name: user.companyId.name,
            country: user.companyId.country,
            defaultCurrency: user.companyId.defaultCurrency,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during signin",
    });
  }
};