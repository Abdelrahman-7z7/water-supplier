const express = require('express')

const authController = require('../controller/authController')
const productsController = require('../controller/productsController')

const router = express.Router()

router.use(authController.protect)

router.get('/getAllProducts', productsController.getAllProduct)
router.post('/createProduct', productsController.createProduct)
router.patch('/updateProduct/:id', productsController.updateProduct)
router.delete('/deleteProduct/:id', productsController.deleteProduct)
router.get('/getProductsByCategory/:categoryId', productsController.getProductsByCategory)

module.exports = router;