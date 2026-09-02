// State Variables
let currentUnit = 'C'; // 'C' or 'F'
let currentRawData = null; // Current weather data
let forecastRawData = null; // 5-day / hourly forecast data
let aqiRawData = null; // Air quality data
let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
let currentChart = null;
let selectedMetric = 'temp'; // 'temp', 'pop', 'wind', 'humidity'
let animationFrameId = null;
let currentUser = null;

// Leaflet Map Variables
let weatherMap = null;
let mapMarker = null;
let currentMapLayerName = 'precipitation_new';
let mapTileLayer = null;

// Audio Soundscape Synthesizer Variables
let audioCtx = null;
let soundscapeActive = false;
let audioGainNode = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const autocompleteDropdown = document.getElementById('autocompleteDropdown');
const recentSearchesContainer = document.getElementById('recentSearches');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const unitToggleBtn = document.getElementById('unitToggleBtn');
const unitText = document.getElementById('unitText');
const audioToggleBtn = document.getElementById('audioToggleBtn');

const currentCityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIconBig = document.getElementById('weatherIconBig');
const tempValue = document.getElementById('tempValue');
const mainUnitSymbol = document.getElementById('mainUnitSymbol');
const weatherCondition = document.getElementById('weatherCondition');
const feelsLikeText = document.getElementById('feelsLikeText');
const humidityVal = document.getElementById('humidityVal');
const windVal = document.getElementById('windVal');
const tempMaxVal = document.getElementById('tempMaxVal');
const tempMinVal = document.getElementById('tempMinVal');
const pressureVal = document.getElementById('pressureVal');
const visibilityVal = document.getElementById('visibilityVal');

const saveFavBtn = document.getElementById('saveFavBtn');
const advisoryBanner = document.getElementById('advisoryBanner');
const advisoryMsg = document.getElementById('advisoryMsg');
const advisoryIcon = document.getElementById('advisoryIcon');

const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
const forecastContainer = document.getElementById('forecastContainer');
const timeScrubber = document.getElementById('timeScrubber');
const sliderTicks = document.getElementById('sliderTicks');
const selectedTimeBadge = document.getElementById('selectedTimeBadge');

// Modals
const authModal = document.getElementById('authModal');
const dashboardModal = document.getElementById('dashboardModal');
const comparatorModal = document.getElementById('comparatorModal');
const authSection = document.getElementById('authSection');
const userSection = document.getElementById('userSection');
const userNameDisplay = document.getElementById('userNameDisplay');
const loadingOverlay = document.getElementById('loadingOverlay');
const notification = document.getElementById('notification');
const notificationMsg = document.getElementById('notificationMsg');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderRecentSearches();
    setupEventListeners();
    fetchWeatherByGeolocation(); // Auto detect location on load
});

function setupEventListeners() {
    searchBtn.addEventListener('click', () => {
        if (searchInput.value) performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value) performSearch(searchInput.value);
    });

    // Autocomplete Input Listener (Debounced)
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        if (query.length < 2) {
            autocompleteDropdown.classList.add('hidden');
            return;
        }
        debounceTimer = setTimeout(() => fetchAutocompleteSuggestions(query), 300);
    });

    // Close autocomplete on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            autocompleteDropdown.classList.add('hidden');
        }
    });

    geoBtn.addEventListener('click', fetchWeatherByGeolocation);

    // Unit toggle (°C / °F)
    unitToggleBtn.addEventListener('click', toggleUnit);

    // Audio Soundscape toggle
    audioToggleBtn.addEventListener('click', toggleSoundscape);

    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Modals
    document.getElementById('loginBtn').addEventListener('click', () => showAuthModal('login'));
    document.getElementById('registerBtn').addEventListener('click', () => showAuthModal('register'));
    document.getElementById('closeModalBtn').addEventListener('click', () => authModal.classList.add('hidden'));

    document.getElementById('tabLogin').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('tabRegister').addEventListener('click', () => switchAuthTab('register'));

    // Dashboard & Dual City Compare Modals
    document.getElementById('dashboardBtn').addEventListener('click', openDashboard);
    document.getElementById('closeDashBtn').addEventListener('click', () => dashboardModal.classList.add('hidden'));
    document.getElementById('compareBtn').addEventListener('click', () => comparatorModal.classList.remove('hidden'));
    document.getElementById('closeCompareBtn').addEventListener('click', () => comparatorModal.classList.add('hidden'));
    document.getElementById('compareSearchBtn').addEventListener('click', handleDualCityCompare);

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Notifications & Advisories
    document.getElementById('closeNotification').addEventListener('click', () => notification.classList.add('hidden'));
    document.getElementById('closeAdvisory').addEventListener('click', () => advisoryBanner.classList.add('hidden'));

    // Favorite Toggle
    saveFavBtn.addEventListener('click', toggleFavorite);

    // Time Scrubber Slider
    timeScrubber.addEventListener('input', handleTimeScrubberChange);

    // Multi-Metric Chart Tabs
    document.querySelectorAll('.metric-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.metric-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            selectedMetric = e.target.dataset.metric;
            if (forecastRawData) renderChart(forecastRawData);
        });
    });

    // Map Layer Selectors
    document.querySelectorAll('.map-layer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.map-layer-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const layerKey = e.target.dataset.layer;
            switchMapLayer(layerKey);
        });
    });

    // Mobile Bottom Nav
    document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(i => i.classList.remove('active'));
            const targetBtn = e.currentTarget;
            targetBtn.classList.add('active');
            const targetId = targetBtn.dataset.target;
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ----------------------------------------
// UNIT CONVERSION & UTILS
// ----------------------------------------

