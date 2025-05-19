const express = require('express')

const authController = require('../controller/authController')
const offersController = require('../controller/offersController')

const router = express.Router()

router.use(authController.protect)

router.get('/getAllOffers', offersController.getAllOffers)
router.post('/createOffer', offersController.createOffer)
router.patch('/updateOffer/:id', offersController.updateOffer)
router.delete('/deleteOffer/:id',offersController.deleteOffer)

module.exports = router;