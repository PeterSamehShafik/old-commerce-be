const dataMethods = ['body', 'params', 'headers', 'query']

export const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = []
        dataMethods.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult?.error?.details) {
                    validationErrors.push(validationResult.error.details)
                }
            }
        });

        if (validationErrors.length) {
            res.status(400).json({ message: "validation Error", validationErrors })
        } else {
            next()
        }


    }
}