
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import asyncWrapper from './../../middleware/asyncWrapper.js';
import * as controller from "./category.controller.js"

const categoryRouter = express.Router();


// ===== add category ===== //
categoryRouter.post("/add", multerCloudFunction(allowedExtensions.image).single('icon'), asyncWrapper(controller.addCategory))


// ===== delete category ===== //
categoryRouter.delete("/:id/delete", asyncWrapper(controller.deleteCategory))

// ===== delete all categories ===== //
categoryRouter.delete("/deleteAll", asyncWrapper(controller.deleteAll))

// ===== get all categories ===== //
categoryRouter.get("/", asyncWrapper(controller.getAllCategories))

// ===== add single category ===== //
categoryRouter.get("/:id", asyncWrapper(controller.getCategory))

// ===== update category ===== //
categoryRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).single('icon'), asyncWrapper(controller.updateCategory))



export default categoryRouter