function toggleUnit() {
    currentUnit = currentUnit === 'C' ? 'F' : 'C';
    unitText.innerText = `°${currentUnit}`;
    mainUnitSymbol.innerText = `°${currentUnit}`;
    
    // Re-render UI with new unit state
    if (currentRawData) updateCurrentWeatherUI(currentRawData);
    if (forecastRawData) updateForecastUI(forecastRawData);
}

function cToF(c) {
    return Math.round((c * 9/5) + 32);
}

function formatTemp(cVal) {
    if (cVal === undefined || cVal === null) return '--';
    const tempNum = Math.round(cVal);
    return currentUnit === 'C' ? `${tempNum}°C` : `${cToF(tempNum)}°F`;
}

function formatSpeed(m_s) {
    if (m_s === undefined || m_s === null) return '--';
    if (currentUnit === 'C') {
        return `${m_s} m/s`;
    } else {
        const mph = Math.round(m_s * 2.23694);
        return `${mph} mph`;
    }
}

// ----------------------------------------
// AUTOCOMPLETE & SEARCH HISTORY
// ----------------------------------------

async function fetchAutocompleteSuggestions(query) {
    try {
        const res = await fetch(`/api/weather/geo?q=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const cities = await res.json();
        
        autocompleteDropdown.innerHTML = '';
        if (cities.length === 0) {
            autocompleteDropdown.classList.add('hidden');
            return;
        }

        cities.forEach(city => {
            const li = document.createElement('li');
            const stateStr = city.state ? `, ${city.state}` : '';
            li.innerHTML = `<span><strong>${city.name}</strong>${stateStr}, ${city.country}</span> <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem; color:var(--text-secondary);"></i>`;
            li.addEventListener('click', () => {
                searchInput.value = `${city.name}, ${city.country}`;
                autocompleteDropdown.classList.add('hidden');
                fetchWeatherData({ lat: city.lat, lon: city.lon, cityName: `${city.name}, ${city.country}` });
            });
            autocompleteDropdown.appendChild(li);
        });

        autocompleteDropdown.classList.remove('hidden');
    } catch (e) {
        console.error('Autocomplete error:', e);
    }
}

function performSearch(cityName) {
    saveRecentSearch(cityName);
    fetchWeatherData({ city: cityName });
}

