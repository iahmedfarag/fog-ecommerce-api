import joi from 'joi'


export const addMainCategorySchema = {
    body: joi
        .object({
            name: joi.string().min(4).max(20),
            icon: joi.string()
        })
        .required()
        .options({ presence: 'required' }),
}
