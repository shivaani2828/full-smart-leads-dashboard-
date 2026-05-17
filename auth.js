import jwt from 'jsonwebtoken'
import User from '../models/User.js'


export default async function auth(req,res,next) {
    let token= req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authorized" });
    
    try {
        const decode= jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decode.id).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user=user
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
  
}