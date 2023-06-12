import joi from 'joi'

export const addCommentValid = {
    body: joi.object().required().keys({
        commentBody: joi.string().min(1).max(300).required()
    }),
    params: joi.object().required().keys({
        prodId: joi.string().min(24).max(24).required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const updateCommentValid = {
    body: joi.object().required().keys({
        commentBody: joi.string().min(1).max(300).required()
    }),
    params: joi.object().required().keys({
        commentId: joi.string().min(24).max(24).required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const softDeleteValid = {
    params: joi.object().required().keys({
        commentId: joi.string().min(24).max(24).required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}
