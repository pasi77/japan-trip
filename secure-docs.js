// Konstanty pro Google API
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// Proměnné pro konfiguraci, které budou načteny z config.js
// API_KEY není potřeba při použití OAuth 2.0 flow
let CLIENT_ID;
let FOLDERS;
let ALLOWED_EMAILS;

let tokenClient;
let gapiInited = false;
let gisInited = false;
let userProfile = null;

/**
 * Inicializace Google API
 */
function initializeGapiClient() {
    gapi.client.init({
        // apiKey není potřeba při použití OAuth 2.0 flow
        discoveryDocs: DISCOVERY_DOCS,
    }).then(() => {
        gapiInited = true;
        maybeEnableButtons();
    });
}

/**
 * Inicializace Google Identity Services
 */
function gisInit() {
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // Bude nastaveno později
            error_callback: (error) => {
                console.error('Chyba při inicializaci OAuth:', error);
                showError(`Chyba při inicializaci OAuth: ${error.type}. <br><br>
                         Možné příčiny:<br>
                         - Neplatné Client ID<br>
                         - Chybějící povolené redirects v Google Cloud Console<br>
                         - Chybějící povolené domény v OAuth consent screen<br><br>
                         Zkontrolujte nastavení v Google Cloud Console.`);
            }
        });
        gisInited = true;
        maybeEnableButtons();
    } catch (error) {
        console.error('Chyba při inicializaci Google Identity Services:', error);
        showError(`Chyba při inicializaci Google Identity Services: ${error.message}. <br><br>
                 Zkontrolujte nastavení v Google Cloud Console a ujistěte se, že Client ID je správné.`);
    }
}

/**
 * Povolení přihlašovacího tlačítka, pokud jsou obě API inicializovány
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('googleSignInButton').disabled = false;
    }
}

/**
 * Přihlášení uživatele
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error('Chyba při přihlašování:', resp);
            showError(`Chyba při přihlašování: ${resp.error}. <br><br>
                     Možné příčiny:<br>
                     - Váš účet nemá oprávnění pro přístup k této aplikaci<br>
                     - Aplikace není správně nakonfigurována v Google Cloud Console<br>
                     - Používáte firemní nebo školní účet s omezeními<br><br>
                     Zkuste použít jiný Google účet nebo kontaktujte správce webu.`);
            return;
        }

        // Získání informací o uživateli
        try {
            const response = await gapi.client.drive.about.get({
                fields: 'user'
            });

            const email = response.result.user.emailAddress;

            // Kontrola, zda je email v seznamu povolených
            if (ALLOWED_EMAILS.includes(email)) {
                userProfile = {
                    name: response.result.user.displayName,
                    email: email,
                    imageUrl: response.result.user.photoLink
                };

                // Zobrazení sekce s dokumenty
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('documents-section').style.display = 'block';

                // Nastavení informací o uživateli
                document.getElementById('user-name').textContent = userProfile.name;
                if (userProfile.imageUrl) {
                    document.getElementById('user-avatar').src = userProfile.imageUrl;
                }

                // Načtení dokumentů
                loadAllDocuments();
            } else {
                alert('Nemáte oprávnění pro přístup k těmto dokumentům.');
                handleSignoutClick();
            }
        } catch (err) {
            console.error('Chyba při získávání informací o uživateli:', err);
        }
    };

    try {
        if (gapi.client.getToken() === null) {
            // Při prvním přihlášení vždy zobrazit dialog pro souhlas
            tokenClient.requestAccessToken({
                prompt: 'consent',
                hint: ALLOWED_EMAILS[0] // Nápověda pro výběr správného účtu
            });
        } else {
            // Při dalších přihlášeních nezobrazovat dialog
            tokenClient.requestAccessToken({prompt: ''});
        }
    } catch (error) {
        console.error('Chyba při žádosti o přístupový token:', error);
        showError(`Chyba při žádosti o přístupový token: ${error.message}. <br><br>
                 Zkuste obnovit stránku nebo použít jiný prohlížeč.`);
    }
}

/**
 * Odhlášení uživatele
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');

        document.getElementById('login-section').style.display = 'block';
        document.getElementById('documents-section').style.display = 'none';
        userProfile = null;
    }
}

/**
 * Načtení všech dokumentů ze všech složek
 */
async function loadAllDocuments() {
    try {
        // Načtení dokumentů pro každou kategorii
        await loadDocumentsForCategory('flights', 'flights-list');
        await loadDocumentsForCategory('accommodation', 'accommodation-list');
        await loadDocumentsForCategory('tickets', 'tickets-list');
        await loadDocumentsForCategory('other', 'other-list');
    } catch (err) {
        console.error('Chyba při načítání dokumentů:', err);
    }
}

/**
 * Načtení dokumentů pro konkrétní kategorii
 */
async function loadDocumentsForCategory(folderKey, containerId) {
    try {
        const folderId = FOLDERS[folderKey];
        const response = await gapi.client.drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, webViewLink, thumbnailLink, createdTime)',
            orderBy: 'createdTime desc'
        });

        const files = response.result.files;
        const container = document.getElementById(containerId);

        if (files && files.length > 0) {
            container.innerHTML = '';

            files.forEach(file => {
                const card = createDocumentCard(file);
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<p>Žádné dokumenty nebyly nalezeny.</p>';
        }
    } catch (err) {
        console.error('Chyba při načítání dokumentů pro kategorii:', folderKey, err);
    }
}

/**
 * Vytvoření karty dokumentu
 */
function createDocumentCard(file) {
    const card = document.createElement('div');
    card.className = 'document-card';

    // Ikona podle typu souboru
    let iconClass = 'fas fa-file';
    if (file.mimeType === 'application/pdf') {
        iconClass = 'fas fa-file-pdf';
    } else if (file.mimeType.includes('image/')) {
        iconClass = 'fas fa-file-image';
    } else if (file.mimeType.includes('spreadsheet')) {
        iconClass = 'fas fa-file-excel';
    } else if (file.mimeType.includes('document')) {
        iconClass = 'fas fa-file-word';
    }

    // Formátování data
    const createdDate = new Date(file.createdTime);
    const formattedDate = createdDate.toLocaleDateString('cs-CZ');

    card.innerHTML = `
        <div class="document-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="document-info">
            <h4>${file.name}</h4>
            <p>Vytvořeno: ${formattedDate}</p>
            <a href="${file.webViewLink}" class="document-link" target="_blank">Zobrazit dokument</a>
        </div>
    `;

    return card;
}

/**
 * Inicializace po načtení stránky
 */
document.addEventListener('DOMContentLoaded', function() {
    // Kontrola, zda je CONFIG definován
    if (typeof CONFIG === 'undefined') {
        showError('Konfigurační soubor nebyl nalezen. Kontaktujte správce webu.');
        return;
    }

    // Načtení hodnot z konfigurace
    // API_KEY není potřeba při použití OAuth 2.0 flow
    CLIENT_ID = CONFIG.CLIENT_ID;
    FOLDERS = CONFIG.FOLDERS;
    ALLOWED_EMAILS = CONFIG.ALLOWED_EMAILS;

    // Kontrola, zda jsou všechny potřebné hodnoty definovány
    if (!CLIENT_ID || !FOLDERS || !ALLOWED_EMAILS) {
        showError('Konfigurační soubor je nekompletní. Kontaktujte správce webu.');
        return;
    }

    // Připojení událostí
    document.getElementById('googleSignInButton').addEventListener('click', handleAuthClick);
    document.getElementById('logout-button').addEventListener('click', handleSignoutClick);

    // Načtení Google API
    const scriptGapi = document.createElement('script');
    scriptGapi.src = 'https://apis.google.com/js/api.js';
    scriptGapi.onload = () => {
        gapi.load('client', initializeGapiClient);
    };
    document.head.appendChild(scriptGapi);

    // Načtení Google Identity Services
    const scriptGis = document.createElement('script');
    scriptGis.src = 'https://accounts.google.com/gsi/client';
    scriptGis.onload = gisInit;
    document.head.appendChild(scriptGis);
});

/**
 * Zobrazí chybovou hlášku
 */
function showError(message) {
    const loginSection = document.getElementById('login-section');
    loginSection.innerHTML = `
        <div style="color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;"><i class="fas fa-exclamation-triangle"></i> Chyba</h3>
            <p>${message}</p>
            <p>Zkuste stránku obnovit nebo kontaktujte správce webu.</p>
        </div>
    `;
}
