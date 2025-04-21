# Japonsko 2025 - Cestovní průvodce

Toto je webová aplikace pro cestovní průvodce po Japonsku pro říjen 2025.

## Obsah

- `index.html` - Hlavní stránka s přehledem, převodníkem měn, vzdálenostmi a doporučenými aplikacemi
- `itinerary.html` - Podrobný itinerář cesty
- `budget.html` - Rozpočet cesty
- `practical-info.html` - Tipy pro cestu
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

1. Vytvořte soubor `config.js` podle šablony `config.template.js` a doplňte vaše skutečné hodnoty (viz sekce "Konfigurace" níže)
2. Otevřete soubor `index.html` v prohlížeči

## Konfigurace

Pro správnou funkci sekce "Dokumenty" je potřeba vytvořit soubor `config.js` s vašimi přístupovými údaji k Google Drive API:

1. Vytvořte projekt v [Google Cloud Console](https://console.cloud.google.com/)
2. Povolte Google Drive API pro váš projekt
3. Vytvořte OAuth 2.0 Client ID a API klíč
4. Vytvořte soubor `config.js` podle šablony `config.template.js` a doplňte vaše hodnoty:

```javascript
// config.js - OBSAHUJE SKUTEČNÉ HODNOTY, NENÍ V GITU
const CONFIG = {
  // API klíč z Google Cloud Console
  API_KEY: 'vaše_skutečné_api_key',

  // Client ID z Google Cloud Console
  CLIENT_ID: 'vaše_skutečné_client_id',

  // Seznam povolených emailů pro přístup k dokumentům
  ALLOWED_EMAILS: ['vas@email.cz'],

  // ID složek v Google Drive
  FOLDERS: {
    flights: 'id_složky_s_letenkami',
    accommodation: 'id_složky_s_ubytováním',
    tickets: 'id_složky_se_vstupenkami',
    other: 'id_složky_s_ostatními_dokumenty'
  }
};
```

### Bezpečnostní poznámky

- Soubor `config.js` je přidán do `.gitignore`, aby nebyl nahrán do veřejného repozitáře
- Při nasazení na GitHub Pages je potřeba ručně přidat soubor `config.js` do vašeho hostingu
- Pro zvýšení bezpečnosti doporučujeme:
  - Omezit API klíč pouze na vaši doménu v Google Cloud Console
  - Nastavit povolené JavaScript origin URL pro OAuth Client ID
  - Použít minimální potřebné oprávnění (scope) pro Google Drive API

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
