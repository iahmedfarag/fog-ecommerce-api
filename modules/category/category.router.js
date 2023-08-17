
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import asyncWrapper from './../../middleware/asyncWrapper.js';
import * as controller from "./category.controller.js"
import * as validators from "./category.validation.schema.js"
import { validationCoreFunction } from '../../middleware/validation.js';
const categoryRouter = express.Router();


// ===== add category ===== //
categoryRouter.post("/add", multerCloudFunction(allowedExtensions.image).single('icon'),
    validationCoreFunction(validators.addCategorySchema), asyncWrapper(controller.addCategory))

// ===== add many categories ===== //
categoryRouter.post("/addMany", asyncWrapper(controller.addMany))

// ===== delete category ===== //
categoryRouter.delete("/:id/delete", asyncWrapper(controller.deleteCategory))

// ===== delete all categories ===== //
categoryRouter.delete("/deleteAll", asyncWrapper(controller.deleteAll))

// ===== get all categories ===== //
categoryRouter.get("/", asyncWrapper(controller.getAllCategories))

// ===== add single category ===== //
categoryRouter.get("/:id", asyncWrapper(controller.getCategory))

// ===== update category ===== //
categoryRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).single('icon'),
    validationCoreFunction(validators.updateCategorySchema), asyncWrapper(controller.updateCategory))



export default categoryRouter
