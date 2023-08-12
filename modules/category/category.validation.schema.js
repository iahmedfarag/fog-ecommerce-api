import joi from 'joi'


export const addCategorySchema = {
    body: joi
        .object({
            name: joi.string().min(4).max(20),
        })
        .required()
        .options({ presence: 'required' }),
}

export const updateCategorySchema = {
    body: joi
        .object({
            name: joi.string().min(4).max(20).optional(),
        })
        .required(),
}
