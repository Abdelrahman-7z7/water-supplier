const express = require('express')
const productCategoriesController = require('../controller/productCategoriesController')
const authController = require('../controller/authController')

const router = express.Router()

router.use(authController.protect)

router.post('/createProductCategory', productCategoriesController.createCategory)
router.patch('/updateProductCategory/:id', productCategoriesController.updateCategory)
router.get('/getAllCategory', productCategoriesController.getAllCategory)
router.delete('/deleteProductCategory/:id', productCategoriesController.deleteCategory)

module.exports = router;
