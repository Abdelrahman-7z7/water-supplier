const express = require('express')
const supabase = require('../config/supabaseConfig')

const router = express.Router()


router.post('/signup', async (req, res) => {
    const { email, password, username, phone } = req.body;

    // Check if any of the required fields are missing
    if (!email || !phone || !username || !password) {
        return res.status(400).json({ error: 'One of the fields is missing' });
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
        return res.status(400).json({ error: error.message, details: error.details });
    }

    // Check if the user was created successfully
    if (data && data.user) {
        return res.status(200).json({
            message: 'Sign-up successful, check your email for confirmation (if required).',
            user: data.user
        });
    } else {
        return res.status(500).json({ error: 'An unexpected error occurred during sign-up.' });
    }
});


router.delete('/deleteUser/:id', async(req, res)=>{
    const { id } = req.params;

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'User and profile deleted successfully.' });
})

module.exports = router;