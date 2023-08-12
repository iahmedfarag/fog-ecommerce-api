import joi from 'joi'

export const addBrandSchema = {
    body: joi.object({
        name: joi.string().min(4).max(20),
        categoryId: joi.string(),
        subCategoryId: joi.string()
    }).required()
        .options({ presence: 'required' }),
    // query: joi.object({
    // })
}
export const updateBrandSchema = {
    body: joi.object({
        name: joi.string().min(4).max(20),
        categoryId: joi.string(),
        subCategoryId: joi.string()
    }).required()
        .options({ presence: 'required' }),
    // query: joi.object({
    // })
}
