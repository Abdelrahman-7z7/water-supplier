const express = require('express')

const morgan = require('morgan')

const globalErrorHandling = require('./controller/errorController')
const supabase = require('./config/supabaseConfig')


//Routes
const userRoute = require('./routes/userRoute')
const productCategoriesRoute = require('./routes/productCategoriesRoute')

const app = express()

//middleware for returning response in json format
app.use(express.json())

//logging middleware
if(process.env.NODE_ENV.trim() === 'development'){
    app.use(morgan('dev'))
}


app.use('/api/k1/users', userRoute)
app.use('/api/k1/product_categories', productCategoriesRoute)

app.get('/', (req, res) =>{
    res.json({"name":'Server is running...'})
})


/** ==================
 *   ERROR HANDLING
 * ================== */

//reaching this point refers to having an error
// ## using global-error-handler from errorController ##
app.use(globalErrorHandling);

module.exports = app;