import jwt from 'jsonwebtoken'
import userModel from './../DB/models/user.model.js';

const auth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers
            if (authorization?.startsWith(process.env.loginTokenBearer)) {
                const token = authorization.split(process.env.loginTokenBearer)[1]
                const decoded = jwt.verify(token, process.env.loginTokenSign)
                if (decoded?.user) {
                    req.user = decoded.user
                    next()
                } else {
                    res.status(401).json({ message: "in-valid token payload" })
                }
            } else {
                req.status(401).json({ message: "in-valid bearer key" })
            }
        } catch (error) {
            res.status(500).json({ message: "catch err in auth.js", error })
        }
    }
}

export default auth