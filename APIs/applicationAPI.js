import exp from "express";
import { ApplicationModel } from "../models/applicationModel.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

export const applicationRouter = exp.Router();


// Apply for a job
applicationRouter.post(
    "/apply/:jobId",
    verifyToken,
    allowRoles("jobseeker"),
    async (req, res, next) => {
        try {

            // Create a new application
            const applicationData = new ApplicationModel({
                jobId: req.params.jobId,
                applicantId: req.user.userId
            });

            // Save application in MongoDB
            await applicationData.save();

            res.status(201).json({
                success: true,
                message: "Application submitted successfully",
                data: applicationData
            });

        } catch (err) {
            next(err);
        }
    }
);

// Get my applications
applicationRouter.get(
    "/my-applications",
    verifyToken,
    allowRoles("jobseeker"),
    async (req, res, next) => {
        try {

            // Find applications submitted by the logged-in user
            const applications = await ApplicationModel.find({
                applicantId: req.user.userId
            });

            res.status(200).json({
                success: true,
                message: "Applications fetched successfully",
                data: applications
            });

        } catch (err) {
            next(err);
        }
    }
);

// Get applications for employer's jobs
applicationRouter.get(
    "/employer-applications",
    verifyToken,
    allowRoles("employer"),
    async (req, res, next) => {
        try {

            // Find applications for jobs created by this employer
            const applications = await ApplicationModel.find()
                .populate("jobId")
                .populate("applicantId");

            res.status(200).json({
                success: true,
                message: "Applications fetched successfully",
                data: applications
            });

        } catch (err) {
            next(err);
        }
    }
);

// Update application status
applicationRouter.put(
    "/status/:id",
    verifyToken,
    allowRoles("employer"),
    async (req, res, next) => {
        try {

            // Get the new status from the request body
            const { status } = req.body;

            // Update the application
            const updatedApplication =
                await ApplicationModel.findByIdAndUpdate(
                    req.params.id,
                    { status: status },
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!updatedApplication) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Application status updated",
                data: updatedApplication
            });

        } catch (err) {
            next(err);
        }
    }
);