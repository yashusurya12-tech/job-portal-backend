import exp from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

export const userRouter = exp.Router();


// Register User
userRouter.post("/register", async (req, res, next) => {
    try {

        const { name, email, password, role } = req.body;

        // Check whether the user is already registered
        const userFound = await UserModel.findOne({ email: email });

        if (userFound) {
            return res.status(400).json({
                success: false,
                message: "User already registered"
            });
        }

        // Encrypt the password before storing it in the database
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const userData = new UserModel({
            name: name,
            email: email,
            password: encryptedPassword,
            role: role
        });

        // Save user to database
        await userData.save();

        res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (err) {
        next(err);
    }
});


// Login User
userRouter.post("/login", async (req, res, next) => {
    try {

        const { email, password } = req.body;

        // Find user using email
        const userFound = await UserModel.findOne({ email: email });

        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }

        // Compare entered password with encrypted password
        const validPassword = await bcrypt.compare(
            password,
            userFound.password
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // Create JWT token after successful login
        const token = jwt.sign(
            {
                userId: userFound._id,
                role: userFound.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Store JWT token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: "Login successful"
        });

    } catch (err) {
        next(err);
    }
});


// View Own Profile
userRouter.get("/profile", verifyToken, async (req, res, next) => {
    try {

        // Find the logged-in user using the ID stored in the JWT
        const user = await UserModel.findById(req.user.userId)
            .select("-password");

        res.status(200).json({
            success: true,
            message: "Profile details",
            data: user
        });

    } catch (err) {
        next(err);
    }
});


// Update Own Profile
userRouter.put("/profile", verifyToken, async (req, res, next) => {
    try {

        // Get the profile details sent by the user
        let modifiedProfile = req.body;

        // These fields should not be changed through this route
        delete modifiedProfile.password;
        delete modifiedProfile.role;
        delete modifiedProfile.status;
        delete modifiedProfile.email;

        // Update the logged-in user's profile
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user.userId,
            { $set: modifiedProfile },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile modified",
            data: updatedUser
        });

    } catch (err) {
        next(err);
    }
});


// Logout User
userRouter.post("/logout", verifyToken, async (req, res, next) => {
    try {

        // Remove the JWT cookie
        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (err) {
        next(err);
    }
});


// Job Seeker Only Route
userRouter.get(
    "/jobseeker-only",
    verifyToken,
    allowRoles("jobseeker"),
    (req, res) => {

        // This route can be accessed only by job seekers
        res.json({
            success: true,
            message: "Job Seeker protected route"
        });

    }
);