document.addEventListener('DOMContentLoaded', function() {
    const errorMessage = document.getElementById('error-message');
    const weatherTabs = document.querySelectorAll('.weather-tab');
    const weatherContentContainer = document.getElementById('weather-content-container');

    // Přidání event listenerů pro subnav odkazy
    document.querySelectorAll('.subnav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust offset for fixed header and subnav
                const offset = 90;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active class in subnav
                document.querySelectorAll('.subnav a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Načteme API klíč z konfigurace
    if (typeof WEATHER_CONFIG === 'undefined' || !WEATHER_CONFIG.API_KEY) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = '<p>Chyba: Nebyl nalezen API klíč pro OpenWeatherMap. Zkontrolujte soubor weather-config.js.</p>';
        return;
    }
    
    // Použijeme API klíč z konfigurace
    loadWeatherData(WEATHER_CONFIG.API_KEY);

    // Simulace načítání dat o viditelnosti hory Fuji
    function loadFujiVisibilityData() {
        // Simulace dat - v reálném nasazení by zde byl API call na fuji-san.info
        // Pro demonstrační účely použijeme náhodná data

        // Aktualizace času
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = now.toLocaleDateString('cs-CZ', options);
        document.getElementById('fuji-update-time').textContent = 'Aktualizováno: ' + formattedDate;

        // Simulace indexů viditelnosti (1-10)
        const northAM = Math.floor(Math.random() * 10) + 1;
        const northPM = Math.floor(Math.random() * 10) + 1;
        const southAM = Math.floor(Math.random() * 10) + 1;
        const southPM = Math.floor(Math.random() * 10) + 1;

        // Nastavení hodnot
        const northAMElement = document.getElementById('fuji-north-am');
        const northPMElement = document.getElementById('fuji-north-pm');
        const southAMElement = document.getElementById('fuji-south-am');
        const southPMElement = document.getElementById('fuji-south-pm');

        northAMElement.textContent = northAM;
        northPMElement.textContent = northPM;
        southAMElement.textContent = southAM;
        southPMElement.textContent = southPM;

        // Nastavení barev podle hodnoty indexu
        setIndexColor(northAMElement, northAM);
        setIndexColor(northPMElement, northPM);
        setIndexColor(southAMElement, southAM);
        setIndexColor(southPMElement, southPM);
    }

    // Funkce pro nastavení barvy indexu viditelnosti
    function setIndexColor(element, value) {
        if (value <= 2) {
            element.style.backgroundColor = '#ff0000';
        } else if (value <= 4) {
            element.style.backgroundColor = '#ff9900';
        } else if (value <= 6) {
            element.style.backgroundColor = '#ffff00';
        } else if (value <= 8) {
            element.style.backgroundColor = '#99cc00';
        } else {
            element.style.backgroundColor = '#009900';
        }

        // Nastavení barvy textu pro lepší čitelnost
        if (value <= 4) {
            element.style.color = 'white';
        } else {
            element.style.color = 'black';
        }
    }

    // Načtení dat o viditelnosti hory Fuji při načtení stránky
    loadFujiVisibilityData();

    // Tab switching functionality
    weatherTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            weatherTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const city = tab.getAttribute('data-city');
            const weatherContents = document.querySelectorAll('.weather-content');
            weatherContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-city') === city) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Function to load weather data for all cities
    function loadWeatherData(apiKey) {
        weatherContentContainer.innerHTML = '';

        weatherTabs.forEach(tab => {
            const city = tab.getAttribute('data-city');
            const lat = tab.getAttribute('data-lat');
            const lon = tab.getAttribute('data-lon');

            const weatherContent = document.createElement('div');
            weatherContent.className = 'weather-content';
            weatherContent.setAttribute('data-city', city);
            if (tab.classList.contains('active')) {
                weatherContent.classList.add('active');
            }

            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading';
            loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
            weatherContent.appendChild(loadingDiv);

            weatherContentContainer.appendChild(weatherContent);

            // Fetch weather data from OpenWeatherMap API
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=cs&appid=${apiKey}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Process and display weather data
                    displayWeatherData(data, city);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    errorMessage.style.display = 'block';
                    loadingDiv.innerHTML = '<p>Nepodařilo se načíst data o počasí.</p>';
                });
        });
    }

    // Slovník pro překlad anglických popisů počasí do češtiny
    const weatherTranslations = {
        'clear sky': 'jasno',
        'few clouds': 'malá oblačnost',
        'scattered clouds': 'polojasno',
        'broken clouds': 'oblačno',
        'overcast clouds': 'zataženo',
        'shower rain': 'přeháňky',
        'rain': 'déšť',
        'light rain': 'slabý déšť',
        'moderate rain': 'mírný déšť',
        'heavy intensity rain': 'silný déšť',
        'thunderstorm': 'bouřka',
        'snow': 'sněžení',
        'light snow': 'slabé sněžení',
        'mist': 'mlha',
        'fog': 'hustá mlha',
        'haze': 'opar',
        'smoke': 'kouř',
        'dust': 'prach',
        'sand': 'písek',
        'drizzle': 'mrholení',
        'light intensity drizzle': 'slabé mrholení',
        'heavy intensity drizzle': 'silné mrholení',
        'thunderstorm with light rain': 'bouřka se slabým deštěm',
        'thunderstorm with rain': 'bouřka s deštěm',
        'thunderstorm with heavy rain': 'bouřka se silným deštěm'
    };

    // Funkce pro překlad popisů počasí
    function translateWeatherDescription(description) {
        return weatherTranslations[description.toLowerCase()] || description;
    }

    // Function to display weather data
    function displayWeatherData(data, city) {
        const weatherContent = document.querySelector(`.weather-content[data-city="${city}"]`);
        weatherContent.innerHTML = '';

        // Create weather card
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';

        // Create weather card header
        const weatherCardHeader = document.createElement('div');
        weatherCardHeader.className = 'weather-card-header';
        weatherCardHeader.innerHTML = `
            <h3>${city}</h3>
            <span>${data.city.country}</span>
        `;
        weatherCard.appendChild(weatherCardHeader);

        // Create weather card body
        const weatherCardBody = document.createElement('div');
        weatherCardBody.className = 'weather-card-body';

        // Current weather (first item in the forecast)
        const currentWeather = data.list[0];
        const currentWeatherDiv = document.createElement('div');
        currentWeatherDiv.className = 'current-weather';
        currentWeatherDiv.innerHTML = `
            <div class="current-weather-icon">
                <i class="${getWeatherIconClass(currentWeather.weather[0].icon)}" title="${translateWeatherDescription(currentWeather.weather[0].description)}"></i>
            </div>
            <div class="current-weather-info">
                <h4 class="current-weather-temp">${Math.round(currentWeather.main.temp)}°C</h4>
                <p class="current-weather-desc">${translateWeatherDescription(currentWeather.weather[0].description)}</p>
                <div class="current-weather-details">
                    <div class="weather-detail">
                        <i class="wi wi-thermometer"></i>
                        <span>Pocitově: ${Math.round(currentWeather.main.feels_like)}°C</span>
                    </div>
                    <div class="weather-detail">
                        <i class="wi wi-humidity"></i>
                        <span>Vlhkost: ${currentWeather.main.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <i class="wi wi-strong-wind"></i>
                        <span>Vítr: ${Math.round(currentWeather.wind.speed * 3.6)} km/h</span>
                    </div>
                </div>
            </div>
        `;
        weatherCardBody.appendChild(currentWeatherDiv);

        // 5-day forecast
        const forecastDiv = document.createElement('div');
        forecastDiv.className = 'forecast';

        // Group forecast by day (using date)
        const dailyForecasts = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('cs-CZ', { weekday: 'short', month: 'numeric', day: 'numeric' });

            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    temps: [],
                    icons: [],
                    descriptions: [],
                    dt: item.dt
                };
            }

            dailyForecasts[date].temps.push(item.main.temp);
            dailyForecasts[date].icons.push(item.weather[0].icon);
            dailyForecasts[date].descriptions.push(item.weather[0].description);
        });

        // Create forecast day cards (limit to 7 days)
        Object.keys(dailyForecasts).slice(0, 7).forEach(date => {
            const forecast = dailyForecasts[date];

            // Calculate average temperature
            const avgTemp = forecast.temps.reduce((sum, temp) => sum + temp, 0) / forecast.temps.length;

            // Get most frequent icon and description
            const iconCounts = {};
            forecast.icons.forEach(icon => {
                iconCounts[icon] = (iconCounts[icon] || 0) + 1;
            });
            const mostFrequentIcon = Object.keys(iconCounts).reduce((a, b) => iconCounts[a] > iconCounts[b] ? a : b);

            const descCounts = {};
            forecast.descriptions.forEach(desc => {
                descCounts[desc] = (descCounts[desc] || 0) + 1;
            });
            const mostFrequentDesc = Object.keys(descCounts).reduce((a, b) => descCounts[a] > descCounts[b] ? a : b);

            const forecastDayDiv = document.createElement('div');
            forecastDayDiv.className = 'forecast-day';
            forecastDayDiv.innerHTML = `
                <div class="forecast-date">${date}</div>
                <div class="forecast-icon">
                    <i class="${getWeatherIconClass(mostFrequentIcon)}" title="${translateWeatherDescription(mostFrequentDesc)}"></i>
                </div>
                <div class="forecast-temp">${Math.round(avgTemp)}°C</div>
                <div class="forecast-desc">${translateWeatherDescription(mostFrequentDesc)}</div>
            `;
            forecastDiv.appendChild(forecastDayDiv);
        });

        weatherCardBody.appendChild(forecastDiv);
        weatherCard.appendChild(weatherCardBody);
        weatherContent.appendChild(weatherCard);
    }
});
