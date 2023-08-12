import joi from 'joi'


export const addProductSchema = {
    body: joi
        .object({
            name: joi.string().required(),
            price: joi.string().required(),
            description: joi.string(),
            // colors: joi.string().required(),
            colors: joi.alternatives().try(
                joi.string(),
                joi.array()
            ),
            sizes: joi.alternatives().try(
                joi.string(),
                joi.array()
            ),
            categoryId: joi.string().required(),
            subCategoryId: joi.string().required(),
            brandId: joi.string().required(),
            soldItems: joi.number().optional(),
            discount: joi.number().optional()
        })
        .required()
}
export const updateProductSchema = {
    body: joi
        .object({
            name: joi.string().required(),
            price: joi.string().required(),
            description: joi.string(),
            // colors: joi.string().required(),
            colors: joi.alternatives().try(
                joi.string(),
                joi.array()
            ),
            sizes: joi.alternatives().try(
                joi.string(),
                joi.array()
            ),
            categoryId: joi.string().required(),
            subCategoryId: joi.string().required(),
            brandId: joi.string().required(),
            soldItems: joi.number().optional(),
            discount: joi.number().optional()
        })
        .required()
}
