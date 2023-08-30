import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { successRes } from './../../variables.js';
import { productModel, subCategoryModel, categoryModel, mainCategoryModel } from './../../db/models/index.js';

// ===== add category ===== // 
export const addCategory = async (req, res) => {
    const { name, mainCategory } = req.body;

    const mainCategoryExist = await mainCategoryModel.findById(mainCategory)
    if (!mainCategory) throw new NotFoundError("main-category not found")

    const category = await categoryModel.findOne({ name });
    if (category) throw new BadRequestError("category already exist")

    const slug = slugify(name.toLowerCase())
    const customId = slug + "_" + nanoid(5)

    const categoryCreate = await categoryModel.create({ name, slug, customId, mainCategory })

    res.status(StatusCodes.OK).json({ response: successRes, message: "category created", data: categoryCreate })
}


// ===== delete category ===== // 
export const deleteCategory = async (req, res) => {
    const { id } = req.params
    const category = await categoryModel.findById(id)
    if (!category) throw new BadRequestError("invalid category id")

    await categoryModel.findByIdAndDelete(id)
    res.status(StatusCodes.OK).json({ response: successRes, messsage: 'category deleted' })
}

// ===== delete all categories ===== // 
export const deleteAll = async (req, res) => {
    const categoryies = await categoryModel.find({});
    if (!categoryies) throw BadRequestError("no categories found")
    for (let i = 0; i < categoryies.length; i++) {
        categoryies[i].deleteOne();
    }
    res.status(StatusCodes.OK).json({ response: successRes, messsage: 'categories deleted' })
}

// ===== get all categories ===== // 
export const getAllCategories = async (req, res) => {
    const categories = await categoryModel.find({}, '-customId').populate({
        path: 'mainCategory'
    })
    res.status(StatusCodes.OK).json({ response: successRes, message: "all categories", data: categories })
}

// ===== get category ===== // 
export const getCategory = async (req, res) => {
    const { id } = req.params
    const category = await categoryModel.findById(id, '-customId').populate({
        path: "mainCategory"
    })

    if (!category) throw new NotFoundError("category not found")

    res.status(StatusCodes.OK).json({ response: successRes, message: "single category", data: category })
}

// ===== update category ===== // 
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryModel.findById(id);
    if (!category) throw new NotFoundError("category not found");
    const isNameUnq = await categoryModel.findOne({ name: name.toLowerCase() })
    if (name.toLowerCase() === category.name || isNameUnq) throw new BadRequestError("choose another category name please!")
    category.name = name;
    await category.save();
    res.status(StatusCodes.OK).json({ response: successRes, message: 'category updated', category })
}