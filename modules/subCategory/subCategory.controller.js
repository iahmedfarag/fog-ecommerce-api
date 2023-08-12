import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from "../../utils/cloudinaryConfig.js";
import slugify from 'slugify';
import { StatusCodes } from "http-status-codes";
import { successRes } from "../../variables.js";
import { brandModel, productModel, subCategoryModel, categoryModel } from './../../db/models/index.js';

export const addSubCategory = async (req, res, next) => {
    const { name, categoryId } = req.body;
    const image = req.file

    const subCategory = await subCategoryModel.findOne({ name: name.toLowerCase() });

    if (subCategory) {
        throw new BadRequestError("choose another name!")
    }

    const category = await categoryModel.findById(categoryId);

    if (!category) {
        throw new NotFoundError("cateogry not found!")
    }
    const slug = slugify(name)

    const customId = slug + "_" + nanoid(5)

    const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, {
        folder: `ecom/categories/${category.customId}/subCategories/${customId}`
    })


    const subCategoryObj = {
        name,
        categoryId,
        image: {
            public_id,
            secure_url
        },
        slug,
        customId,
    }

    const sub = await subCategoryModel.create(subCategoryObj)

    if (!sub) {
        await cloudinary.uploader.destroy(public_id)
        throw new BadRequestError("try again please")
    }

    res.status(StatusCodes.CREATED).json({ response: successRes, message: "subCategory created", sub })

}

export const updateSubCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file;
    const subCategory = await subCategoryModel.findById(id)

    if (!subCategory) {
        throw new NotFoundError("sub category not found")
    }

    const category = await categoryModel.findById(subCategory.categoryId)

    subCategory.name = name
    subCategory.slug = slugify(name)
    subCategory.customId = slugify(name) + nanoid(5)
    if (image) {
        subCategory.image = image;
        await cloudinary.uploader.destroy(subCategory.customId);

        const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, {
            folder: `ecom/categories/${category.customId}/subCategories/${customId}`
        })
        subCategory.image = {
            public_id,
            secure_url
        }
    }

    await subCategory.save()

    res.status(StatusCodes.OK).json({ response: successRes, message: "sub category updated", subCategory })
}

export const deleteSubCategory = async (req, res) => {
    const { id } = req.params;

    const subCategory = await subCategoryModel.findById(id)

    if (!subCategory) {
        throw new NotFoundError("sub category not found")
    }
    const category = await categoryModel.findById(subCategory.categoryId)

    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(
        `ecom/categories/${category.customId}/subCategories/${subCategory.customId}`,
    )

    await cloudinary.api.delete_folder(
        `ecom/categories/${category.customId}/subCategories/${subCategory.customId}`,
    )

    //=========== Delete from DB ==============

    const deleteRelatedBrands = await brandModel.deleteMany({ subCategoryId: id })
    const deleteRelatedProducts = await productModel.deleteMany({ subCategoryId: id })

    // if (!deleteRelatedBrands.deletedCount || !deleteRelatedProducts.deletedCount) {
    //     throw new BadRequestError("delete fail")
    // }

    res.status(StatusCodes.OK).json({ response: successRes, message: "sub category deleted" })
}

export const getAllSubCategories = async (req, res) => {
    const subCategories = await subCategoryModel.find({}).populate([{ path: "categoryId", select: 'slug' }])

    res.status(StatusCodes.OK).json({ response: successRes, message: "get all sub categoris", subCategories })
}

export const getSingleSubCategory = async (req, res) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id)

    res.status(StatusCodes.OK).json({ response: successRes, message: "single category", subCategory })
}
