const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({path: './config.env'});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // or use anon key if no auth is needed
);

const supabaseSecret = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY_SECRET // or use anon key if no auth is
)

module.exports = {
  supabase,
  supabaseSecret
};
