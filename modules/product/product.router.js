
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import aw from './../../middleware/asyncWrapper.js';
import * as bc from "./product.controller.js"
import { validationCoreFunction } from '../../middleware/validation.js';
import * as validators from "./product.validation.schema.js"

const productRouter = express.Router();

productRouter.post("/add", multerCloudFunction(allowedExtensions.image).array('images', 3),
    validationCoreFunction(validators.addProductSchema), aw(bc.addProduct)) // add

productRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).array('images', 3),
    validationCoreFunction(validators.updateProductSchema), aw(bc.updateProduct)) // update

productRouter.delete("/:id/delete", aw(bc.deleteProduct)) // delete

productRouter.get("/", aw(bc.getAllProducts)) // get all
productRouter.get("/:id", aw(bc.getSingleProduct)) // get single

export default productRouter
