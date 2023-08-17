import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        min: [3, "name too short"],
    },
    slug: {
        type: String,
        lowercase: true,
        required: true,
    },
    image: {
        secure_url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    customId: {
        type: String,
        required: true
    },
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mainCategory",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
}, { timestamps: true })

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel