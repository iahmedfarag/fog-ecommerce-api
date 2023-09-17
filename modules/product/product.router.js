
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import asyncWrapper from './../../middleware/asyncWrapper.js';
import * as controller from "./product.controller.js"


const productRouter = express.Router();

// ===== add product ===== // 
productRouter.post("/add", multerCloudFunction(allowedExtensions.image).array('images', 4), asyncWrapper(controller.addProduct))

// ===== delete product ===== // 
productRouter.delete("/:id/delete", asyncWrapper(controller.deleteProduct))

//! ===== get all products ===== // 
productRouter.get("/", asyncWrapper(controller.getAllProducts))

// ===== get single product ===== // 
productRouter.get("/:id/single", asyncWrapper(controller.getSingleProduct))

// ====== get featured products ====== //
productRouter.get("/best", asyncWrapper(controller.getFeaturedProducts))

// ====== get new products ====== //
productRouter.get("/new", asyncWrapper(controller.getNewProducts))

// ====== get products of subcategory ====== //
productRouter.get("/:subCategoryId/subcategory", asyncWrapper(controller.getProductsOfSubCategory))

// ====== get products filter====== //
productRouter.get("/filter", asyncWrapper(controller.getProductsFilter))




export default productRouter
