import { Router } from 'express'
import * as pc from './controller/product.js'
import auth from './../../middlewares/auth.js';
import { validation } from './../../middlewares/validation.js';
import * as validators from './product.validation.js'

const router = Router()

//get methods
router.get("/all", pc.allProducts)
router.get("/user", validation(validators.getUserProducts), auth(), pc.userProducts)

//Post methods
router.post("/add", validation(validators.addProductValid), auth(), pc.addProduct)



//delete endpoints
router.delete("/:productId/delete", validation(validators.idOnlyValid), auth(), pc.deleteProduct)



//Update endpoints
router.put("/:productId/update", validation(validators.updateProductValid), auth(), pc.updateProduct)



export default router