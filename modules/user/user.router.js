import { Router } from 'express'
import * as uc from './controller/user.js'
import auth from './../../middlewares/auth.js';
import { validation } from './../../middlewares/validation.js';
import * as validators from './user.validation.js'

const router = Router()

//Get endpoints
router.get("/profile", auth(), validation(validators.getUserByIdValid), uc.getUser)
router.get("/all", auth(), validation(validators.getUserByIdValid), uc.getUsers)

//update endpoints
router.put("/:userId/removeadmin", validation(validators.makeRemoveAdminValid), auth(), uc.removeAdmin)
router.put("/:userId/makeadmin", validation(validators.makeRemoveAdminValid), auth(), uc.makeAdmin)


//delete endpoints
router.delete("/:userId/delete", validation(validators.deleteValid), auth(), uc.deleteUser)

export default router