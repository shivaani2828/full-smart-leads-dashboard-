import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

function sendTokenResponse(user, statusCode, res) {
    const token = generateToken(user._id)

    return res.status(statusCode).cookie('token', token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 day
        httpOnly: true,
        sameSite: 'none',
        secure:true
    })
        .json({
            success: true,
            token,
            user: {
                id: user._id, name: user.name, email: user.email
            }
        })
}

export async function register(req, res) {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10)
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }
    user = await User.create({ name, email, password: hashed });
    sendTokenResponse(user, 201, res)
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    sendTokenResponse(user, 200, res);
}

export async function getMe(req, res) {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

export async function logout(req, res) {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
}