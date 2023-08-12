
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import aw from './../../middleware/asyncWrapper.js';
import * as bc from "./brand.controller.js"
import { validationCoreFunction } from '../../middleware/validation.js';
import * as validators from "./brand.validation.schema.js"

const brandRouter = express.Router();

brandRouter.post("/add", multerCloudFunction(allowedExtensions.image).single('logo'),
    validationCoreFunction(validators.addBrandSchema), aw(bc.addBrand)); // add

brandRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).single('logo'),
    validationCoreFunction(validators.updateBrandSchema), aw(bc.updateBrand)); // update

brandRouter.delete("/:id/delete", aw(bc.deleteBrand)); // delete

brandRouter.get("/", aw(bc.getAllBrands)); // get all

brandRouter.get("/:id", aw(bc.getSingleBrand)); // get single




export default brandRouter
