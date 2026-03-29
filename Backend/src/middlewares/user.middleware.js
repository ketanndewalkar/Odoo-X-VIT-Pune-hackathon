import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const isLoggedIn = async(req,res,next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            });
        }
        req.user = user;
        next();   
    } catch (error) {
        console.log("Error in isLoggedIn middleware:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
} 
 
export const isAllowed  = (roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource    "
            });
        }
        next();
    }
} 