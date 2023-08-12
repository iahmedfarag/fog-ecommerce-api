import { config } from "dotenv"
config()
import express from "express"
import connectFun from './db/dbConnection.js';
import errorHandler from "./middleware/errorHandler.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import { categoryRouter, subCategoryRouter } from "./modules/index.js";
import brandRouter from "./modules/brand/brand.router.js";
import productRouter from "./modules/product/product.router.js";
import cors from "cors"
//
const app = express()
app.use(express.json())
app.use(cors())
// routers
app.get('/', (req, res) => res.send('<h6>ecom website</h6>'))
app.use("/categories", categoryRouter)
app.use("/subcategories", subCategoryRouter)
app.use("/brands", brandRouter)
app.use("/products", productRouter)

// middlewares
// app.use("*", notFoundMiddleware)
app.use(errorHandler)

// start func
const start = async () => {
    try {
        await connectFun(process.env.MONGO_URL)
        console.log('db connected')
        app.listen(Number(process.env.PORT), () => console.log(`Example app listening on port ${Number(process.env.PORT)}!`))
    } catch (error) {
        console.log(error, "erorrrrrrrrrrxxrrr")
    }
}
start()