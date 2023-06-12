import joi from 'joi'


export const addProductValid = {
    body: joi.object().required().keys({
        title: joi.string().min(1).max(20).required(),
        description: joi.string().min(1).max(200).required(),
        price: joi.number().min(1).required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const headerOnlyValid = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const updateProductValid = {
    body: joi.object().required().keys({
        title: joi.string().min(1).max(20).required(),
        description: joi.string().min(1).max(200).required(),
        price: joi.number().min(1).required()
    }),
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24)
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const idOnlyValid = {
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24)
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}
export const getProductByIdValid = {
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24)
    })
}

export const likeValid = {
    params: joi.object().required().keys({
        prodId: joi.string().min(24).max(24)
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}
export const searchValid = {
    query: joi.object().required().keys({
        title: joi.string().min(1).max(200)
    })
}
