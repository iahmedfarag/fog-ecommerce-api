import { config } from "dotenv"
config()
import express from "express"
import connectFun from './db/dbConnection.js';
import errorHandler from "./middleware/errorHandler.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import cors from "cors"
import { categoryRouter, mainCategoryRouter, productRouter, subCategoryRouter } from "./modules/index.router.js";


//
const app = express()
app.use(express.json())
app.use(cors())

// routers
app.get('/', (req, res) => res.send('<h6>ecom website</h6>'))
app.use("/categories", categoryRouter)
app.use("/subcategories", subCategoryRouter)
app.use("/products", productRouter)
app.use("/mainCategories", mainCategoryRouter)

// middlewares
app.use("*", notFoundMiddleware)
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