function saveRecentSearch(city) {
    if (!city) return;
    const cleanCity = city.trim();
    recentSearches = recentSearches.filter(c => c.toLowerCase() !== cleanCity.toLowerCase());
    recentSearches.unshift(cleanCity);
    if (recentSearches.length > 5) recentSearches.pop();
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    recentSearchesContainer.innerHTML = '';
    if (recentSearches.length === 0) return;

    recentSearches.forEach(city => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ${city}`;
        chip.addEventListener('click', () => {
            searchInput.value = city;
            fetchWeatherData({ city });
        });
        recentSearchesContainer.appendChild(chip);
    });
}

// ----------------------------------------
// WEATHER DATA FETCHING
// ----------------------------------------

async function fetchWeatherByGeolocation() {
    if (navigator.geolocation) {
        showLoading(true, 'Detecting your geolocation...');
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeatherData({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            err => {
                showLoading(false);
                showNotification('Geolocation disabled. Showing default city (London).');
                fetchWeatherData({ city: 'London' });
            }
        );
    } else {
        fetchWeatherData({ city: 'London' });
    }
}

async function fetchWeatherData(params) {
    showLoading(true, 'Fetching live atmospheric data...');
    try {
        let isOgobiri = false;
        if (params.city && params.city.trim().toLowerCase().includes('ogobiri')) {
            params = { lat: 4.9692, lon: 6.1097 };
            isOgobiri = true;
        }

        const query = params.city ? `city=${encodeURIComponent(params.city)}` : `lat=${params.lat}&lon=${params.lon}`;
        
        // 1. Fetch Current Weather
        const currentRes = await fetch(`/api/weather/current?${query}`);
        if (!currentRes.ok) {
            let errorMsg = 'City or location not found';
            try {
                const errBase = await currentRes.json();
                errorMsg = errBase.error || errBase.message || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
        }
        const currentData = await currentRes.json();
        if (isOgobiri) currentData.displayName = 'Ogobiri (Amassoma)';
        if (params.cityName) currentData.displayName = params.cityName;

        currentRawData = currentData;

        // 2. Fetch Forecast Data
        const forecastRes = await fetch(`/api/weather/forecast?${query}`);
        if (forecastRes.ok) {
            forecastRawData = await forecastRes.json();
        }

        // 3. Fetch Air Quality Index (AQI) Data
        const lat = currentData.coord.lat;
        const lon = currentData.coord.lon;
        fetchAQIData(lat, lon);

        // Update UI components
        updateCurrentWeatherUI(currentData);
        if (forecastRawData) updateForecastUI(forecastRawData);
        updateSolarArcUI(currentData);
        updateWindCompassUI(currentData.wind);
        initRadarMap(lat, lon, currentData.name);

        // Favorite Button State
        if (currentUser) {
            saveFavBtn.classList.remove('hidden');
            saveFavBtn.dataset.city = currentData.name;
            saveFavBtn.dataset.country = currentData.sys.country;
            checkIfCurrentCityIsFavorite(currentData.name, currentData.sys.country);
        }

    } catch (error) {
        showNotification(error.message);
    } finally {
        showLoading(false);
    }
}

// ----------------------------------------
// UI UPDATES: CURRENT WEATHER & DETAILS
// ----------------------------------------

function updateCurrentWeatherUI(data) {
    const nameStr = data.displayName || data.name;
    currentCityName.innerText = `${nameStr}, ${data.sys.country}`;
    currentDate.innerText = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    weatherIconBig.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    weatherIconBig.classList.remove('placeholder-pulse');

    tempValue.innerText = currentUnit === 'C' ? Math.round(data.main.temp) : cToF(data.main.temp);
    weatherCondition.innerText = data.weather[0].description;
    feelsLikeText.innerText = `Feels like ${formatTemp(data.main.feels_like)}`;

    humidityVal.innerText = `${data.main.humidity}%`;
    windVal.innerText = formatSpeed(data.wind.speed);
    tempMaxVal.innerText = formatTemp(data.main.temp_max);
    tempMinVal.innerText = formatTemp(data.main.temp_min);
    pressureVal.innerText = `${data.main.pressure} hPa`;
    visibilityVal.innerText = `${data.visibility ? (data.visibility / 1000).toFixed(1) : '--'} km`;

    // Update canvas scenery and theme
    updateDynamicBackground(data.weather[0].icon);
    initWeatherVisualScenery(data.weather[0].icon);

    // Update Outfit & Smart Advisory
    updateSmartOutfitAndActivities(data);
    updateAdvisoryBanner(data);
}

// ----------------------------------------
// 👕 SMART OUTFIT & ACTIVITY ENGINE
// ----------------------------------------

function updateSmartOutfitAndActivities(data) {
    const tempC = data.main.temp;
    const weatherMain = data.weather[0].main.toLowerCase();
    const windMs = data.wind.speed;
    const rainPop = (forecastRawData && forecastRawData.list[0].pop) ? forecastRawData.list[0].pop : 0;

    let attire = "";
    if (tempC <= 4) {
        attire = "Heavy insulated coat, thermal undershirt, warm gloves, scarf, and waterproof boots.";
    } else if (tempC > 4 && tempC <= 12) {
        attire = "Warm jacket or fleece sweater, long denim trousers, and covered footwear.";
    } else if (tempC > 12 && tempC <= 20) {
        attire = "Light jacket, hoodie, or cardigan with long pants.";
    } else if (tempC > 20 && tempC <= 27) {
        attire = "Breathable cotton t-shirt, shorts or light trousers, and sneakers.";
    } else {
        attire = "Lightweight sleeveless top, linen shorts, sunglasses, sunscreen (SPF 30+), and stay hydrated!";
    }

    if (weatherMain.includes('rain') || rainPop > 0.3) {
        attire += " ☔ Carry an umbrella or wear a waterproof raincoat.";
    }
    if (windMs > 8) {
        attire += " 💨 A windbreaker jacket is highly recommended.";
    }

    document.getElementById('outfitRecommendation').innerText = attire;

    // Outdoor Fitness Ratings (1 to 10)
    let runScore = 10 - Math.abs(tempC - 15) * 0.4 - (rainPop * 5) - (windMs > 8 ? 2 : 0);
    let cycleScore = 10 - Math.abs(tempC - 18) * 0.3 - (rainPop * 6) - (windMs * 0.5);
    let diningScore = 10 - Math.abs(tempC - 22) * 0.5 - (rainPop * 8) - (windMs * 0.4);

    runScore = Math.max(1, Math.min(10, Math.round(runScore)));
    cycleScore = Math.max(1, Math.min(10, Math.round(cycleScore)));
    diningScore = Math.max(1, Math.min(10, Math.round(diningScore)));

    document.getElementById('scoreRunning').innerText = `${runScore}/10`;
    document.getElementById('barRunning').style.width = `${runScore * 10}%`;

    document.getElementById('scoreCycling').innerText = `${cycleScore}/10`;
    document.getElementById('barCycling').style.width = `${cycleScore * 10}%`;

    document.getElementById('scoreDining').innerText = `${diningScore}/10`;
    document.getElementById('barDining').style.width = `${diningScore * 10}%`;

    // Driving Risk Indicator
    const drivingBadge = document.getElementById('drivingHazardText');
    const barDriving = document.getElementById('barDriving');
    let drivingRisk = "Low Risk";
    let riskPct = 20;
    drivingBadge.className = 'score-badge badge-safe';

    if (weatherMain.includes('rain') || weatherMain.includes('thunderstorm') || data.visibility < 4000 || windMs > 12) {
        drivingRisk = "Caution: Wet / Low Visibility";
        riskPct = 65;
        drivingBadge.className = 'score-badge badge-accent';
    }
    if (weatherMain.includes('snow') || weatherMain.includes('squall') || windMs > 18) {
        drivingRisk = "High Hazard Risk";
        riskPct = 90;
        drivingBadge.className = 'score-badge badge-danger';
    }

    drivingBadge.innerText = drivingRisk;
    barDriving.style.width = `${riskPct}%`;
}

function updateAdvisoryBanner(data) {
    const weatherMain = data.weather[0].main.toLowerCase();
    const windMs = data.wind.speed;
    const tempC = data.main.temp;

    let showAdvisory = false;
    let msg = "";
    let iconClass = "fa-solid fa-circle-exclamation";

    if (weatherMain.includes('thunderstorm')) {
        showAdvisory = true;
        msg = "Thunderstorm Alert: Stay indoors and keep clear of open metal structures.";
        iconClass = "fa-solid fa-bolt";
    } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        showAdvisory = true;
        msg = "Precipitation Warning: Road surfaces are wet. Drive with caution.";
        iconClass = "fa-solid fa-umbrella";
    } else if (windMs > 10) {
        showAdvisory = true;
        msg = `High Wind Advisory: Strong gusts reaching ${formatSpeed(windMs)}. Secure loose outdoor objects.`;
        iconClass = "fa-solid fa-wind";
    } else if (tempC > 32) {
        showAdvisory = true;
        msg = "Excessive Heat Warning: Stay hydrated and avoid heavy outdoor exertion during midday.";
        iconClass = "fa-solid fa-temperature-high";
    }

    if (showAdvisory) {
        advisoryMsg.innerText = msg;
        advisoryIcon.className = iconClass;
        advisoryBanner.classList.remove('hidden');
    } else {
        advisoryBanner.classList.add('hidden');
    }
}

// ----------------------------------------
// 🍃 AIR QUALITY INDEX (AQI) FETCHING & UI
// ----------------------------------------

async function fetchAQIData(lat, lon) {
    try {
        const res = await fetch(`/api/weather/air_pollution?lat=${lat}&lon=${lon}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.list && data.list.length > 0) {
            aqiRawData = data.list[0];
            updateAQIUI(aqiRawData);
        }
    } catch (e) {
        console.error('AQI Error:', e);
    }
}

