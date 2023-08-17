import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from "../../utils/cloudinaryConfig.js";
import slugify from 'slugify';
import { StatusCodes } from "http-status-codes";
import { successRes } from "../../variables.js";
import { brandModel, productModel, subCategoryModel, categoryModel } from './../../db/models/index.js';
import subcategories from "../../data/subCategories.json" assert { type: "json" };
import path from 'path'
import mainCategoryModel from "../../db/models/mainCategory.model.js";
// -------- add sub category -------- // 
export const addSubCategory = async (req, res, next) => {
    const { name, categoryId } = req.body;
    const image = req.file

    const subCategory = await subCategoryModel.findOne({ name: name.toLowerCase() });
    if (subCategory) throw new BadRequestError("choose another name!")

    const category = await categoryModel.findById(categoryId);
    if (!category) throw new NotFoundError("cateogry not found!")

    const slug = slugify(name)
    const customId = slug + "_" + nanoid(5)
    const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, {
        folder: `ecom/categories/${category.customId}/subCategories/${customId}`
    })

    const subCategoryObj = { name, category: categoryId, image: { public_id, secure_url }, slug, customId, }
    const sub = await subCategoryModel.create(subCategoryObj)

    if (!sub) {
        await cloudinary.uploader.destroy(public_id)
        throw new BadRequestError("try again please")
    }
    res.status(StatusCodes.CREATED).json({ response: successRes, message: "subCategory created", sub })
}

// -------- update sub category -------- // 
export const updateSubCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file;
    const subCategory = await subCategoryModel.findById(id)

    if (!subCategory) throw new NotFoundError("sub category not found")

    const category = await categoryModel.findById(subCategory.category)

    subCategory.name = name
    subCategory.slug = slugify(name)
    if (image) {
        await cloudinary.uploader.destroy(subCategory.image.public_id);

        const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, { folder: `ecom/categories/${category.customId}/subCategories/${subCategory.customId}` })
        subCategory.image = { public_id, secure_url }
    }

    await subCategory.save()

    res.status(StatusCodes.OK).json({ response: successRes, message: "sub category updated", subCategory })
}

// -------- delete sub category -------- // 
export const deleteSubCategory = async (req, res) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id)
    if (!subCategory) throw new NotFoundError("sub category not found")
    const category = await categoryModel.findById(subCategory.category)
    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(`ecom/categories/${category.customId}/subCategories/${subCategory.customId}`,)
    await cloudinary.api.delete_folder(`ecom/categories/${category.customId}/subCategories/${subCategory.customId}`,)
    //=========== Delete from DB ==============
    const deleteRelatedBrands = await brandModel.deleteMany({ subCategoryId: id })
    const deleteRelatedProducts = await productModel.deleteMany({ subCategoryId: id })

    res.status(StatusCodes.OK).json({ response: successRes, message: "sub category deleted" })
}

// -------- get all sub categories -------- // 
export const getAllSubCategories = async (req, res) => {
    const subCategories = await subCategoryModel.find({}).populate([{ path: "categoryId", select: 'slug' }])

    res.status(StatusCodes.OK).json({ response: successRes, message: "get all sub categoris", data: subCategories })
}

// -------- get sub category -------- // 
export const getSingleSubCategory = async (req, res) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id)
    if (!subCategory) throw new NotFoundError("not found subCategory")

    res.status(StatusCodes.OK).json({ response: successRes, message: "single category", data: subCategory })
}

// -------- add many sub categories -------- // 
export const addMany = async (req, res, next) => {
    let newArr = [];
    let finalArr = []

    subcategories.map(item => {
        item.name.toLowerCase()
        let slug = slugify(item.name);
        let customId = slug + "-" + nanoid(5)
        newArr.push({ ...item, image: path.resolve() + item.image, slug, customId })
    })

    for (let i = 0; i < newArr.length; i++) {
        const mainCategory = await mainCategoryModel.findById(newArr[i].mainCategory)
        const category = await categoryModel.findById(newArr[i].category)
        if (!mainCategory) throw new NotFoundError("main-category not found")

        const { public_id, secure_url } = await cloudinary.uploader.upload(newArr[i].image,
            { folder: `ecom/main-categories/${mainCategory.customId}/categories/${category.customId}/sub-categories/${newArr[i].customId}` })

        finalArr.push({ ...newArr[i], image: { public_id, secure_url } })
    }

    const result = await subCategoryModel.create(finalArr)

    res.status(StatusCodes.OK).json({ response: successRes, message: "added many sub-categories", data: result })
}

// -------- delete all sub categories -------- // 
export const deleteAll = async (req, res, next) => {
    const mainCategories = await mainCategoryModel.find({});
    if (!mainCategories) throw BadRequestError("no categories found")
    for (let i = 0; i < mainCategories.length; i++) {
        // ===== Delete from cloudinary ===== // delete categories folder because categories have no images
        await cloudinary.api.delete_resources_by_prefix(`ecom/main-categories/${mainCategories[i].customId}/categories`)
        await cloudinary.api.delete_folder(`ecom/main-categories/${mainCategories[i].customId}/categories`)
    }
    await subCategoryModel.deleteMany()
    res.status(StatusCodes.OK).json({ response: successRes, messsage: 'sub-categories deleted' })
}

