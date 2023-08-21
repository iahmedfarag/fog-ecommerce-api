
import express from 'express';
import { multerCloudFunction } from './../../utils/multerCloudFun.js';
import { allowedExtensions } from './../../utils/allowedExtentions.js';
import aw from './../../middleware/asyncWrapper.js';
import * as bc from "./product.controller.js"


const productRouter = express.Router();

// ===== add product ===== // 
productRouter.post("/add", multerCloudFunction(allowedExtensions.image).array('images', 4), aw(bc.addProduct))

// ===== update product ===== // 
// productRouter.put("/:id/update", multerCloudFunction(allowedExtensions.image).array('images', 4),
//     validationCoreFunction(validators.updateProductSchema), aw(bc.updateProduct))

// ===== delete product ===== // 
productRouter.delete("/:id/delete", aw(bc.deleteProduct))

// ===== get all products ===== // 
productRouter.get("/", aw(bc.getAllProducts))

// ===== get single product ===== // 
productRouter.get("/:id", aw(bc.getProduct))

// ===== add many ===== //
// productRouter.post("/addMany", aw(bc.addManyProducts))

export default productRouter
