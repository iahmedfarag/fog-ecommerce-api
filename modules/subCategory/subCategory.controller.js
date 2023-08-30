import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from "../../utils/cloudinaryConfig.js";
import slugify from 'slugify';
import { StatusCodes } from "http-status-codes";
import { successRes } from "../../variables.js";
import { productModel, subCategoryModel, categoryModel, mainCategoryModel } from './../../db/models/index.js';


// ===== add sub category ===== // 
export const addSubCategory = async (req, res, next) => {
    const { name, featured, category, mainCategory } = req.body;
    const image = req.file

    // const subCategory = await subCategoryModel.findOne({ name: name.toLowerCase() });
    // if (subCategory) throw new BadRequestError("choose another name!")

    const categoryExist = await categoryModel.findById(category);
    const mainCategoryExist = await mainCategoryModel.findById(mainCategory);

    if (!categoryExist) throw new NotFoundError("cateogry not found!")
    if (!mainCategoryExist) throw new NotFoundError("main-cateogry not found!")

    const categoryChildFromMain = await categoryModel.findOne({ mainCategory })
    if (!categoryChildFromMain) throw new BadRequestError("category not child from main-category")

    const slug = slugify(name.toLowerCase())
    const customId = slug + "_" + nanoid(5)
    const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, {
        folder: `ecom/main-categories/${mainCategoryExist.customId}/categories/${categoryExist.customId}/subCategories/${customId}`
    })

    const subCategoryObj = { name, slug, featured, customId, image: { public_id, secure_url }, category, mainCategory }
    const subCategoryCreate = await subCategoryModel.create(subCategoryObj)

    if (!subCategoryCreate) {
        await cloudinary.uploader.destroy(public_id)
        throw new BadRequestError("try again please")
    }
    res.status(StatusCodes.CREATED).json({ response: successRes, message: "subCategory created", data: subCategoryCreate })
}


// ===== update sub category ===== // 
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


// ===== delete sub category ===== // 
export const deleteSubCategory = async (req, res) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id)
    if (!subCategory) throw new NotFoundError("sub category not found")
    const category = await categoryModel.findById(subCategory.category)
    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(`ecom/categories/${category.customId}/subCategories/${subCategory.customId}`,)
    await cloudinary.api.delete_folder(`ecom/categories/${category.customId}/subCategories/${subCategory.customId}`,)
    //=========== Delete from DB ==============
    const deleteRelatedProducts = await productModel.deleteMany({ subCategoryId: id })

    res.status(StatusCodes.OK).json({ response: successRes, message: "sub category deleted" })
}


// ===== get all sub categories ===== // 
export const getAllSubCategories = async (req, res) => {
    const subCategories = await subCategoryModel.find({}, '-customId').populate([
        {
            path: 'mainCategory'
        }, {
            path: 'category'
        }
    ])

    res.status(StatusCodes.OK).json({ response: successRes, message: "get all sub categoris", data: subCategories })
}


// ===== get sub category ===== // 
export const getSingleSubCategory = async (req, res) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id, '-customId').populate([
        {
            path: 'mainCategory'
        }, {
            path: 'category'
        }
    ])
    if (!subCategory) throw new NotFoundError("not found subCategory")

    res.status(StatusCodes.OK).json({ response: successRes, message: "single category", data: subCategory })
}


// ===== delete all sub categories ===== // 
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


// ===== get category products ===== //
export const getSubCategoryProducts = async (req, res) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.find({}).populate([
        { path: "category" },
        { path: "mainCategory" },
        { path: "products" },
    ])

    res.status(200).json({ res: "dddd", data: subCategory })
}