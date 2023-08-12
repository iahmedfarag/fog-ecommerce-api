import { brandModel, productModel, subCategoryModel, categoryModel } from './../../db/models/index.js';
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from './../../utils/cloudinaryConfig.js';
import { nanoid } from 'nanoid';
import { StatusCodes } from 'http-status-codes';
import { successRes } from "../../variables.js";
import slugify from "slugify"

export const addBrand = async (req, res) => {
    const { name, categoryId, subCategoryId } = req.body;
    const logo = req.file;

    const brand = await brandModel.findOne({ name })
    if (brand) {
        throw new BadRequestError("brand already exist")
    }

    if (!categoryId || !subCategoryId) {
        throw new BadRequestError("invalid category")
    }

    const isSubCategoryValid = await subCategoryModel.findOne({ categoryId })
    const subCategory = await subCategoryModel.findById(subCategoryId)
    if (!isSubCategoryValid) {
        throw new BadRequestError("invalid sub-category")
    }

    if (!logo) {
        throw new BadRequestError("upload brand photo")
    }
    const slug = slugify(name);
    const customId = slug + "_" + nanoid(5)
    const category = await categoryModel.findById(categoryId)
    const { public_id, secure_url } = await cloudinary.uploader.upload(logo.path, {
        folder: `ecom/categories/${category.customId}/subCategories/${subCategory.customId}/brands/${customId}`
    })

    const brandObj = { name, slug, logo: { public_id, secure_url }, categoryId, subCategoryId, customId }

    const brandC = await brandModel.create(brandObj)
    if (!brandC) {
        await cloudinary.uploader.destroy(public_id)
        throw new BadRequestError("try again later")
    }

    res.status(StatusCodes.CREATED).json({ response: successRes, message: "brand created", brandC })
}

export const updateBrand = async (req, res) => {
    const { id } = req.params
    const { name, categoryId, subCategoryId } = req.body;
    const logo = req.file;

    const brand = await brandModel.findById(id)

    if (!brand) {
        throw new NotFoundError("brand not found")
    }

    if (!categoryId || !subCategoryId) {
        throw new BadRequestError("invalid category")
    }

    const isSubCategoryValid = await subCategoryModel.findOne({ categoryId })
    const category = await categoryModel.findById(categoryId)

    if (!isSubCategoryValid) {
        throw new BadRequestError("invalid sub-category")
    }

    brand.name = name;
    brand.slug = slugify(name)
    brand.customId = slugify(name) + nanoid(5)
    if (logo) {
        brand.logo = logo;
        await cloudinary.uploader.destroy(brand.customId);

        const { public_id, secure_url } = await cloudinary.uploader.upload(logo.path, {
            folder: `ecom/categories/${category.customId}/subCategories/${isSubCategoryValid.customId}/brands/${brand.customId}`
        })
        brand.logo = { public_id, secure_url }
    }

    await brand.save()

    res.status(StatusCodes.OK).json({ response: successRes, message: "brand updated", brand })
}

export const deleteBrand = async (req, res) => {
    const { id } = req.params
    const { categoryId, subCategoryId } = req.body;

    const brand = await brandModel.findById(id)

    if (!brand) {
        throw new NotFoundError("brand not found")
    }

    if (!categoryId || !subCategoryId) {
        throw new BadRequestError("invalid category")
    }

    const isSubCategoryValid = await subCategoryModel.findOne({ categoryId })
    const category = await categoryModel.findById(categoryId)

    if (!isSubCategoryValid) {
        throw new BadRequestError("invalid sub-category")
    }

    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(
        `ecom/categories/${category.customId}/subCategories/${isSubCategoryValid.customId}/brands/${brand.customId}}`,
    )

    await cloudinary.api.delete_folder(
        `ecom/categories/${category.customId}/subCategories/${isSubCategoryValid.customId}/brands/${brand.customId}`,
    )

    //=========== Delete from DB ==============
    await brandModel.findByIdAndDelete(id)
    const deleteRelatedProducts = await productModel.deleteMany({ brandId: id })

    res.status(StatusCodes.OK).json({ response: successRes, message: "brand deleted" })
}
export const getAllBrands = async (req, res) => {
    const brands = await brandModel.find({})

    res.status(StatusCodes.OK).json({ response: successRes, message: "all brands", brands })
}
export const getSingleBrand = async (req, res) => {
    const { id } = req.params;
    const brand = await brandModel.findById(id);

    res.status(StatusCodes.OK).json({ response: successRes, message: "single brand", brand })
}

