
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import aw from './../../middleware/asyncWrapper.js';
import * as cc from "./category.controller.js"
import * as validators from "./category.validation.schema.js"
import { validationCoreFunction } from '../../middleware/validation.js';
const categoryRouter = express.Router();

categoryRouter.post("/add", multerCloudFunction(allowedExtensions.image).single('image'), validationCoreFunction(validators.addCategorySchema), aw(cc.addCategory)) // add
categoryRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).single('image'), validationCoreFunction(validators.updateCategorySchema), aw(cc.updateCategory)) // update
categoryRouter.delete("/:id/delete", aw(cc.deleteCategory)) // delete
categoryRouter.get("/", aw(cc.getAllCategories)) // get all
categoryRouter.get("/:id", aw(cc.getCategory)) // get single

export default categoryRouter
