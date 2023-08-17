import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        min: [3, "name too short"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    customId: {
        type: String,
        required: true
    },
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mainCategory",
        required: true,
    }
}, { timestamps: true })

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel