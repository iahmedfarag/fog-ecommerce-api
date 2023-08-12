import joi from 'joi'

export const addSubCategorySchema = {
    body: joi
        .object({
            name: joi.string().min(4).max(20),
            categoryId: joi.string()
        })
        .required()
        .options({ presence: 'required' }),
}
export const updateSubCategorySchema = {
    body: joi
        .object({
            name: joi.string().min(4).max(20),
        }).required().options({ presence: 'required' })
}
