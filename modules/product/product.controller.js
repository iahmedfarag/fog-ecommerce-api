import slugify from "slugify";
import { customAlphabet, nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from "../../utils/cloudinaryConfig.js";
import { StatusCodes } from "http-status-codes";
import { productModel, subCategoryModel, categoryModel, mainCategoryModel } from "./../../db/models/index.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { successRes } from "../../Variables.js";

// price = price - ( price * (discount/ 100))

// ===== add product ===== //
export const addProduct = async (req, res) => {
    const { name, description, brand, price, discountPercentegeAmount, stock, soldItems, averageRating, featured, freeShipping, releaseYear, model, colors, mainCategory, category, subCategory } = req.body;

    const imagesFiles = req.files;

    // ====== general fields ======
    const slug = slugify(name);
    const customId = slug + "-" + nanoid(5);
    const customSrial = customAlphabet("1234567890", 7);
    const serial = customSrial();
    const priceAfterDiscount = price - price * (discountPercentegeAmount ? discountPercentegeAmount : 0 / 100);
    let colorsArr;
    if (colors) colorsArr = JSON.parse(colors);
    const availableItems = stock;

    // ====== check if cateogries exist ======
    const mainCategoryExist = await mainCategoryModel.findById(mainCategory);
    const categoryExist = await categoryModel.findById(category);
    const subCategoryExist = await subCategoryModel.findById(subCategory);
    if (!mainCategoryExist || !categoryExist || !subCategoryExist) throw new NotFoundError("parents not found");

    // ===== check category / maincategory relatives ======
    const subCategoryChildFromCategory = await subCategoryModel.findOne({ category });
    const categoryExistChildFromMainCategory = await categoryModel.findOne({ mainCategory });
    if (!subCategoryChildFromCategory || !categoryExistChildFromMainCategory) throw new BadRequestError("category | main cateogry not relatives");

    // ====== images =========
    let mainImage = {};
    let finalImages = [];

    for (let i = 0; i < imagesFiles.length; i++) {
        if (i === 0) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(imagesFiles[i].path, { folder: `ecom/main-categories/${mainCategoryExist.customId}/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/mainImage` });

            mainImage = { public_id, secure_url };
        }
        const { public_id, secure_url } = await cloudinary.uploader.upload(imagesFiles[i].path, { folder: `ecom/main-categories/${mainCategoryExist.customId}/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/images` });
        finalImages.push({ public_id, secure_url });
    }

    // === increase subcategory model product counts ===

    subCategoryExist.productsCount += 1;

    await subCategoryExist.save();

    // ====== final object =====
    const finalProduct = {
        name,
        description,
        brand,
        price,
        discountPercentegeAmount,
        stock,
        soldItems,
        availableItems,
        averageRating,
        featured,
        freeShipping,
        mainCategory,
        category,
        subCategory,
        releaseYear,
        model,
        colors: colorsArr,
        slug,
        customId,
        serial,
        priceAfterDiscount,
        mainImage,
        images: finalImages,
    };

    const result = await productModel.create(finalProduct);

    res.status(StatusCodes.OK).json({ response: successRes, message: "product added", data: result });
};

// ===== delete product ===== //
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) throw new NotFoundError("product not found");

    const mainCategory = await mainCategoryModel.findById(product.mainCategory);
    const category = await categoryModel.findById(product.category);
    const subCategory = await subCategoryModel.findById(product.subCategory);

    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(`ecom/main-categories/${mainCategory.customId}/categories/${category.customId}/subCategories/${subCategory.customId}/products/${product.customId}`);
    await cloudinary.api.delete_folder(`ecom/main-categories/${mainCategory.customId}/categories/${category.customId}/subCategories/${subCategory.customId}/products/${product.customId}`);

    await productModel.findByIdAndDelete(id);

    subCategory.productsCount -= 1;
    await subCategory.save();

    res.status(StatusCodes.OK).json({ res: successRes, message: "product deleted" });
};

