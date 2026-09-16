import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "job",
        required: true
    },

    applicantId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    status: {
        type: String,
        enum: ["applied", "shortlisted", "rejected", "selected"],
        default: "applied"
    },

    appliedDate: {
        type: Date,
        default: Date.now
    }
});

export const ApplicationModel = model("application", applicationSchema);