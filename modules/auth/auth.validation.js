import joi from "joi";

export const signUpValid = {
    body: joi.object().required().keys({
        firstName: joi.string().min(2).max(20).required(),
        lastName: joi.string().min(2).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string(). //Minimum eight characters, at least one letter and one number:
            pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$")).required().messages({
                'string.pattern.base': "password must be Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
            }),
        age: joi.number().min(18).max(99),

    })
}

export const signInValid = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().min(1).max(30).required()
    })
}