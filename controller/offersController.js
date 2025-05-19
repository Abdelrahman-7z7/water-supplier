const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const supabase = require('../config/supabaseConfig')


exports.getAllOffers = catchAsync(async (req, res, next) => {
    const { data, error } = await supabase
    .from('offers')
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

exports.createOffer = catchAsync(async (req, res, next) =>{
    const { image_url } = req.body;

    if (!image_url) {
      return next(new AppError('Image URL is required', 400));
    }
  
    const { data, error } = await supabase
      .from('offers')
      .insert([{ image_url }])
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

exports.updateOffer = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateFields = req.body;

    if (!id) {
        return next(new AppError('Offer ID is required for update', 400));
    }

    const { data, error } = await supabase
        .from('offers')
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

exports.deleteOffer = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Offer ID is required for deletion', 400));
    }
  
    const { error } = await supabase
      .from('offers')
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