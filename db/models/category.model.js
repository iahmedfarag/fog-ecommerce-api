import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false // TODO: after making user model "true"
    },
    customId: {
        type: String,
        required: true
    }
}, { timestamps: true })

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel