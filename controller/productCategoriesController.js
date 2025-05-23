const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {supabase} = require('../config/supabaseConfig')

exports.createCategory = catchAsync(async (req, res, next) =>{
    const { title, image_url } = req.body;

    if (!title || !image_url) {
      return next(new AppError('Title and image_url are required', 400));
    }
  
    const { data, error } = await supabase
      .from('product_categories')
      .insert([{ title, image_url }])
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

exports.updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, image_url } = req.body;

    if (!title && !image_url) {
        return next(new AppError('Please provide title or image_url to update.', 400));
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (image_url) updateData.image_url = image_url;

    const { data, error } = await supabase
        .from('product_categories')
        .update(updateData)
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

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id)
      .select(); // Ensure it returns deleted row(s)
      
    //supabase does not return an error for blocking some operation like deleting this is why you might get a 204 for deletion but in fact the data did not get changed
    if (error) {
      return next(new AppError(error.message, 400));
    }
  
    res.status(204).json({
      status: 'success',
      data: null,
    });
})

exports.getAllCategory = catchAsync(async (req, res, next) => {
    const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('created_at', { ascending: false });

    if (error) {
        return next(new AppError(error.message, 400));
    }

    res.status(200).json({
        status: 'success',
        results: data.length,
        data,
  });
})

