import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // ======= Text Section =======
        name: {
            type: String,
            required: true,
            lowercase: true,
            minLength: [4, "name too short"],
        },
        description: {
            type: String,
            lowercase: true,
            required: true,
            minLength: [4, "description too short"],
        },
        brand: {
            type: String,
            required: true,
            lowercase: true,
            minLength: [2, "brand too short"],
        },
        colors: [{
            type: String, //red // 2
            required: true,
        }],
        model: {
            type: String,
            required: true,
            lowercase: true,
            minLength: [2, "model too short"],
        },
        releaseYear: {
            type: Date,
            required: true
        },
        // ======= will be created ======== 
        serial: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
            required: true,
        },
        customId: {
            type: String,
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
        // will be created
        priceAfterDiscount: {
            type: Number,
            required: true
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
        // ======= reviews =======
        averageRating: {
            type: Number,
            default: 5
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
        bestOffer: {
            type: Boolean,
            default: false
        },
        freeShipping: {
            type: Boolean,
            default: false
        },
        trendy: {
            type: Boolean,
            default: false
        },
        new: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;