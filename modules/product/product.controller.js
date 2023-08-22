import slugify from "slugify";
import { customAlphabet, nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from "../../utils/cloudinaryConfig.js";
import { StatusCodes } from "http-status-codes";
import { badRes, successRes } from "../../variables.js";
import { productModel, subCategoryModel, categoryModel, mainCategoryModel } from './../../db/models/index.js';

// price = price - ( price * (discount/ 100))

// ===== add product ===== //
export const addProduct = async (req, res) => {
    const { name, description, brand, price, discountPercentegeAmount,
        stock, soldItems, averageRating, featured, freeShipping,
        releaseYear, model, colors,
        mainCategory, category, subCategory } = req.body

    const imagesFiles = req.files

    // ====== general fields ======
    const slug = slugify(name);
    const customId = slug + "-" + nanoid(5);
    const customSrial = customAlphabet('1234567890', 7)
    const serial = customSrial()
    const priceAfterDiscount = price - (price * (discountPercentegeAmount ? discountPercentegeAmount : 0 / 100))
    let colorsArr
    if (colors) colorsArr = JSON.parse(colors)
    const availableItems = stock

    // ====== check if cateogries exist ======
    const mainCategoryExist = await mainCategoryModel.findById(mainCategory)
    const categoryExist = await categoryModel.findById(category)
    const subCategoryExist = await subCategoryModel.findById(subCategory)
    if (!mainCategoryExist || !categoryExist || !subCategoryExist) throw new NotFoundError("parents not found")

    // ===== check category / maincategory relatives ======
    const subCategoryChildFromCategory = await subCategoryModel.findOne({ category })
    const categoryExistChildFromMainCategory = await categoryModel.findOne({ mainCategory })
    if (!subCategoryChildFromCategory || !categoryExistChildFromMainCategory) throw new BadRequestError("category | main cateogry not relatives")

    // ====== images =========
    let mainImage = {}
    let finalImages = []

    for (let i = 0; i < imagesFiles.length; i++) {
        if (i === 0) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(imagesFiles[i].path,
                { folder: `ecom/main-categories/${mainCategoryExist.customId}/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/mainImage` })

            mainImage = { public_id, secure_url }
        }
        const { public_id, secure_url } = await cloudinary.uploader.upload(imagesFiles[i].path,
            { folder: `ecom/main-categories/${mainCategoryExist.customId}/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/images` })
        finalImages.push({ public_id, secure_url })

    }

    // === increase subcategory model product counts === 

    subCategoryExist.productsCount += 1

    await subCategoryExist.save()

    // ====== final object =====
    const finalProduct = {
        name, description, brand, price, discountPercentegeAmount,
        stock, soldItems, availableItems, averageRating, featured, freeShipping,
        mainCategory, category, subCategory,
        releaseYear, model, colors: colorsArr,
        slug,
        customId,
        serial,
        priceAfterDiscount,
        mainImage,
        images: finalImages
    }

    const result = await productModel.create(finalProduct);

    res.status(StatusCodes.OK).json({ response: successRes, message: "product added", data: result })
}

// ===== delete product ===== //
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) throw new NotFoundError('product not found');

    const mainCategory = await mainCategoryModel.findById(product.mainCategory);
    const category = await categoryModel.findById(product.category);
    const subCategory = await subCategoryModel.findById(product.subCategory);

    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(`ecom/main-categories/${mainCategory.customId}/categories/${category.customId}/subCategories/${subCategory.customId}/products/${product.customId}`,)
    await cloudinary.api.delete_folder(`ecom/main-categories/${mainCategory.customId}/categories/${category.customId}/subCategories/${subCategory.customId}/products/${product.customId}`,)

    await productModel.findByIdAndDelete(id)

    subCategory.productsCount -= 1
    await subCategory.save();

    res.status(StatusCodes.OK).json({ res: successRes, message: "product deleted" })
}

// ===== get all product ===== //
export const getAllProducts = async (req, res) => {
    const products = await productModel.find({}).populate([
        {
            path: "mainCategory",
            select: "name slug"
        },
        {
            path: "category",
            select: "name slug"
        },
        {
            path: "subCategory",
            select: "name slug"
        },
    ])
    res.status(StatusCodes.OK).json({ response: successRes, message: "all products", data: products })
}

// ===== get featured products ===== //
export const getFeaturedProducts = async (req, res) => {
    const products = await productModel.find({ bestOffer: true })
    res.status(StatusCodes.OK).json({ response: successRes, message: "featured products", data: products })
}
