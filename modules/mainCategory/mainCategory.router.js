
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import asyncWrapper from './../../middleware/asyncWrapper.js';
import * as controller from "./mainCategory.controller.js"

const mainCategoryRouter = express.Router();


// ===== add ===== //
mainCategoryRouter.post("/add", multerCloudFunction(allowedExtensions.image).single('icon'), asyncWrapper(controller.addMainCategory))

// ===== delete main-category ===== //
mainCategoryRouter.delete("/delete/:id", asyncWrapper(controller.deleteMainCategory))

// ===== add many main-cateogries ===== //
// mainCategoryRouter.post("/addMany", asyncWrapper(controller.addManyMainCategories))

// ===== get main-category ===== //
mainCategoryRouter.get("/:id", asyncWrapper(controller.getMainCategory))

// ===== get all main-categories ===== //
mainCategoryRouter.get("/", asyncWrapper(controller.getAllMainCategories))

// ===== delete all main-categories ===== //
mainCategoryRouter.delete("/deleteAll", asyncWrapper(controller.deleteAllMainCategories))

export default mainCategoryRouter
