import exp from "express";
import { JobModel } from "../models/jobModel.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

export const jobRouter = exp.Router();


// Create a new job
jobRouter.post(
    "/jobs",
    verifyToken,
    allowRoles("employer"),
    async (req, res, next) => {
        try {

            const { title, description, company, location, salary, skills, experience } = req.body;

            // Create a new job using the details provided
            const jobData = new JobModel({
                title: title,
                description: description,
                company: company,
                location: location,
                salary: salary,
                skills: skills,
                experience: experience,
                employerId: req.user.userId
            });

            // Save the job in MongoDB
            await jobData.save();

            res.status(201).json({
                success: true,
                message: "Job created successfully",
                data: jobData
            });

        } catch (err) {
            next(err);
        }
    }
);

// Get all jobs
jobRouter.get("/jobs", async (req, res, next) => {
    try {

        // Find all jobs from MongoDB
        const jobs = await JobModel.find();

        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs
        });

    } catch (err) {
        next(err);
    }
});

// Get one job by ID
jobRouter.get("/jobs/:id", async (req, res, next) => {
    try {

        // Find the job using the ID from the URL
        const job = await JobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job details",
            data: job
        });

    } catch (err) {
        next(err);
    }
});

// Update a job
jobRouter.put("/jobs/:id",verifyToken,allowRoles("employer"),async (req, res, next) => {
        try {

            // Get the details to be updated
            const modifiedJob = req.body;

            // Update the job
            const updatedJob = await JobModel.findByIdAndUpdate(
                req.params.id,
                { $set: modifiedJob },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedJob) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Job updated successfully",
                data: updatedJob
            });

        } catch (err) {
            next(err);
        }
    }
);

// Delete a job
jobRouter.delete(
    "/jobs/:id",
    verifyToken,
    allowRoles("employer"),
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