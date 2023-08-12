import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from './../../utils/cloudinaryConfig.js';
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { successRes } from './../../variables.js';
import { brandModel, productModel, subCategoryModel, categoryModel } from './../../db/models/index.js';


export const addCategory = async (req, res, next) => {
    const { name } = req.body;
    const image = req.file;

    const category = await categoryModel.findOne({ name });

    if (category) {
        throw new BadRequestError("category already exist")
    }

    if (!image) {
        return new BadRequestError("upload photo for category please")
    }
    const slug = slugify(name)

    const customId = slug + "_" + nanoid(5)


    const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, { folder: `ecom/categories/${customId}` })


    const categoryObj = {
        name,
        slug,
        image: {
            secure_url,
            public_id,
        },
        customId,
    }

    const cat = await categoryModel.create(categoryObj)
    if (!cat) {
        await cloudinary.uploader.destroy(public_id)
        throw new BadRequestError("try again please")
    }
    res.status(StatusCodes.OK).json({ response: successRes, message: "category created", cat })
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file

    const category = await categoryModel.findById(id);

    if (!category) {
        throw new NotFoundError("category not found");
    }

    const isNameUnq = await categoryModel.findOne({ name: name.toLowerCase() })

    if (name.toLowerCase() === category.name || isNameUnq) {
        throw new BadRequestError("choose another category name please!")
    }

    if (image) {
        await cloudinary.uploader.destroy(category.image.public_id);
    }

    const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, { folder: `ecom/categories/${category.customId}` })

    category.name = name;
    category.customId = slugify(name) + nanoid(5)
    category.image.public_id = public_id;
    category.image.secure_url = secure_url;
    await category.save();

    res.status(StatusCodes.OK).json({ response: successRes, message: 'category updated', category })
}

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params
    // check category id
    const categoryExists = await categoryModel.findByIdAndDelete(id)
    if (!categoryExists) {
        throw new BadRequestError("invalid category id")
    }

    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(
        `ecom/categories/${categoryExists.customId}`,
    )

    await cloudinary.api.delete_folder(
        `ecom/categories/${categoryExists.customId}`,
    )

    //=========== Delete from DB ==============

    const deleteRelatedSubCategories = await subCategoryModel.deleteMany({ categoryId: id })
    const deleteRelatedBrands = await brandModel.deleteMany({ categoryId: id })
    const deleteRelatedProducts = await productModel.deleteMany({ categoryId: id })

    // if (!deleteRelatedSubCategories.deletedCount || !deleteRelatedBrands.deletedCount || !deleteRelatedProducts.deletedCount) {
    //     throw new BadRequestError("delete fail")
    // }

    res.status(StatusCodes.OK).json({ response: successRes, messsage: 'category deleted' })
}

export const getAllCategories = async (req, res, next) => {
    // const categories = await categoryModel.find();

    let categoriesArr = []

    // categories.map(async (category) => {
    //     const subCategory = await subCategoryModel.find({ categoryId: category._id });
    //     let categoryObj = category.toObject();
    //     categoryObj.subCategories = subCategory;
    //     categoriesArr.push(categoryObj)
    // })

    // for (const category of categories) {
    //     const subCategories = await subCategoryModel.find({ categoryId: category._id });
    //     let objectCat = category.toObject();
    //     objectCat.subCategories = subCategories;
    //     categoriesArr.push(objectCat);
    // }

    const cursor = categoryModel.find().cursor()
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        const subCategories = await subCategoryModel.find({
            categoryId: doc._id,
        })

        const objectCat = doc.toObject()
        objectCat.subCategories = subCategories
        categoriesArr.push(objectCat)
    }


    res.status(StatusCodes.OK).json({ response: successRes, message: "all categories", categoriesArr })
}

export const getCategory = async (req, res, next) => {
    const { id } = req.params
    const category = await categoryModel.findById(id)

    if (!category) {
        throw new NotFoundError("category not found")
    }

    res.status(StatusCodes.OK).json({ response: successRes, message: "single category", category })
}