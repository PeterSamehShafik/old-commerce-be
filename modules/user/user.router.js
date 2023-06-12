import { Router } from 'express'
import * as uc from './controller/user.js'
import auth from './../../middlewares/auth.js';
import { validation } from './../../middlewares/validation.js';
import * as validators from './user.validation.js'

const router = Router()

//Get endpoints
router.get("/profile/:id", validation(validators.getUserByIdValid), uc.getUserById)
router.get("/all", uc.getUsersWithProducts) // no validation

//update endpoints
router.patch("/updateUser", validation(validators.updateUserValid), auth(), uc.updateProfile)
router.patch("/updatePassword", validation(validators.updatePasswordValid), auth(), uc.updatePassword)

//signout
router.post("/signOut", validation(validators.headerOnlyValid), auth(), uc.signOut)


//delete endpoints
router.patch("/softDelete", validation(validators.headerOnlyValid), auth(), uc.softDelete)

//admin role
router.patch("/block/:id", validation(validators.idOnlyValid), auth(), uc.blockUser)
router.patch("/unblock/:id", validation(validators.idOnlyValid), auth(), uc.unBlockUser)

export default router