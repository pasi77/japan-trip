# Japonsko 2025 - Cestovní průvodce

Toto je webová aplikace pro cestovní průvodce po Japonsku pro říjen 2025.

## Obsah

- `index.html` - Hlavní stránka s přehledem, převodníkem měn, vzdálenostmi a doporučenými aplikacemi
- `itinerary.html` - Podrobný itinerář cesty
- `budget.html` - Rozpočet cesty
- `practical-info.html` - Praktické informace pro cestu
- `language.html` - Japonský jazyk a užitečné fráze
- `maps-*.html` - Interaktivní mapy různých měst v Japonsku
- `weather.html` - Předpověď počasí a viditelnost hory Fuji
- `food.html` - Informace o japonském jídle a restauracích
- `links.html` - Užitečné odkazy

## Technické informace

- Aplikace používá pouze HTML, CSS a JavaScript
- Pro ikony je použita knihovna Font Awesome
- Pro mapy je použita knihovna Leaflet
- Pro předpověď počasí je použito OpenWeatherMap API (klíč je v souboru key.env)

## Spuštění

Stačí otevřít soubor `index.html` v prohlížeči.

## Známé problémy

### Přehrávání japonských frází

Přehrávání japonských frází na stránce s jazykem je nyní implementováno pomocí Web Speech API, které je podporováno ve většině moderních prohlížečů. Toto řešení by mělo fungovat i na GitHub Pages bez nutnosti použít proxy server nebo nahrávat audio soubory lokálně.

Pokud by přehrávání zvuků nefungovalo, máte následující možnosti:

1. **Použít jiný prohlížeč** - Web Speech API je nejlépe podporováno v prohlížečích Chrome, Edge a Safari
2. **Stáhnout audio soubory** - Můžete stáhnout audio soubory a umístit je do složky `audio/` (viz instrukce v souboru `audio/README.md`)
3. **Spustit stránku lokálně** - Lokálně stránka funguje správně, protože prohlížeč neblokuje požadavky na Google TTS API

#### Jak funguje přehrávání zvuků

Přehrávání zvuků je implementováno s několika záložními metodami v tomto pořadí:

1. **Web Speech API** - Nejprve se pokusíme použít Web Speech API, které je podporováno ve většině moderních prohlížečů
2. **Lokální audio soubory** - Pokud Web Speech API není k dispozici nebo selhává, zkusíme přehrát zvuk z lokálního souboru
3. **Google TTS API** - Jako poslední možnost zkusíme přímé použití Google TTS API (funguje pouze lokálně)
