import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema({
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
    icon: {
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
}, { timestamps: true })

const mainCategoryModel = mongoose.model("mainCategory", mainCategorySchema);

export default mainCategoryModel