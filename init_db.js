const mysql = require('mysql2/promise');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
require('dotenv').config();

async function initDB() {
    try {
        console.log("Connecting to local MySQL server...");
        // Create connection without db first
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            connectTimeout: 2000
        });

        console.log("Creating database 'weather_app'...");
        await connection.query('CREATE DATABASE IF NOT EXISTS weather_app');
        await connection.query('USE weather_app');
        
        console.log("Creating table 'users'...");
        await connection.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("Creating table 'favorites'...");
        await connection.query(`CREATE TABLE IF NOT EXISTS favorites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            city VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        console.log("MySQL Database initialized successfully!");
        process.exit(0);
    } catch (err) {
        console.warn("MySQL connection failed (" + err.message + "). Initializing local SQLite database as fallback...");
        try {
            const db = await open({
                filename: path.join(__dirname, 'weather_app.sqlite'),
                driver: sqlite3.Database
            });
            await db.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS favorites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    city TEXT NOT NULL,
                    country TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `);
            console.log("SQLite Database ('weather_app.sqlite') initialized successfully!");
            process.exit(0);
        } catch (sqliteErr) {
            console.error("Failed to initialize SQLite database:", sqliteErr);
            process.exit(1);
        }
    }
}

initDB();

