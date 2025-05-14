const express = require('express')
const supabase = require('../config/supabaseConfig')

const authController = require('../controller/authController')

const router = express.Router()


router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect)

router.patch('/updateMe', authController.updateMe)

router.post('/auth/verify-email', async (req, res) => {
    const { access_token } = req.body;
  
    if (!access_token) {
      return res.status(400).json({ error: 'Missing access token.' });
    }
  
    // Use the token to get user info
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
  
    if (error) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  
    return res.status(200).json({
      message: 'Email is already verified.',
      user: user
    });
  });
  

  router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
  
    if (!token) return res.status(401).json({ error: 'Missing access token' });
  
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    // console.log(user)
    if (userError) return res.status(401).json({ error: userError.message });
  
    const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, phone, role_name')
    .eq('id', user.id)
    .single();
  
    if (profileError) return res.status(400).json({ error: profileError.message });
  
    return res.status(200).json({ profile });
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