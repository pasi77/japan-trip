// Konfigurace Google API
const API_KEY = 'VAŠE_API_KEY';
const CLIENT_ID = 'VAŠE_CLIENT_ID';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// ID složek v Google Drive (nahraďte skutečnými ID)
const FOLDERS = {
    flights: 'ID_SLOŽKY_S_LETENKAMI',
    accommodation: 'ID_SLOŽKY_S_UBYTOVÁNÍM',
    tickets: 'ID_SLOŽKY_SE_VSTUPENKAMI',
    other: 'ID_SLOŽKY_S_OSTATNÍMI_DOKUMENTY'
};

// Seznam povolených emailů (v produkci by měl být na serveru)
const ALLOWED_EMAILS = ['vas@email.cz'];

let tokenClient;
let gapiInited = false;
let gisInited = false;
let userProfile = null;

/**
 * Inicializace Google API
 */
function initializeGapiClient() {
    gapi.client.init({
        apiKey: API_KEY,
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
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Bude nastaveno později
    });
    gisInited = true;
    maybeEnableButtons();
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

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
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
