import bcrypt from "bcryptjs";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { getCurrencyByCountry } from "../utils/currency.js";


const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE", "FINANCE", "DIRECTOR", "CFO"];
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

    return res.status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
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

export const createUser = async (req, res) => {
  try {
    const { name, email, role, managerId } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email and role are required",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const adminUser = req.user;

    if (adminUser.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create users",
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

    if (managerId) {
      const manager = await User.findOne({
        _id: managerId,
        companyId: adminUser.companyId,
        isActive: true,
      });

      if (!manager) {
        return res.status(404).json({
          success: false,
          message: "Manager not found in your company",
        });
      }
    }

    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.create({
      companyId: adminUser.companyId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      managerId: managerId || null,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      defaultPassword,
      user: {
        _id: user._id,
        companyId: user.companyId,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while creating user",
    });
  }
};

export const getCompanyUsers = async (req, res) => {
  try {
    const users = await User.find({
      companyId: req.user.companyId,
    })
      .select("-password")
      .populate("managerId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while fetching users",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findOne({
      _id: id,
      companyId: req.user.companyId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while updating role",
    });
  }
};

export const assignManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    const user = await User.findOne({
      _id: id,
      companyId: req.user.companyId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!managerId) {
      user.managerId = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Manager removed successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          managerId: user.managerId,
        },
      });
    }

    if (String(user._id) === String(managerId)) {
      return res.status(400).json({
        success: false,
        message: "User cannot be their own manager",
      });
    }

    const manager = await User.findOne({
      _id: managerId,
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    user.managerId = manager._id;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Manager assigned successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
      },
      manager: {
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while assigning manager",
    });
  }
};