import { Router } from 'express'
import * as ac from './controller/auth.controller.js'
import { validation } from './../../middlewares/validation.js';
import * as validators from './auth.validation.js'


const router = Router()
//Signup endpoints
router.post("/signup", validation(validators.signUpValid), ac.signUp)

//Signin endpoints
router.post("/login", validation(validators.signInValid), ac.signIn)


export default router