function updateAQIUI(aqiObj) {
    const aqi = aqiObj.main.aqi; // 1 to 5
    const comp = aqiObj.components;

    const badge = document.getElementById('aqiStatusBadge');
    const adviceText = document.getElementById('aqiAdviceText');

    const statusMap = {
        1: { text: "Good (AQI 1)", class: "badge-aqi-good", advice: "Air quality is satisfactory and poses little to no health risk." },
        2: { text: "Fair (AQI 2)", class: "badge-accent", advice: "Air quality is acceptable; acceptable for most people." },
        3: { text: "Moderate (AQI 3)", class: "badge-accent", advice: "Sensitive individuals should limit prolonged outdoor exertion." },
        4: { text: "Poor (AQI 4)", class: "badge-danger", advice: "Unhealthy for sensitive groups. Wear a face mask outdoors." },
        5: { text: "Very Poor (AQI 5)", class: "badge-danger", advice: "Hazardous health alert: Everyone should avoid outdoor activities." }
    };

    const status = statusMap[aqi] || statusMap[1];
    badge.innerText = status.text;
    badge.className = `badge ${status.class}`;
    adviceText.innerText = status.advice;

    document.getElementById('valPM25').innerText = comp.pm2_5 ? comp.pm2_5.toFixed(1) : '--';
    document.getElementById('valPM10').innerText = comp.pm10 ? comp.pm10.toFixed(1) : '--';
    document.getElementById('valNO2').innerText = comp.no2 ? comp.no2.toFixed(1) : '--';
    document.getElementById('valO3').innerText = comp.o3 ? comp.o3.toFixed(1) : '--';
    document.getElementById('valSO2').innerText = comp.so2 ? comp.so2.toFixed(1) : '--';
    document.getElementById('valCO').innerText = comp.co ? comp.co.toFixed(1) : '--';
}

