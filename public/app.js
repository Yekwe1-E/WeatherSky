// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

const currentCityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIconBig = document.getElementById('weatherIconBig');
const tempValue = document.getElementById('tempValue');
const weatherCondition = document.getElementById('weatherCondition');
const humidityVal = document.getElementById('humidityVal');
const windVal = document.getElementById('windVal');
const tempMaxVal = document.getElementById('tempMaxVal');
const tempMinVal = document.getElementById('tempMinVal');
const pressureVal = document.getElementById('pressureVal');
const visibilityVal = document.getElementById('visibilityVal');

const forecastContainer = document.getElementById('forecastContainer');
const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
const saveFavBtn = document.getElementById('saveFavBtn');

// Modals
const authModal = document.getElementById('authModal');
const dashboardModal = document.getElementById('dashboardModal');
const authSection = document.getElementById('authSection');
const userSection = document.getElementById('userSection');
const userNameDisplay = document.getElementById('userNameDisplay');

// Notifications
const notification = document.getElementById('notification');
const notificationMsg = document.getElementById('notificationMsg');
const loadingOverlay = document.getElementById('loadingOverlay');

let currentUser = null;
let currentChart = null;
let animationFrameId = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    fetchWeatherByGeolocation(); // Auto-detect on load
    setupEventListeners();
});

function setupEventListeners() {
    searchBtn.addEventListener('click', () => {
        if(searchInput.value) fetchWeatherData({ city: searchInput.value });
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && searchInput.value) fetchWeatherData({ city: searchInput.value });
    });

    geoBtn.addEventListener('click', fetchWeatherByGeolocation);

    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Auth Modals
    document.getElementById('loginBtn').addEventListener('click', () => showAuthModal('login'));
    document.getElementById('registerBtn').addEventListener('click', () => showAuthModal('register'));
    document.getElementById('closeModalBtn').addEventListener('click', () => authModal.classList.add('hidden'));
    
    document.getElementById('tabLogin').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('tabRegister').addEventListener('click', () => switchAuthTab('register'));

    // Dashboard
    document.getElementById('dashboardBtn').addEventListener('click', openDashboard);
    document.getElementById('closeDashBtn').addEventListener('click', () => dashboardModal.classList.add('hidden'));

    // Form Submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Notifications
    document.getElementById('closeNotification').addEventListener('click', () => notification.classList.add('hidden'));

    // Save Favorite
    saveFavBtn.addEventListener('click', saveFavorite);
}

// ----------------------------------------
// WEATHER LOGIC
// ----------------------------------------

async function fetchWeatherByGeolocation() {
    if (navigator.geolocation) {
        showLoading(true);
        navigator.geolocation.getCurrentPosition(
            position => fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude }),
            error => {
                showLoading(false);
                showNotification('Geolocation denied or failed. Showing default location.');
                fetchWeatherData({ city: 'London' }); // default
            }
        );
    } else {
        fetchWeatherData({ city: 'London' });
    }
}

async function fetchWeatherData(params) {
    showLoading(true);
    try {
        const query = params.city ? `city=${encodeURIComponent(params.city)}` : `lat=${params.lat}&lon=${params.lon}`;
        
        // Fetch Current
        const currentRes = await fetch(`/api/weather/current?${query}`);
        if (!currentRes.ok) {
            const errBase = await currentRes.json();
            throw new Error(errBase.error || 'Failed to fetch weather data');
        }
        const currentData = await currentRes.json();

        // Fetch Forecast
        const forecastRes = await fetch(`/api/weather/forecast?${query}`);
        const forecastData = forecastRes.ok ? await forecastRes.json() : null;

        updateCurrentWeatherUI(currentData);
        if (forecastData) updateForecastUI(forecastData);
        
        // Show save button
        if (currentUser) {
            saveFavBtn.classList.remove('hidden');
            saveFavBtn.dataset.city = currentData.name;
            saveFavBtn.dataset.country = currentData.sys.country;
        }

    } catch (error) {
        showNotification(error.message);
    } finally {
        showLoading(false);
    }
}

function updateCurrentWeatherUI(data) {
    currentCityName.innerText = `${data.name}, ${data.sys.country}`;
    currentDate.innerText = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    weatherIconBig.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    weatherIconBig.classList.remove('placeholder-pulse');
    
    tempValue.innerText = Math.round(data.main.temp);
    weatherCondition.innerText = data.weather[0].description;
    
    humidityVal.innerText = `${data.main.humidity}%`;
    windVal.innerText = `${data.wind.speed} m/s`;
    tempMaxVal.innerText = `${Math.round(data.main.temp_max)}°C`;
    tempMinVal.innerText = `${Math.round(data.main.temp_min)}°C`;
    pressureVal.innerText = `${data.main.pressure} hPa`;
    visibilityVal.innerText = `${data.visibility ? (data.visibility / 1000).toFixed(1) : '--'} km`;

    updateDynamicBackground(data.weather[0].icon);
    initWeatherVisualScenery(data.weather[0].icon);
}

