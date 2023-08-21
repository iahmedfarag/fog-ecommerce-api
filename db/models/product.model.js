import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // ======= Text Section =======
        name: {
            type: String,
            required: true,
            lowercase: true,
            min: [4, "name too short"],
        },
        description: {
            type: String,
            lowercase: true,
            required: true,
            min: [4, "description too short"],
        },
        brand: {
            type: String,
            required: true,
            lowercase: true,
            min: [2, "brand too short"],
        },
        serial: {
            type: String,
            required: true,
        },
        customId: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
            required: true,
        },
        // ======= price =======
        price: {
            type: Number,
            required: true
        },
        discountPercentegeAmount: {
            type: Number,
            default: 0
        },
        priceAfterDiscount: {
            type: Number,
        },
        // ======= images =======
        mainImage: {
            secure_url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
        images: [{
            secure_url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        }],
        // ======= stock =======
        stock: {
            type: Number,
            required: true
        },
        soldItems: {
            type: Number,
            required: true
        },
        availableItems: {
            type: Number,
            required: true
        },
        // ======= reviews =======
        averageRating: {
            type: Number,
        },
        // ======= related =======
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
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subCategory",
            required: true,
        },
        // ======= extra =======
        featured: {
            type: Boolean,
            default: false
        },
        freeShipping: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;