// ----------------------------------------
// ☀️ SOLAR ARC & 🧭 WIND COMPASS
// ----------------------------------------

function updateSolarArcUI(data) {
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const now = data.dt;

    document.getElementById('sunriseTimeVal').innerText = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunsetTimeVal').innerText = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calculate solar arc ratio
    let pct = 0;
    if (now >= sunrise && now <= sunset) {
        pct = (now - sunrise) / (sunset - sunrise);
    } else if (now > sunset) {
        pct = 1;
    }

    // Solar Arc path calculation: M 30 100 A 120 80 0 0 1 270 100
    const angle = Math.PI * pct;
    const cx = 150 - 120 * Math.cos(angle);
    const cy = 100 - 80 * Math.sin(angle);

    const sunDot = document.getElementById('solarSunDot');
    if (sunDot) {
        sunDot.setAttribute('cx', cx);
        sunDot.setAttribute('cy', cy);
    }

    // UV Index calculation mock based on solar zenith
    const uvVal = (pct > 0 && pct < 1) ? Math.round(Math.sin(angle) * 9) : 0;
    const uvBadge = document.getElementById('uvIndexBadge');
    uvBadge.innerText = `UV Index: ${uvVal}`;
}

function updateWindCompassUI(wind) {
    const deg = wind.deg || 0;
    const speed = wind.speed || 0;

    const needle = document.getElementById('compassNeedle');
    if (needle) needle.style.transform = `rotate(${deg}deg)`;

    document.getElementById('windDegVal').innerText = deg;

    // Cardinal conversion
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dirIdx = Math.round(deg / 45) % 8;
    document.getElementById('windDirText').innerText = directions[dirIdx];

    // Beaufort Scale
    let bName = "Calm";
    let bDesc = "Smoke rises vertically";

    if (speed > 0.5 && speed <= 1.5) { bName = "Light Air"; bDesc = "Wind motion visible in smoke"; }
    else if (speed > 1.5 && speed <= 3.3) { bName = "Light Breeze"; bDesc = "Wind felt on exposed skin"; }
    else if (speed > 3.3 && speed <= 5.5) { bName = "Gentle Breeze"; bDesc = "Leaves & small twigs in motion"; }
    else if (speed > 5.5 && speed <= 8.0) { bName = "Moderate Breeze"; bDesc = "Small branches move, dust raised"; }
    else if (speed > 8.0 && speed <= 10.8) { bName = "Fresh Breeze"; bDesc = "Small trees in leaf begin to sway"; }
    else if (speed > 10.8 && speed <= 13.9) { bName = "Strong Breeze"; bDesc = "Large branches in motion"; }
    else if (speed > 13.9) { bName = "High Wind / Gale"; bDesc = "Whole trees in motion"; }

    document.getElementById('beaufortBadge').innerText = bName;
    document.getElementById('beaufortDesc').innerText = bDesc;
}

// ----------------------------------------
// FORECAST & HOURLY SLIDER LOGIC
// ----------------------------------------

