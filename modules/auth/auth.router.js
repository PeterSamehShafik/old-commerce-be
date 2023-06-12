import { Router } from 'express'
import * as ac from './controller/auth.controller.js'
import { validation } from './../../middlewares/validation.js';
import * as validators from './auth.validation.js'


const router = Router()
//Signup endpoints
router.post("/signup", validation(validators.signUpValid), ac.signUp)
router.get("/confirmEmail/:token", validation(validators.checkTokenValid), ac.confirmEmail)
router.get("/refreshToken/:token", validation(validators.checkTokenValid), ac.refreshToken)

//Signin endpoints
router.post("/signin", validation(validators.signInValid), ac.signIn)

//Forgot password endpoints
router.post("/sendCode", validation(validators.sendCodeValid), ac.sendCode)
router.post("/resetPassword", validation(validators.resetPasswordValid), ac.resetPassword)

export default router