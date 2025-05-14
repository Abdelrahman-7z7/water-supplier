const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const supabase = require('../config/supabaseConfig')


exports.signup = catchAsync(async (req, res, next) => {
    const { email, password, username, phone } = req.body;

    // Check if any of the required fields are missing
    if (!email || !phone || !username || !password) {
        // return res.status(400).json({ error: 'One of the fields is missing' });
        // console.log(process.env.NODE_ENV.trim() === 'development')
        return next(new AppError('One of the fields is missing', 400))
    }

    // Sign up the user using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username,
                phone: phone,
            }
        }
    });

    // Handle any errors during sign-up
    if (error) {
        // console.error('Supabase Error:', error);
        // return res.status(400).json({ error: error.message, details: error.details });
        return next(new AppError(error, 400))
    }
    

    // Check if the user was created successfully
    if (data && data.user) {
        return res.status(200).json({
            message: 'Sign-up successful, check your email for confirmation (if required).',
            user: data.user
        });
    } else {
        // return res.status(500).json({ error: 'An unexpected error occurred during sign-up.' });
        return next(new AppError('An unexpected error occurred during sign-up.', 500))
    }
})


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        // return res.status(400).json({ error: 'Email and password are required' });
        return next(new AppError('email or password is missing', 400))
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    // Handle error
    if (error) {
        return res.status(401).json({ error: error.message, details: error.details });
    }

    // Success
    return res.status(200).json({
        message: 'Login successful',
        session: data.session,
        user: data.user
    });
})


exports.protect = catchAsync(async (req, res, next) => {

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return next(new AppError('Missing access token', 401));
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return next(new AppError('Invalid or expired token', 401));
    }

    req.user = user.id;
    next();    
});

// exports.restrictTo = (...allowedRoles) => {
//     return async (req, res, next) => {
//       const userId = req.user?.id;
//       if (!userId) {
//         return next(new AppError('Unauthorized. No user ID found.', 401));
//       }
  
//       // Fetch role_name from the `profiles` table
//       const { data: profile, error } = await supabase
//         .from('profiles')
//         .select('role_name')
//         .eq('id', userId)
//         .single();
  
//       if (error || !profile) {
//         return next(new AppError('Failed to verify user role.', 403));
//       }
  
//       if (!allowedRoles.includes(profile.role_name)) {
//         return next(new AppError('You do not have permission to perform this action.', 403));
//       }
  
//       next();
//     };
// };


// controller/userController.js or wherever you define updateMe
exports.updateMe = catchAsync(async (req, res, next) => {
    const { username, phone} = req.body;
  
    if (!username && !phone) {
      return next(new AppError('Please provide a username or phone to update.', 400));
    }
  
    const updateData = {};
    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
  
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', req.user)
      .select('username, phone')
      .single();
  
    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }
  
    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
});
    