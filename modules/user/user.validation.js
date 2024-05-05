import joi from 'joi'


export const idOnlyValid = {
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24)
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const getUserByIdValid = {
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24)
    }),

}

export const makeRemoveAdminValid = {
    body: joi.object().required().keys({
        role: joi.string().valid("admin", "user")
    }),
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24)
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}
export const updateUserValid = {
    body: joi.object().required().keys({
        firstName: joi.string().min(2).max(20).required(),
        lastName: joi.string().min(2).max(20).required(),
        phone: joi.string().min(4).max(12),
        address: joi.string().min(4).max(30),
        age: joi.number().min(18).max(99),
        gender: joi.string().valid("male", "female")
    }),
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24)
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const updatePasswordValid = {
    body: joi.object().required().keys({
        oldPassword: joi.string(). //Minimum eight characters, at least one letter and one number:
            pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$")).required().messages({
                'string.pattern.base': "password must be Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
            }),
        newPassword: joi.string(). //Minimum eight characters, at least one letter and one number:
            pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$")).required().messages({
                'string.pattern.base': "password must be Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
            }),
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
export const deleteValid = {
    params: joi.object().required().keys({
        userId: joi.string().min(24).max(24)
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}