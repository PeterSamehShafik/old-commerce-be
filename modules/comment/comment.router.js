import { Router } from 'express'
import * as cc from './controller/comment.js'
import auth from './../../middlewares/auth.js';
import { validation } from './../../middlewares/validation.js';
import * as validators from './comment.validation.js'

const router = Router()

// post methods
router.post("/add/:prodId", validation(validators.addCommentValid), auth(), cc.addComment)

// update methods
router.patch("/update/:commentId", validation(validators.updateCommentValid), auth(), cc.updateComment)

// Delete methods
router.patch("/softDelete/:commentId",validation(validators.softDeleteValid), auth(), cc.softDeleted)

export default router