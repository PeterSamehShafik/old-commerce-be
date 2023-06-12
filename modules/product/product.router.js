import { Router } from 'express'
import * as pc from './controller/product.js'
import auth from './../../middlewares/auth.js';
import { checkProfile } from './../../services/checkProfile.js';
import { validation } from './../../middlewares/validation.js';
import * as validators from './product.validation.js'

const router = Router()

//Post methods
router.post("/add", validation(validators.addProductValid), auth(), checkProfile(), pc.addProduct)
router.post("/like/:prodId", validation(validators.likeValid), auth(), pc.likeProduct)
router.post("/unlike/:prodId", validation(validators.likeValid), auth(), pc.unLikeProduct)

//Get endpoints
router.get("/all",validation(validators.headerOnlyValid), auth(), pc.allProducts)
router.get("/getProduct/:id", validation(validators.getProductByIdValid), pc.getProductById)
router.get("/search", validation(validators.searchValid), pc.searchByTitle)

//Update endpoints
router.patch("/update/:id", validation(validators.updateProductValid), auth(), pc.updateProduct)


//delete endpoints
router.delete("/delete/:id", validation(validators.idOnlyValid), auth(), pc.deleteProduct)
router.patch("/softDelete/:id", validation(validators.idOnlyValid), auth(), pc.softDelete)

export default router