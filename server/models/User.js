import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["jobseeker", "recruiter"],
            default: "jobseeker",
        },

        profileImage: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);

export default User