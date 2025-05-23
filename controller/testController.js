const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {supabaseSecret, supabase} = require('../config/supabaseConfig')

exports.createOrder = catchAsync(async (req, res, next)=>{
    const {
        payment_id,
        location_id,
        title,
        status,
        total,
        order_type
    } = req.body

    if(!payment_id || !location_id || !title || !status || !total || !order_type){
        return next(new AppError('Please fill in all fields', 400))
    }

    const {data, error} = await supabaseSecret
    .from('orders')
    .insert([{
        payment_id,
        location_id,
        title,
        status,
        total,
        order_type,
        user_id: req.user
    }])
    .select()
    .single()

    if(error){
        return next(new AppError(error.message, 400))
    }

    res.status(200).json({
        status: 'success',
        data
    })
})

exports.createPayment = catchAsync(async (req, res, next)=>{
    //this route has been tested correctly = status === valid
    const {
        // user_id
        method,
        status,
        provider_id,
        total
    } = req.body

    if(!method || !status || !provider_id || !total){
        next(new AppError('one of the field is missing', 400))
    }

    const {data, error} = await supabase
    .from('payments')
    .insert([
        {
            user_id: req.user,
            method,
            status,
            provider_id,
            total,
            currency: 'USD'
        }
    ])
    .select()
    .single()

    if(error){
        console.log('1')
        return next(new AppError(error.message, 400))
    }

    res.status(200).json({
        status: 'success',
        data
    })
})

exports.createOrderItems = catchAsync(async (req, res, next)=>{
    const items = req.body.items

    if(!Array.isArray(items) || items.length === 0){
        return next(new AppError("items must be an non-empty array", 400))
    }

    const validatedItems = [];

    for(const [index, item] of items.entries()){
        const {order_id, product_id, quantity, unit_price} = item

        if(!order_id || !product_id || !quantity || !unit_price){
            return next(new AppError(`Missing field in item at index ${index}`, 400))
        }

        const parsedQuantity = parseInt(quantity, 10)
        const parsedUnitPrice = parseFloat(unit_price)

        if(isNaN(parsedQuantity) || parsedQuantity <= 0){
            return next(new AppError(`Invalid quantity in item at index ${index}`))
        }

        if(isNaN(parsedUnitPrice) || parsedUnitPrice < 0){
            return next(new AppError(`Invalid unit_price in item at index ${index}`))
        }

        validatedItems.push({
            order_id,
            product_id,
            quantity: parsedQuantity,
            unit_price: parsedUnitPrice
        })
    }

    //Insert into supabase
    const {data, error} = await supabase
    .from('order_items')
    .insert(validatedItems)
    .select();

    if(error){
        return next(new AppError(error.message, 400))
    }

    res.status(200).json({
        status: "success",
        data
    })
})