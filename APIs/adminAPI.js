import exp from "express";
import { UserModel } from "../models/userModel.js";
import { JobModel } from "../models/jobModel.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

export const adminRouter = exp.Router();


// View all users
adminRouter.get(
    "/users",
    verifyToken,
    allowRoles("admin"),
    async (req, res, next) => {
        try {

            // Find all users
            const users = await UserModel.find().select("-password");

            res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: users
            });

        } catch (err) {
            next(err);
        }
    }
);

// Change user status
adminRouter.put(
    "/users/:id/status",
    verifyToken,
    allowRoles("admin"),
    async (req, res, next) => {
        try {

            // Get the new status from the request body
            const { status } = req.body;

            // Update the user's status
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.params.id,
                { status: status },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "User status updated",
                data: updatedUser
            });

        } catch (err) {
            next(err);
        }
    }
);

// View all jobs
adminRouter.get(
    "/jobs",
    verifyToken,
    allowRoles("admin"),
    async (req, res, next) => {
        try {

            // Find all jobs
            const jobs = await JobModel.find();

            res.status(200).json({
                success: true,
                message: "Jobs fetched successfully",
                data: jobs
            });

        } catch (err) {
            next(err);
        }
    }
);

// Delete a job
adminRouter.delete(
    "/jobs/:id",
    verifyToken,
    allowRoles("admin"),
    async (req, res, next) => {
        try {

            // Delete the job using the ID from the URL
            const deletedJob = await JobModel.findByIdAndDelete(
                req.params.id
            );

            if (!deletedJob) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Job deleted successfully"
            });

        } catch (err) {
            next(err);
        }
    }
);