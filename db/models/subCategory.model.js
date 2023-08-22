import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    // ===== text =====
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
    featured: {
        type: Boolean,
        default: false
    },

    // ===== images =====
    customId: {
        type: String,
        required: true
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

    // ===== related =====
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
    productsCount: {
        type: Number,
        default: 0
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})


subCategorySchema.virtual('products', {
    ref: 'product',
    foreignField: 'subCategory',
    localField: "_id"
})


const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel