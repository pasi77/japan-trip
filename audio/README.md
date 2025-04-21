# Audio soubory pro japonské fráze

Pro správné fungování přehrávání japonských frází na stránce s jazykem je potřeba stáhnout audio soubory a umístit je do této složky.

## Postup pro stažení audio souborů

1. Stáhněte audio soubory pro všechny fráze z Google Translate Text-to-Speech API nebo jiného zdroje.
2. Pojmenujte soubory podle následujícího schématu:
   - konnichiwa.mp3
   - ohayou-gozaimasu.mp3
   - konbanwa.mp3
   - arigatou-gozaimasu.mp3
   - doumo-arigatou-gozaimasu.mp3
   - onegaishimasu.mp3
   - douzo.mp3
   - hai.mp3
   - iie.mp3
   - sumimasen.mp3
   - gomennasai.mp3
   - wakarimasen.mp3
   - wakarimashita.mp3
   - eigo-ga-hanasemasu-ka.mp3
   - nihongo-ga-hanasemasen.mp3
   - yukkuri-hanashite-kudasai.mp3
   - toire-wa-doko-desu-ka.mp3
   - eki-wa-doko-desu-ka.mp3
   - ni-wa-dou-ikeba-ii-desu-ka.mp3
   - tooi-desu-ka.mp3
3. Umístěte všechny soubory do této složky.

## Alternativní řešení

Pokud nemáte možnost stáhnout audio soubory, můžete použít následující alternativní řešení:

1. Vytvořte jednoduchý serverový proxy skript, který bude zprostředkovávat požadavky na Google TTS API.
2. Upravte funkci `playPhrase` v souboru language.html, aby používala váš proxy server místo přímého volání Google TTS API.

Příklad proxy skriptu v PHP:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: audio/mpeg');

$phrase = $_GET['phrase'];
$url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ja&q=" . urlencode($phrase);

echo file_get_contents($url);
?>
```

Poté upravte funkci `playPhrase` v souboru language.html:

```javascript
function playPhrase(phrase) {
    const encodedPhrase = encodeURIComponent(phrase);
    const audioUrl = `https://vas-server.com/tts-proxy.php?phrase=${encodedPhrase}`;
    const audio = new Audio(audioUrl);
    audio.play();
}
```

## Proč to nefunguje na GitHub Pages?

GitHub Pages má bezpečnostní omezení, která zabraňují přímému volání Google TTS API z prohlížeče. Toto omezení je známé jako CORS (Cross-Origin Resource Sharing) a je implementováno ve všech moderních prohlížečích.

Když se pokusíte přehrát zvuk přímo z Google TTS API na GitHub Pages, prohlížeč zablokuje požadavek, protože Google nepovoluje přístup z jiných domén (jako je github.io).

Proto je potřeba buď:
1. Používat předem stažené audio soubory (doporučeno)
2. Použít proxy server, který zprostředkuje požadavky na Google TTS API
