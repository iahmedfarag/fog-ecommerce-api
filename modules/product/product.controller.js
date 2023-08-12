import slugify from "slugify";
import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from "../../utils/cloudinaryConfig.js";
import { StatusCodes } from "http-status-codes";
import { badRes, successRes } from "../../variables.js";
import { brandModel, productModel, subCategoryModel, categoryModel } from './../../db/models/index.js';

// price = price - ( price * (discount/ 100))
export const addProduct = async (req, res, next) => {
  const { name, description, price, discount, colors, sizes, soldItems, categoryId, subCategoryId, brandId } = req.body;
  const images = req.files;

  const isSubCategoryValid = await subCategoryModel.findOne({ categoryId });
  const isBrandValid = await brandModel.findOne({ subCategoryId, categoryId });
  const category = await categoryModel.findById(categoryId);

  if (!isSubCategoryValid || !isBrandValid) {
    throw new BadRequestError("invalid sub-category | brand");
  }

  if (!images) {
    throw new BadRequestError("upload images");
  }

  let stock = 0;

  let newColors;
  let newSizes;
  if (typeof colors === "object") {
    newColors = colors.map((color) => JSON.parse(color));
    newColors.map((color) => (stock += color.count));
  }
  if (typeof colors === "string") {
    newColors = JSON.parse(colors);
    stock = newColors.count;
  }
  let sizesCount = 0;
  if (typeof sizes === "object") {
    newSizes = sizes.map((size) => JSON.parse(size));
    newSizes.map((size) => (sizesCount += size.count));
  }
  if (typeof sizes === "string") {
    newSizes = JSON.parse(sizes);
    sizesCount = newSizes.count;
  }

  if (stock !== sizesCount) {
    throw new BadRequestError("products count don't match");
  }

  const priceAfterDiscount = price - price * (discount || 0 / 100);

  const slug = slugify(name);

  //   images;
  const customId = slug + "_" + nanoid(5);
  let imagesArr = [];
  let publicIds = [];

  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path, { folder: `ecom/categories/${category.customId}/subCategories/${isSubCategoryValid.customId}/brands/${isBrandValid.customId}/products/${customId}`, }
    );
    imagesArr.push({ secure_url, public_id });
    publicIds.push(public_id);
  }

  // final object
  const productObj = {
    name, description, price, discount, priceAfterDiscount, stock, colors: newColors, sizes: newSizes, soldItems, categoryId,
    subCategoryId, brandId, slug, customId, images: imagesArr,
  };

  const productCreate = await productModel.create(productObj);
  if (!productCreate) {
    await cloudinary.api.delete_resources(publicIds);
    throw new BadRequestError("try again please");
  }

  res.status(StatusCodes.CREATED).json({ response: successRes, message: "product created", productCreate });
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params
  const { name, description, price, discount, colors, sizes, soldItems, categoryId, subCategoryId, brandId } = req.body;
  const images = req.files;

  const product = await productModel.findById(id);

  if (!product) {
    throw new NotFoundError("product not found")
  }

  const isSubCategoryValid = await subCategoryModel.findOne({ categoryId });
  const isBrandValid = await brandModel.findOne({ subCategoryId, categoryId });
  const category = await categoryModel.findById(categoryId);
  const subCategory = await subCategoryModel.findById(subCategoryId)
  const brand = await brandModel.findById(brandId)

  if (!isSubCategoryValid || !isBrandValid) {
    throw new BadRequestError("invalid sub-category | brand");
  }


  let stock = 0;

  let newColors;
  let newSizes;
  if (typeof colors === "object") {
    newColors = colors.map((color) => JSON.parse(color));
    newColors.map((color) => (stock += color.count));
  }
  if (typeof colors === "string") {
    newColors = JSON.parse(colors);
    stock = newColors.count;
  }
  let sizesCount = 0;
  if (typeof sizes === "object") {
    newSizes = sizes.map((size) => JSON.parse(size));
    newSizes.map((size) => (sizesCount += size.count));
  }
  if (typeof sizes === "string") {
    newSizes = JSON.parse(sizes);
    sizesCount = newSizes.count;
  }

  if (stock !== sizesCount) {
    throw new BadRequestError("products count don't match");
  }

  const priceAfterDiscount = price - price * (discount || 0 / 100);

  const slug = slugify(name);

  //   images;
  const customId = slug + "_" + nanoid(5);
  let imagesArr = [];
  let publicIds = [];
  if (images) {
    //=========== Delete from cloudinary ==============
    await cloudinary.api.delete_resources_by_prefix(
      `ecom/categories/${category.customId}/subCategories/${subCategory.customId}/brands/${brand.customId}/products/${product.customId}`,
    )
    await cloudinary.api.delete_folder(
      `ecom/categories/${category.customId}/subCategories/${subCategory.customId}/brands/${brand.customId}/products/${product.customId}`,
    )

    //=========== add again to cloudinary ==============

    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path, { folder: `ecom/categories/${category.customId}/subCategories/${subCategory.customId}/brands/${brand.customId}/products/${customId}`, }
      );
      imagesArr.push({ secure_url, public_id });
      publicIds.push(public_id);
    }
  }


  // final object
  const productObj = {
    name, description, price, discount, priceAfterDiscount, stock, colors: newColors, sizes: newSizes, soldItems, categoryId,
    subCategoryId, brandId, slug, customId, images: imagesArr,
  };

  const productUpdate = await productModel.findByIdAndUpdate(id, productObj);

  res.status(StatusCodes.CREATED).json({ response: successRes, message: "product updated", productUpdate });
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params
  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("product not found")
  }
  const category = await categoryModel.findById(product.categoryId);
  const subCategory = await subCategoryModel.findById(product.subCategoryId)
  const brand = await brandModel.findById(product.brandId)
  console.log(brand)
  await cloudinary.api.delete_resources_by_prefix(
    `ecom/categories/${category.customId}/subCategories/${subCategory.customId}/brands/${brand.customId}/products/${product.customId}`,
  )

  await cloudinary.api.delete_folder(
    `ecom/categories/${category.customId}/subCategories/${subCategory.customId}/brands/${brand.customId}/products/${product.customId}`,
  )

  await productModel.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ response: successRes, message: "product deleted" });
};

export const getAllProducts = async (req, res) => {
  const products = await productModel.find({})

  return res.status(StatusCodes.OK).json({ response: successRes, message: "all products", products })
}

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id)
  if (!product) {
    throw new NotFoundError("not found product")
  }
  return res.status(StatusCodes.OK).json({ response: successRes, message: "single product", product })
}