function updateForecastUI(data) {
    forecastContainer.innerHTML = '';
    if (hourlyForecastContainer) hourlyForecastContainer.innerHTML = '';

    const hourlyItems = data.list.slice(0, 8); // 8 slots = 24 hours
    
    // Render Hourly Cards
    hourlyItems.forEach((item, index) => {
        const timeStr = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const rainChance = Math.round((item.pop || 0) * 100);

        if (hourlyForecastContainer) {
            const hCard = document.createElement('div');
            hCard.className = `hourly-card ${index === 0 ? 'active' : ''}`;
            hCard.dataset.index = index;
            hCard.innerHTML = `
                <span class="time">${timeStr}</span>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                <span class="temp">${formatTemp(item.main.temp)}</span>
                <span class="rain-indicator"><i class="fa-solid fa-droplet"></i> ${rainChance}%</span>
            `;
            hCard.addEventListener('click', () => {
                timeScrubber.value = index;
                handleTimeScrubberChange();
            });
            hourlyForecastContainer.appendChild(hCard);
        }
    });

    // Populate Slider Ticks
    sliderTicks.innerHTML = '';
    hourlyItems.forEach((item, index) => {
        const span = document.createElement('span');
        span.innerText = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' });
        sliderTicks.appendChild(span);
    });

    // 5-Day Daily Grouping
    const dailyData = [];
    data.list.forEach(item => {
        const dayStr = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyData.find(d => d.day === dayStr) && dailyData.length < 5) {
            dailyData.push({
                day: dayStr,
                temp: item.main.temp,
                icon: item.weather[0].icon
            });
        }
    });

    dailyData.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p><strong>${day.day}</strong></p>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="icon">
            <p><strong>${formatTemp(day.temp)}</strong></p>
        `;
        forecastContainer.appendChild(card);
    });

    // Render Multi-Metric Chart
    renderChart(data);
}

function handleTimeScrubberChange() {
    const idx = parseInt(timeScrubber.value);
    if (!forecastRawData || !forecastRawData.list[idx]) return;

    const item = forecastRawData.list[idx];
    const timeStr = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    selectedTimeBadge.innerText = `Preview: ${timeStr}`;

    // Highlight hourly card
    document.querySelectorAll('.hourly-card').forEach((card, i) => {
        if (i === idx) card.classList.add('active');
        else card.classList.remove('active');
    });

    // Temporarily update current display for scrubber preview
    tempValue.innerText = currentUnit === 'C' ? Math.round(item.main.temp) : cToF(item.main.temp);
    weatherCondition.innerText = item.weather[0].description;
    weatherIconBig.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`;
    humidityVal.innerText = `${item.main.humidity}%`;
    windVal.innerText = formatSpeed(item.wind.speed);

    // Sync canvas scenery
    updateDynamicBackground(item.weather[0].icon);
    initWeatherVisualScenery(item.weather[0].icon);
}

// ----------------------------------------
// 📊 MULTI-METRIC ANALYTICS CHART
// ----------------------------------------

function renderChart(data) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    const items = data.list.slice(0, 8); // 24-hour breakdown

    const labels = items.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    let datasetLabel = 'Temperature';
    let chartValues = [];
    let borderColor = 'rgba(59, 130, 246, 1)';
    let bgColor = 'rgba(59, 130, 246, 0.2)';

    if (selectedMetric === 'temp') {
        datasetLabel = `Temperature (°${currentUnit})`;
        chartValues = items.map(item => currentUnit === 'C' ? item.main.temp : cToF(item.main.temp));
    } else if (selectedMetric === 'pop') {
        datasetLabel = 'Precipitation Probability (%)';
        chartValues = items.map(item => Math.round((item.pop || 0) * 100));
        borderColor = 'rgba(6, 182, 212, 1)';
        bgColor = 'rgba(6, 182, 212, 0.2)';
    } else if (selectedMetric === 'wind') {
        datasetLabel = currentUnit === 'C' ? 'Wind Speed (m/s)' : 'Wind Speed (mph)';
        chartValues = items.map(item => currentUnit === 'C' ? item.wind.speed : Math.round(item.wind.speed * 2.237));
        borderColor = 'rgba(245, 158, 11, 1)';
        bgColor = 'rgba(245, 158, 11, 0.2)';
    } else if (selectedMetric === 'humidity') {
        datasetLabel = 'Humidity (%)';
        chartValues = items.map(item => item.main.humidity);
        borderColor = 'rgba(168, 85, 247, 1)';
        bgColor = 'rgba(168, 85, 247, 0.2)';
    }

    if (currentChart) currentChart.destroy();

    const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary');

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: datasetLabel,
                data: chartValues,
                borderColor: borderColor,
                backgroundColor: bgColor,
                borderWidth: 3,
                fill: true,
                tension: 0.45,
                pointRadius: 4,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor, font: { weight: '600' } } }
            },
            scales: {
                x: { ticks: { color: textColor }, grid: { display: false } },
                y: { ticks: { color: textColor }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}

// ----------------------------------------
// 🗺️ LEAFLET RADAR MAP ENGINE
// ----------------------------------------

function initRadarMap(lat, lon, cityName) {
    const mapEl = document.getElementById('weatherMap');
    if (!mapEl) return;

    if (!weatherMap) {
        weatherMap = L.map('weatherMap').setView([lat, lon], 9);
        
        // Base OpenStreetMap Tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(weatherMap);

        // Marker
        mapMarker = L.marker([lat, lon]).addTo(weatherMap)
            .bindPopup(`<b>${cityName}</b>`).openPopup();

        // Click event on map to fetch weather
        weatherMap.on('click', (e) => {
            fetchWeatherData({ lat: e.latlng.lat, lon: e.latlng.lng });
        });

    } else {
        weatherMap.setView([lat, lon], 9);
        if (mapMarker) {
            mapMarker.setLatLng([lat, lon]).setPopupContent(`<b>${cityName}</b>`).openPopup();
        }
    }

    switchMapLayer(currentMapLayerName);
}

function switchMapLayer(layerKey) {
    if (!weatherMap) return;

    const layerMap = {
        'precipitation': 'precipitation_new',
        'clouds': 'clouds_new',
        'temp': 'temp_new',
        'wind': 'wind_new'
    };

    const targetLayer = layerMap[layerKey] || layerKey;
    currentMapLayerName = targetLayer;

    if (mapTileLayer) weatherMap.removeLayer(mapTileLayer);

    // Note: OpenWeather tile layer (if API key available)
    const apiKey = 'b1b15e88fa797225412429c1c50c122a'; // Demo fallback key or environment proxy
    mapTileLayer = L.tileLayer(`https://tile.openweathermap.org/map/${targetLayer}/{z}/{x}/{y}.png?appid=${apiKey}`, {
        opacity: 0.65
    }).addTo(weatherMap);
}

// ----------------------------------------
// 🔊 WEB AUDIO WEATHER SOUNDSCAPE SYNTHESIZER
// ----------------------------------------

function toggleSoundscape() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    soundscapeActive = !soundscapeActive;

    if (soundscapeActive) {
        audioCtx.resume();
        audioToggleBtn.classList.add('active');
        audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        startProceduralSoundscape();
        showNotification('Ambient Weather Soundscape Activated 🔊');
    } else {
        if (audioGainNode) audioGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        audioToggleBtn.classList.remove('active');
        audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        showNotification('Soundscape Muted 🔇');
    }
}

