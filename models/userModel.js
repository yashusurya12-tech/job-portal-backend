import { Schema, model } from "mongoose"; 
 
const educationSchema = new Schema({ 
    degree: String, 
    college: String, 
    passingYear: Number 
}, { _id: false }); 
 
const userSchema = new Schema({ 
    name: { 
        type: String, 
        required: true 
    }, 
 
    email: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
 
    password: { 
        type: String, 
        required: true 
    }, 
 
    role: { 
        type: String, 
        enum: ["jobseeker", "employer", "admin"], 
        default: "jobseeker" 
    }, 
 
    skills: { 
        type: [String], 
        default: [] 
    }, 
 
    experience: { 
        type: Number, 
        default: 0 
    }, 
 
    education: { 
        type: [educationSchema], 
        default: [] 
    }, 
 
    status: { 
        type: String, 
        enum: ["active", "blocked"], 
        default: "active" 
    } 
}); 
 
export const UserModel = model("user", userSchema);