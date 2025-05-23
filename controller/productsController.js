const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {supabase} = require('../config/supabaseConfig')

exports.createProduct = catchAsync(async (req, res, next) => {
    const { title, size, description, price, old_price, price_type, category, image_url } = req.body; //category must be added as id

    if (!title || !size || !description || !price || !price_type || !category || !image_url) {
        return next(new AppError('All fields except old_price are required', 400));
    }

    const { data, error } = await supabase
        .from('products')
        .insert([{ title, size, description, price, old_price, price_type, category, image_url }])
        .select()
        .single();

    if (error) {
        return next(new AppError(error.message, 400));
    }

    res.status(201).json({
        status: 'success',
        data,
    });
})

exports.getAllProduct = catchAsync(async (req, res, next) => {
    const { data, error } = await supabase
    .from('products')
    .select('*');

    if (error) {
        return next(new AppError(error.message, 400));
    }

    res.status(200).json({
        status: 'success',
        results: data.length,
        data,
    });
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateFields = req.body;
  
    if (!id) {
      return next(new AppError('Product ID is required for update', 400));
    }
  
    const { data, error } = await supabase
      .from('products')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();
  
    if (error) {
      return next(new AppError(error.message, 400));
    }
  
    res.status(200).json({
      status: 'success',
      data,
    });
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
  
    if (error) {
      return next(new AppError(error.message, 400));
    }
  
    res.status(204).json({
      status: 'success',
      data: null,
    });
})


exports.getProductsByCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
  
    if (!categoryId) {
      return next(new AppError('Category ID is required', 400));
    }
  
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryId);
  
    if (error) {
      return next(new AppError(error.message, 400));
    }
  
    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
});
  
