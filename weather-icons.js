// Mapování kódů ikon OpenWeatherMap na třídy Weather Icons
const weatherIconsMap = {
    // Jasno
    '01d': 'wi wi-day-sunny',
    '01n': 'wi wi-night-clear',

    // Polojasno
    '02d': 'wi wi-day-cloudy',
    '02n': 'wi wi-night-alt-cloudy',

    // Oblačno
    '03d': 'wi wi-cloud',
    '03n': 'wi wi-cloud',

    // Zataženo
    '04d': 'wi wi-cloudy',
    '04n': 'wi wi-cloudy',

    // Přeháňky
    '09d': 'wi wi-showers',
    '09n': 'wi wi-night-alt-showers',

    // Déšť
    '10d': 'wi wi-day-rain',
    '10n': 'wi wi-night-alt-rain',

    // Bouřka
    '11d': 'wi wi-thunderstorm',
    '11n': 'wi wi-thunderstorm',

    // Sněžení
    '13d': 'wi wi-snow',
    '13n': 'wi wi-snow',

    // Mlha
    '50d': 'wi wi-fog',
    '50n': 'wi wi-fog'
};

// Funkce pro získání třídy ikony podle kódu OpenWeatherMap
function getWeatherIconClass(iconCode) {
    return weatherIconsMap[iconCode] || 'wi wi-na';
}
