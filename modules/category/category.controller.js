import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { successRes } from './../../variables.js';
import { productModel, subCategoryModel, categoryModel } from './../../db/models/index.js';

// ===== add category ===== // 
export const addCategory = async (req, res) => {
    const { name } = req.body;

    const category = await categoryModel.findOne({ name });
    if (category) throw new BadRequestError("category already exist")

    const slug = slugify(name)
    const customId = slug + "_" + nanoid(5)

    const categoryCreate = await categoryModel.create({ name, slug, customId })

    res.status(StatusCodes.OK).json({ response: successRes, message: "category created", data: categoryCreate })
}

// ===== add many category ===== // 
// export const addMany = async (req, res) => {
//     let newArr = [];
//     let finalArr = []
//     categories.map(item => {
//         item.name.toLowerCase()
//         let slug = slugify(item.name);
//         let customId = slug + "-" + nanoid(5)
//         newArr.push({ ...item, slug, customId })
//     })

//     const result = await categoryModel.create(newArr)
//     res.status(StatusCodes.OK).json({ response: successRes, message: "added many categories", data: result })
// }

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
    const categories = await categoryModel.find({})
    // let categories = []
    // const cursor = categoryModel.find().cursor()
    // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    //     const subCategories = await subCategoryModel.find({ categoryId: doc._id, })
    //     const objectCat = doc.toObject()
    //     objectCat.subCategories = subCategories
    //     categories.push(objectCat)
    // }
    res.status(StatusCodes.OK).json({ response: successRes, message: "all categories", data: categories })
}

// ===== get category ===== // 
export const getCategory = async (req, res) => {
    const { id } = req.params
    const category = await categoryModel.findById(id)

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