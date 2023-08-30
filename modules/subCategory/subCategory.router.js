import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper.js';
import * as controller from './subCategory.controller.js';
import { multerCloudFunction } from '../../utils/multerCloudFun.js';
import { allowedExtensions } from '../../utils/allowedExtentions.js';

const subCategoryRouter = express.Router();

// ===== add sub category ===== // 
subCategoryRouter.post("/add", multerCloudFunction(allowedExtensions.image).single("image"), asyncWrapper(controller.addSubCategory));

// ===== delete sub category ===== // 
subCategoryRouter.delete("/:id/delete", asyncWrapper(controller.deleteSubCategory));

// ===== get all sub categories ===== // 
subCategoryRouter.get("/", asyncWrapper(controller.getAllSubCategories));

// ===== get sub category ===== // 
subCategoryRouter.get("/:id", asyncWrapper(controller.getSingleSubCategory));

// ===== delete all sub categories ===== // 
subCategoryRouter.delete("/deleteAll", asyncWrapper(controller.deleteAll));

// ===== update sub category ===== // 
subCategoryRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).single("image"), asyncWrapper(controller.updateSubCategory));

// ===== get category products ===== //
subCategoryRouter.get("/:id/products", asyncWrapper(controller.getSubCategoryProducts));



export default subCategoryRouter