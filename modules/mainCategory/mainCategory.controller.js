import slugify from "slugify";
import mainCategoryModel from "../../db/models/mainCategory.model.js";
import { successRes } from './../../variables.js';
import { nanoid } from "nanoid";
import cloudinary from './../../utils/cloudinaryConfig.js';
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import { StatusCodes } from "http-status-codes";
import mainCategories from "../../data/mainCategories.json" assert { type: "json" };
import path from 'path'


// ===== add main-category ===== //
export const addMainCategory = async (req, res) => {
    const { name } = req.body;
    const icon = req.file;
    const mainCategory = await mainCategoryModel.findOne({ name });

    if (mainCategory) throw new BadRequestError("main-category already exist")
    if (!icon) return new BadRequestError("upload photo for category please")

    const slug = slugify(name)
    const customId = slug + "-" + nanoid(4)
    const { public_id, secure_url } = await cloudinary.uploader.upload(icon.path, { folder: `ecom/main-categories/${customId}` })

    const finalObject = { name, slug, icon: { secure_url, public_id, }, customId, }

    const mainCategoryCreate = await mainCategoryModel.create(finalObject)

    if (!mainCategoryCreate) {
        await cloudinary.uploader.destroy(public_id)
        throw new BadRequestError("try again please")
    }
    res.status(StatusCodes.OK).json({ response: successRes, message: "main-category created", data: mainCategoryCreate })
}

// ===== add many ===== //
export const addManyMainCategories = async (req, res) => {
    let newArr = [];
    let finalArr = []
    mainCategories.map(item => {
        item.name.toLowerCase()
        let slug = slugify(item.name);
        let customId = slug + "-" + nanoid(5)
        newArr.push({ ...item, icon: path.resolve() + item.icon, slug, customId })
    })
    for (let i = 0; i < newArr.length; i++) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(newArr[i].icon, { folder: `ecom/main-categories/${newArr[i].customId}` })
        finalArr.push({ ...newArr[i], icon: { public_id, secure_url } })
    }
    const result = await mainCategoryModel.create(finalArr)
    res.status(StatusCodes.OK).json({ response: successRes, message: "added many main-categories", data: result })
}

// ===== get single ===== //
export const getMainCategory = async (req, res) => {
    const { id } = req.params;
    const mainCategory = await mainCategoryModel.findById(id);
    res.status(StatusCodes.OK).json({ response: successRes, message: "main-category", data: mainCategory })
}

// ===== get all ===== //
export const getAllMainCategories = async (req, res) => {
    const mainCategories = await mainCategoryModel.find({});
    res.status(StatusCodes.OK).json({ response: successRes, message: "all main-categories", data: mainCategories })
}

// ===== delete category ===== //
export const deleteMainCategory = async (req, res) => {
    console.log("hi")
    const { id } = req.params;
    const mainCategory = await mainCategoryModel.findById(id)
    if (!mainCategory) throw new NotFoundError("main-category not-found")
    await mainCategoryModel.findByIdAndDelete(id)
    // delete from cloudinary
    await cloudinary.api.delete_resources_by_prefix(`ecom/main-categories/${mainCategory.customId}`)
    await cloudinary.api.delete_folder(`ecom/main-categories/${mainCategory.customId}`)
    res.status(StatusCodes.OK).json({ response: successRes, message: "main-category deleted" })
}

// ===== delete all ===== //
export const deleteAllMainCategories = async (req, res) => {
    const mainCategories = await mainCategoryModel.find({});
    if (!mainCategories) throw BadRequestError("no categories found")
    for (let i = 0; i < mainCategories.length; i++) {
        // ===== Delete from cloudinary =====
        await cloudinary.api.delete_resources_by_prefix(`ecom/main-categories/${mainCategories[i].customId}`,)
        await cloudinary.api.delete_folder(`ecom/main-categories/${mainCategories[i].customId}`,)
        // ===== Delete from DB =====
        mainCategories[i].deleteOne();
    }
    res.status(StatusCodes.OK).json({ response: successRes, messsage: 'categories deleted' })
}