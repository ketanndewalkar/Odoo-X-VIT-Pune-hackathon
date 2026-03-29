import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import { getCurrencyByCountry } from "../utils/currency.js";

export const createCompany = async (req, res) => {
  try {
    const { name, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({
        success: false,
        message: "Company name and country are required",
      });
    }

    const defaultCurrency = await getCurrencyByCountry(country);

    const company = await Company.create({
      name: name.trim(),
      country: country.trim(),
      defaultCurrency,
      createdBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while creating company",
    });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("companyId");

    if (!user || !user.companyId) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company: user.companyId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllUsers = async(req,res) => {
  try{
    const users = await User.find({companyId: req.user.companyId}).select("-password");
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    }); 
  }
}