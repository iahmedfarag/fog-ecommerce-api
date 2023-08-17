import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {

    },
    { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
