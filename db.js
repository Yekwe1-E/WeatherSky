const supabase = require('./config/supabase');
require('dotenv').config();

async function handleSupabaseQuery(sql, params) {
    if (!supabase) {
        throw new Error("Strict Supabase Mode Active: SUPABASE_URL and SUPABASE_KEY are not configured in your .env file.");
    }
    
    const trimmed = sql.trim();
    if (trimmed.includes('FROM users WHERE email = ? OR username = ?')) {
        const [email, username] = params;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${email},username.eq.${username}`);
        if (error) throw error;
        return [data || []];
    }
    if (trimmed.startsWith('INSERT INTO users')) {
        const [username, email, password] = params;
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, email, password }])
            .select();
        if (error) throw error;
        return [{ insertId: data && data[0] ? data[0].id : Date.now(), affectedRows: 1 }];
    }
    if (trimmed.includes('FROM users WHERE email = ?')) {
        const [email] = params;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);
        if (error) throw error;
        return [data || []];
    }
    if (trimmed.includes('FROM users WHERE id = ?')) {
        const [id] = params;
        const { data, error } = await supabase
            .from('users')
            .select('id, username, email')
            .eq('id', Number(id));
        if (error) throw error;
        return [data || []];
    }
    if (trimmed.includes('FROM favorites WHERE user_id = ? ORDER BY created_at DESC')) {
        const [userId] = params;
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', Number(userId))
            .order('created_at', { ascending: false });
        if (error) throw error;
        return [data || []];
    }
    if (trimmed.includes('FROM favorites WHERE user_id = ? AND city = ? AND country = ?')) {
        const [userId, city, country] = params;
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', Number(userId))
            .eq('city', city)
            .eq('country', country);
        if (error) throw error;
        return [data || []];
    }
    if (trimmed.startsWith('INSERT INTO favorites')) {
        const [userId, city, country] = params;
        const { data, error } = await supabase
            .from('favorites')
            .insert([{ user_id: Number(userId), city, country }])
            .select();
        if (error) throw error;
        return [{ insertId: data && data[0] ? data[0].id : Date.now(), affectedRows: 1 }];
    }
    if (trimmed.startsWith('DELETE FROM favorites WHERE id = ? AND user_id = ?')) {
        const [id, userId] = params;
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', Number(id))
            .eq('user_id', Number(userId));
        if (error) throw error;
        return [{ affectedRows: 1 }];
    }
    return [[]];
}

module.exports = {
    async execute(sql, params = []) {
        return await handleSupabaseQuery(sql, params);
    },
    async query(sql, params = []) {
        return this.execute(sql, params);
    }
};



