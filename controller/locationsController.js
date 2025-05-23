const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {supabase} = require('../config/supabaseConfig')

exports.getAllLocations = catchAsync(async (req, res, next) => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')

  if (error) {
    return next(new AppError(error.message, 400));
  }

  res.status(200).json({
    status: 'success',
    results: data.length,
    data,
  });   

})

exports.createLocations = catchAsync(async (req, res, next) => {
    const {
        label, region, city, latitude, longitude, description
    } = req.body;

    if (!label || !region || !city || !latitude || !longitude) {
        return next(new AppError('Missing required fields', 400));
    }

    // const userID = req.user; // secure user id from auth
    console.log(req.user)

    const { data, error } = await supabase
    .from('locations')
    .insert([{
        user_id: req.user,
        label,
        region,
        city,
        latitude,
        longitude,
        description
    }])
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

exports.updateLocations = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
  
    // Ensure updated_at is updated manually
    updateData.updated_at = new Date().toISOString();
  
    const { data, error } = await supabase
      .from('locations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
  
    if (error) {
      return next(new AppError(error.message, 400));
    }
  
    if (!data) {
      return next(new AppError('Location not found or not authorized', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data,
    });
})

exports.deleteLocations = catchAsync(async (req, res, next) => {
    const { id } = req.params;
  
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id)
  
    if (error) {
      return next(new AppError(error.message, 400));
    }
  
    res.status(204).json({
      status: 'success',
      data: null,
    });
})