function startProceduralSoundscape() {
    if (!audioCtx || !soundscapeActive) return;

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for gentle rain / wind sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    audioGainNode = audioCtx.createGain();
    audioGainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(audioGainNode);
    audioGainNode.connect(audioCtx.destination);

    whiteNoise.start();
}

// ----------------------------------------
// ✈️ DUAL CITY TRAVEL COMPARATOR
// ----------------------------------------

async function handleDualCityCompare() {
    const query = document.getElementById('compareSearchInput').value.trim();
    if (!query) return;

    if (!currentRawData) {
        showNotification('Please load your main city weather first.');
        return;
    }

    try {
        const res = await fetch(`/api/weather/current?city=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Target city not found');
        const targetData = await res.json();

        // City 1 (Main City)
        document.getElementById('c1Name').innerText = currentRawData.name;
        document.getElementById('c1Icon').src = `https://openweathermap.org/img/wn/${currentRawData.weather[0].icon}.png`;
        document.getElementById('c1Temp').innerText = formatTemp(currentRawData.main.temp);
        document.getElementById('c1Cond').innerText = currentRawData.weather[0].description;
        document.getElementById('c1Hum').innerText = `${currentRawData.main.humidity}%`;
        document.getElementById('c1Wind').innerText = formatSpeed(currentRawData.wind.speed);

        // City 2 (Target City)
        document.getElementById('c2Name').innerText = targetData.name;
        document.getElementById('c2Icon').src = `https://openweathermap.org/img/wn/${targetData.weather[0].icon}.png`;
        document.getElementById('c2Temp').innerText = formatTemp(targetData.main.temp);
        document.getElementById('c2Cond').innerText = targetData.weather[0].description;
        document.getElementById('c2Hum').innerText = `${targetData.main.humidity}%`;
        document.getElementById('c2Wind').innerText = formatSpeed(targetData.wind.speed);

        // Diff summary
        const diff = Math.round(targetData.main.temp - currentRawData.main.temp);
        const summaryEl = document.getElementById('compareSummary');
        const summaryText = document.getElementById('compareSummaryText');

        if (diff > 0) {
            summaryText.innerText = `${targetData.name} is ${Math.abs(diff)}° warmer than ${currentRawData.name}. Pack lighter clothes! ☀️`;
        } else if (diff < 0) {
            summaryText.innerText = `${targetData.name} is ${Math.abs(diff)}° cooler than ${currentRawData.name}. Bring extra layers! 🧥`;
        } else {
            summaryText.innerText = `Both cities currently share the same temperature of ${formatTemp(currentRawData.main.temp)}!`;
        }

        summaryEl.classList.remove('hidden');

    } catch (err) {
        showNotification(err.message);
    }
}

// ----------------------------------------
// VISUAL CANVAS ANIMATION SCENERY
// ----------------------------------------

function updateDynamicBackground(iconCode) {
    const isNight = iconCode.includes('n');
    document.body.className = '';

    const themeStr = localStorage.getItem('theme');
    if (themeStr === 'dark' || (isNight && themeStr !== 'light')) {
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
        document.body.classList.add('clear-day');
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

        if (isThunder && Math.random() < 0.008) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        animationFrameId = requestAnimationFrame(render);
    }

    render();
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
    if (forecastRawData) renderChart(forecastRawData);
}

// ----------------------------------------
// AUTHENTICATION & FAVORITES LOGIC
// ----------------------------------------

async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            loginUser(data.user);
        }
    } catch (e) {}
}

