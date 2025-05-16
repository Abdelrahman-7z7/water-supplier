const express = require('express')

const authController = require('../controller/authController')
const locationsController = require('../controller/locationsController')

const router = express.Router()

router.use(authController.protect)

router.get('/getAllLocations', locationsController.getAllLocations)
router.post('/createLocation', locationsController.createLocations)
router.patch('/updateLocation/:id', locationsController.updateLocations)
router.delete('/deleteLocation/:id', locationsController.deleteLocations)

module.exports = router