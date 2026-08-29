const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let rawUrl = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.trim() : '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseKey = (process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here' && supabaseKey !== 'your_supabase_anon_key_here') {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized successfully connecting to:', supabaseUrl);
    } catch (err) {
        console.error('Failed to initialize Supabase client:', err.message);
    }
} else {
    console.log('Strict Supabase Mode: Waiting for SUPABASE_URL and SUPABASE_KEY to be set in .env');
}

module.exports = supabase;