function loginUser(user) {
    currentUser = user;
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userNameDisplay.innerText = user.username;
    if (currentRawData) saveFavBtn.classList.remove('hidden');
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

async function checkIfCurrentCityIsFavorite(city, country) {
    if (!currentUser || !city) return;
    try {
        const res = await fetch('/api/favorites');
        if (!res.ok) return;
        const favorites = await res.json();
        if (!Array.isArray(favorites)) return;

        const match = favorites.find(f => f.city.toLowerCase() === city.toLowerCase());
        if (match) {
            saveFavBtn.dataset.favId = match.id;
            saveFavBtn.classList.add('active');
            saveFavBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Saved';
        } else {
            saveFavBtn.dataset.favId = '';
            saveFavBtn.classList.remove('active');
            saveFavBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Save Location';
        }
    } catch (e) {}
}

async function toggleFavorite() {
    const city = saveFavBtn.dataset.city;
    const country = saveFavBtn.dataset.country;
    const favId = saveFavBtn.dataset.favId;

    if (!currentUser) {
        showNotification('Please log in to save favorites');
        showAuthModal('login');
        return;
    }
    if (!city) return;

    try {
        if (favId) {
            const res = await fetch(`/api/favorites/${favId}`, { method: 'DELETE' });
            if (res.ok) {
                saveFavBtn.dataset.favId = '';
                saveFavBtn.classList.remove('active');
                saveFavBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Save Location';
                showNotification(`${city} removed from favorites`);
            }
        } else {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, country })
            });
            if (res.ok) {
                showNotification(`${city} saved to favorites!`);
                checkIfCurrentCityIsFavorite(city, country);
            }
        }
    } catch (e) {
        showNotification('Error updating favorite');
    }
}

async function openDashboard() {
    dashboardModal.classList.remove('hidden');
    const favList = document.getElementById('favoritesList');
    const noFavs = document.getElementById('noFavsMsg');
    
    favList.innerHTML = '<div class="spinner"></div>';
    noFavs.classList.add('hidden');

    if (!currentUser) {
        favList.innerHTML = '';
        showNotification('Please log in to view saved locations');
        showAuthModal('login');
        return;
    }

    try {
        const res = await fetch('/api/favorites');
        if (!res.ok) throw new Error('Failed to load favorites');
        const data = await res.json();
        
        favList.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
            noFavs.classList.remove('hidden');
        } else {
            data.forEach(async (fav) => {
                const card = document.createElement('li');
                card.className = 'fav-card';
                card.innerHTML = `
                    <div style="flex:1;">
                        <strong><i class="fa-solid fa-location-dot" style="color:var(--danger-color); margin-right:0.4rem;"></i>${fav.city}</strong>, ${fav.country}
                        <p class="label" style="font-size:0.75rem;">Click to load forecast</p>
                    </div>
                    <button class="btn btn-danger" title="Remove"><i class="fa-solid fa-trash"></i></button>
                `;

                card.querySelector('div').addEventListener('click', () => {
                    fetchWeatherData({ city: fav.city });
                    dashboardModal.classList.add('hidden');
                });

                card.querySelector('button').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFavorite(fav.id, card);
                });

                favList.appendChild(card);
            });
        }
    } catch (e) {
        favList.innerHTML = '';
        showNotification(e.message || 'Error loading favorites');
    }
}

async function removeFavorite(id, cardEl) {
    try {
        const res = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
        if (res.ok) {
            if (cardEl) cardEl.remove();
            showNotification('Location removed from favorites');
        }
    } catch (e) {
        showNotification('Error removing favorite');
    }
}

// ----------------------------------------
// OVERLAY UTILS
// ----------------------------------------

function showLoading(show, msg = 'Loading...') {
    if (show) {
        document.getElementById('loadingMsg').innerText = msg;
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showNotification(msg) {
    notificationMsg.innerText = msg;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3500);
}
