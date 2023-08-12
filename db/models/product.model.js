import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            lowercase: true,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
        },
        description: {
            type: String,
            lowercase: true,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        priceAfterDiscount: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        colors: [
            {
                color: {
                    type: String,
                    lowercase: true,
                    //   unique: true, //! ask about it want it unique in that array
                },
                count: {
                    type: Number,
                },
            },
        ],
        sizes: [
            {
                size: {
                    type: String,
                    lowercase: true,
                    //   unique: true,
                },
                count: {
                    type: Number,
                },
            },
        ],
        soldItems: {
            type: Number,
            default: 0,
        },
        images: [
            {
                secure_url: {
                    type: String,
                    required: true,
                },
                public_id: {
                    type: String,
                    required: true,
                },
                // required: true,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: false, // TODO: after making user model "true"
        },
        customId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        subCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subCategory",
            required: true,
        },
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subCategory",
            required: true,
        },
    },
    { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