function updateForecastUI(data) {
    forecastContainer.innerHTML = '';
    if (hourlyForecastContainer) hourlyForecastContainer.innerHTML = '';
    
    // Group forecast by day and build 24h hourly timeline
    const dailyData = [];
    const labels = [];
    const temps = [];

    // Render Hourly Cards (Next 8 forecast slots = 24 hours)
    const hourlyItems = data.list.slice(0, 8);
    hourlyItems.forEach(item => {
        const timeStr = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const rainChance = Math.round((item.pop || 0) * 100);
        
        if (hourlyForecastContainer) {
            const hCard = document.createElement('div');
            hCard.className = 'hourly-card';
            hCard.innerHTML = `
                <span class="time">${timeStr}</span>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                <span class="temp">${Math.round(item.main.temp)}°C</span>
                <span class="rain-indicator"><i class="fa-solid fa-droplet"></i> ${rainChance}%</span>
            `;
            hourlyForecastContainer.appendChild(hCard);
        }
    });

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Push 8 data points to chart directly
        labels.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        temps.push(item.main.temp);
        
        if (!dailyData.find(d => d.day === dayStr)) {
            if(dailyData.length < 5) {
                dailyData.push({
                    day: dayStr,
                    temp: item.main.temp,
                    icon: item.weather[0].icon
                });
            }
        }
    });

    // Populate Daily Cards
    dailyData.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p><strong>${day.day}</strong></p>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="icon">
            <p><strong>${Math.round(day.temp)}°C</strong></p>
        `;
        forecastContainer.appendChild(card);
    });

    // Update Chart (render first 8 intervals = 24 hrs)
    renderChart(labels.slice(0, 8), temps.slice(0, 8));
}

function updateDynamicBackground(iconCode) {
    const isNight = iconCode.includes('n');
    document.body.className = ''; 
    
    // Theme logic
    const themeStr = localStorage.getItem('theme');
    if(themeStr === 'dark' || (isNight && themeStr !== 'light')) {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    if (iconCode.includes('01') || iconCode.includes('02')) {
        document.body.classList.add(isNight ? 'clear-night' : 'clear-day');
    } else if (iconCode.includes('03') || iconCode.includes('04')) {
        document.body.classList.add('clouds');
    } else if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) {
        document.body.classList.add('rain');
    } else {
        document.body.classList.add('clear-day'); // fallback
    }
}

function initWeatherVisualScenery(iconCode) {
    const canvas = document.getElementById('weatherCanvasOverlay');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.removeEventListener('resize', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    
    const isNight = iconCode.includes('n');
    const isRain = iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11');
    const isSun = iconCode.includes('01') || iconCode.includes('02');
    const isSnow = iconCode.includes('13');
    const isThunder = iconCode.includes('11');

    const rainDrops = [];
    if (isRain || isThunder) {
        for (let i = 0; i < 110; i++) {
            rainDrops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 22 + 10,
                speed: Math.random() * 8 + 12
            });
        }
    }

    const snowflakes = [];
    if (isSnow) {
        for (let i = 0; i < 70; i++) {
            snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speedY: Math.random() * 1.5 + 0.5,
                speedX: Math.random() * 1 - 0.5
            });
        }
    }

    let sunAngle = 0;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Sun Rays for Clear Days
        if (isSun && !isNight) {
            sunAngle += 0.003;
            const sunX = canvas.width * 0.85;
            const sunY = canvas.height * 0.18;

            const glow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 280);
            glow.addColorStop(0, 'rgba(255, 235, 150, 0.4)');
            glow.addColorStop(0.5, 'rgba(255, 190, 60, 0.15)');
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 280, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.translate(sunX, sunY);
            ctx.rotate(sunAngle);
            ctx.strokeStyle = 'rgba(255, 245, 190, 0.12)';
            ctx.lineWidth = 4;
            for (let i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos((i * Math.PI) / 6) * 400, Math.sin((i * Math.PI) / 6) * 400);
                ctx.stroke();
            }
            ctx.restore();
        }

        // 2. Falling Raindrops
        if (isRain || isThunder) {
            ctx.strokeStyle = isNight ? 'rgba(180, 220, 255, 0.5)' : 'rgba(70, 130, 220, 0.45)';
            ctx.lineWidth = 1.5;
            for (let drop of rainDrops) {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x - 2, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;
                drop.x -= 0.5;

                if (drop.y > canvas.height) {
                    drop.y = -20;
                    drop.x = Math.random() * canvas.width;
                }
            }
        }

        // 3. Falling Snowflakes
        if (isSnow) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            for (let flake of snowflakes) {
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fill();

                flake.y += flake.speedY;
                flake.x += flake.speedX;

                if (flake.y > canvas.height) {
                    flake.y = -10;
                    flake.x = Math.random() * canvas.width;
                }
            }
        }

        // 4. Thunderstorm Flash
        if (isThunder && Math.random() < 0.008) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        animationFrameId = requestAnimationFrame(render);
    }

    render();
}

function renderChart(labels, data) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C) - Next 24 Hours',
                data: data,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') } }
            },
            scales: {
                x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') } },
                y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') } }
            }
        }
    });
}

function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    // Re-render chart text colors based on theme
    if(currentChart) {
        const color = getComputedStyle(document.body).getPropertyValue('--text-primary');
        currentChart.options.plugins.legend.labels.color = color;
        currentChart.options.scales.x.ticks.color = color;
        currentChart.options.scales.y.ticks.color = color;
        currentChart.update();
    }
}

// ----------------------------------------
// AUTHENTICATION LOGIC
// ----------------------------------------

async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            loginUser(data.user);
        }
    } catch (e) {
        console.error(e);
    }
}

function loginUser(user) {
    currentUser = user;
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userNameDisplay.innerText = user.username;
    if(currentCityName.innerText !== 'City Name') saveFavBtn.classList.remove('hidden');
}

function showAuthModal(type) {
    authModal.classList.remove('hidden');
    switchAuthTab(type);
}

function switchAuthTab(type) {
    const tLogin = document.getElementById('tabLogin');
    const tReg = document.getElementById('tabRegister');
    const fLogin = document.getElementById('loginForm');
    const fReg = document.getElementById('registerForm');

    if (type === 'login') {
        tLogin.classList.add('active'); tReg.classList.remove('active');
        fLogin.classList.remove('hidden'); fReg.classList.add('hidden');
    } else {
        tReg.classList.add('active'); tLogin.classList.remove('active');
        fReg.classList.remove('hidden'); fLogin.classList.add('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            loginUser(data.user);
            authModal.classList.add('hidden');
            showNotification('Logged in successfully!');
        } else {
            showNotification(data.error);
        }
    } catch (err) {
        showNotification('Connection error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            showNotification('Registration successful! Please log in.');
            switchAuthTab('login');
        } else {
            showNotification(data.error);
        }
    } catch (err) {
        showNotification('Connection error');
    }
}

async function handleLogout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        currentUser = null;
        userSection.classList.add('hidden');
        authSection.classList.remove('hidden');
        saveFavBtn.classList.add('hidden');
        showNotification('Logged out successfully');
    } catch (e) {
        showNotification('Error logging out');
    }
}

// ----------------------------------------
// FAVORITES LOGIC
// ----------------------------------------

async function saveFavorite() {
    const city = saveFavBtn.dataset.city;
    const country = saveFavBtn.dataset.country;
    if (!city || !currentUser) return;

    try {
        const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city, country })
        });
        const data = await res.json();
        
        if (res.ok) {
            showNotification(`${city} saved to favorites!`);
            saveFavBtn.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Solid heart
        } else {
            showNotification(data.error);
        }
    } catch (e) {
        showNotification('Error saving favorite');
    }
}

async function openDashboard() {
    dashboardModal.classList.remove('hidden');
    const favList = document.getElementById('favoritesList');
    const noFavs = document.getElementById('noFavsMsg');
    
    favList.innerHTML = '<div class="spinner"></div>';
    noFavs.classList.add('hidden');

    try {
        const res = await fetch('/api/favorites');
        const data = await res.json();
        
        favList.innerHTML = '';
        if (data.length === 0) {
            noFavs.classList.remove('hidden');
        } else {
            data.forEach(fav => {
                const li = document.createElement('li');
                li.className = 'favorite-item';
                li.innerHTML = `
                    <span style="cursor:pointer" onclick="fetchWeatherData({city: '${fav.city}'}); document.getElementById('dashboardModal').classList.add('hidden');">
                        <strong>${fav.city}</strong>, ${fav.country}
                    </span>
                    <button onclick="removeFavorite(${fav.id}, this)"><i class="fa-solid fa-trash"></i></button>
                `;
                favList.appendChild(li);
            });
        }
    } catch (e) {
        favList.innerHTML = '';
        showNotification('Error loading favorites');
    }
}

async function removeFavorite(id, btnRef) {
    try {
        const res = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
        if (res.ok) {
            btnRef.parentElement.remove();
            showNotification('Favorite removed');
        }
    } catch (e) {
        showNotification('Error removing favorite');
    }
}

// ----------------------------------------
// UTILS
// ----------------------------------------

function showLoading(show) {
    if (show) loadingOverlay.classList.remove('hidden');
    else loadingOverlay.classList.add('hidden');
}

function showNotification(msg) {
    notificationMsg.innerText = msg;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);
}
