import express from 'express';
import aw from '../../middleware/asyncWrapper.js';
import * as scc from './subCategory.controller.js';
import { multerCloudFunction } from '../../utils/multerCloudFun.js';
import { allowedExtensions } from '../../utils/allowedExtentions.js';
import * as validators from "./subCategory.validation.schema.js"
import { validationCoreFunction } from '../../middleware/validation.js';

const subCategoryRouter = express.Router();

subCategoryRouter.post("/add", multerCloudFunction(allowedExtensions.image).single("image"),
    validationCoreFunction(validators.addSubCategorySchema), aw(scc.addSubCategory)); // add

subCategoryRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).single("image"),
    validationCoreFunction(validators.updateSubCategorySchema), aw(scc.updateSubCategory)); // update

subCategoryRouter.delete("/:id/delete", aw(scc.deleteSubCategory)); // delete

subCategoryRouter.get("/", aw(scc.getAllSubCategories)); // get all

subCategoryRouter.get("/:id", aw(scc.getSingleSubCategory)); // get single


export default subCategoryRouter