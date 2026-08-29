const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

/* ===========================
 * AUTHENTICATION ROUTES
 * =========================== */

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [existing] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User with that email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        const [users] = await db.execute('SELECT id, username, email FROM users WHERE id = ?', [req.session.userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ user: users[0] });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/* ===========================
 * WEATHER proxy ROUTES
 * =========================== */

const fetchWeather = async (url, res) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
        return res.status(500).json({ error: 'API key not configured on server' });
    }
    try {
        const response = await axios.get(`${url}&appid=${apiKey}&units=metric`);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            res.status(500).json({ error: 'Error fetching weather data' });
        }
    }
};

app.get('/api/weather/current', (req, res) => {
    const { lat, lon, city } = req.query;
    let url = 'https://api.openweathermap.org/data/2.5/weather?';
    if (lat && lon) {
        url += `lat=${lat}&lon=${lon}`;
    } else if (city) {
        url += `q=${encodeURIComponent(city)}`;
    } else {
        return res.status(400).json({ error: 'Missing coordinates or city' });
    }
    fetchWeather(url, res);
});

app.get('/api/weather/forecast', (req, res) => {
    const { lat, lon, city } = req.query;
    let url = 'https://api.openweathermap.org/data/2.5/forecast?';
    if (lat && lon) {
        url += `lat=${lat}&lon=${lon}`;
    } else if (city) {
        url += `q=${encodeURIComponent(city)}`;
    } else {
        return res.status(400).json({ error: 'Missing coordinates or city' });
    }
    fetchWeather(url, res);
});


/* ===========================
 * FAVORITES ROUTES
 * =========================== */

// Middleware to check auth
const requireAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

app.get('/api/favorites', requireAuth, async (req, res) => {
    try {
        const [favorites] = await db.execute('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC', [req.session.userId]);
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/favorites', requireAuth, async (req, res) => {
    try {
        const { city, country } = req.body;
        if (!city || !country) return res.status(400).json({ error: 'City and country are required' });
        
        // Prevent duplicates
        const [existing] = await db.execute('SELECT * FROM favorites WHERE user_id = ? AND city = ? AND country = ?', [req.session.userId, city, country]);
        if (existing.length > 0) return res.status(400).json({ error: 'Location already in favorites' });

        await db.execute('INSERT INTO favorites (user_id, city, country) VALUES (?, ?, ?)', [req.session.userId, city, country]);
        res.status(201).json({ message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/favorites/:id', requireAuth, async (req, res) => {
    try {
        await db.execute('DELETE FROM favorites WHERE id = ? AND user_id = ?', [req.params.id, req.session.userId]);
        res.json({ message: 'Favorite removed' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Fallback for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
