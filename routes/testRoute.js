const express = require('express')

const authController = require('../controller/authController')
const testController = require('../controller/testController')

const router = express.Router()

router.use(authController.protect)

router.post('/createPayments', testController.createPayment)
router.post('/createOrder', testController.createOrder)
router.post('/createOrderItem', testController.createOrderItems)


module.exports = router;