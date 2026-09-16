import { Schema, model } from "mongoose";

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    experience: {
        type: Number,
        default: 0
    },

    employerId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    }
});

export const JobModel = model("job", jobSchema);