// 20 prd // 8 // 8 8 4 // 3 pages //
// !===== get all product ===== //
export const getAllProducts = async (req, res) => {
    const query = req.query;
    const apiFeaturesInctance = new ApiFeatures(productModel.find({}), query).pagination().sort().select().filter().search();

    const products = await apiFeaturesInctance.mongooseQuery.populate([
        { path: "mainCategory", select: "name slug" },
        { path: "category", select: "name slug" },
        { path: "subCategory", select: "name slug" },
    ]);

    const allProducts = await productModel.find({});

    let pages = Math.ceil(allProducts.length / (query.limit || 8));

    res.status(StatusCodes.OK).json({ response: successRes, message: "all products", count: products.length, pages, data: products });
};

// ===== get featured products ===== //
export const getFeaturedProducts = async (req, res) => {
    const products = await productModel.find({ bestOffer: true }, "-customId").populate([
        {
            path: "mainCategory",
            select: "name slug",
        },
        {
            path: "category",
            select: "name slug",
        },
        {
            path: "subCategory",
            select: "name slug",
        },
    ]);
    res.status(StatusCodes.OK).json({ response: successRes, message: "featured products", data: products });
};

// ===== get new products ===== //
export const getNewProducts = async (req, res) => {
    const products = await productModel.find({ new: true, bestOffer: false }, "-customId").populate([
        {
            path: "mainCategory",
            select: "name slug",
        },
        {
            path: "category",
            select: "name slug",
        },
        {
            path: "subCategory",
            select: "name slug",
        },
    ]);

    res.status(StatusCodes.OK).json({ response: successRes, message: "new products", data: products });
};

// ===== get single product ===== //
export const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    const product = await productModel.findById(id, "-customId").populate([
        { path: "mainCategory", select: "name slug" },
        { path: "category", select: "name slug" },
        { path: "subCategory", select: "name slug" },
    ]);

    if (!product) throw new NotFoundError("product not found");

    const prevProduct = await productModel.findOne({ _id: { $lt: id } }, "-customId").sort({ _id: -1 });
    const nextProduct = await productModel.findOne({ _id: { $gt: id } }, "-customId").sort({ _id: 1 });

    res.status(StatusCodes.OK).json({ response: successRes, message: "single-product", data: { current: product, prevProduct, nextProduct } });
};

// ===== get products of subCategory ===== //
export const getProductsOfSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const product = await productModel.find({ subCategory: subCategoryId }, "-customId").populate([
        { path: "mainCategory", select: "name slug" },
        { path: "category", select: "name slug" },
        { path: "subCategory", select: "name slug" },
    ]);

    if (!product) throw new NotFoundError("product not found");
    res.status(StatusCodes.OK).json({ response: successRes, message: "single-product", data: product });
};

// get products filter array //
export const getProductsFilter = async (req, res) => {
    const products = await productModel.find({}, "priceAfterDiscount colors model brand releaseYear -_id");

    let filterObject = { models: [], brands: [], colors: [], releaseYear: [], prices: [] };

    products.map((prd) => {
        filterObject.prices.push(prd.priceAfterDiscount);
        filterObject.models.push(prd.model);
        filterObject.brands.push(prd.brand);
        filterObject.colors.push(...prd.colors);
        filterObject.releaseYear.push(prd.releaseYear);
    });

    const models = Array.from(new Set(filterObject.models));
    const brands = Array.from(new Set(filterObject.brands));
    const colors = Array.from(new Set(filterObject.colors));
    const releaseYear = Array.from(new Set(filterObject.releaseYear));

    const finalObject = {
        models,
        brands,
        releaseYear,
        colors,
        price: {
            min: Math.min(...filterObject.prices),
            max: Math.max(...filterObject.prices),
        },
    };

    res.status(200).json({ message: successRes, data: finalObject });
};
