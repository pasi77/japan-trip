// Samostatný JavaScript soubor pro ovládání hamburger menu a submenu
// Tento soubor funguje nezávisle na script.js

// Funkce pro inicializaci mobilního menu
function initMobileMenu() {
    // Pokud již bylo menu inicializováno, nebudeme ho inicializovat znovu
    if (window.mobileMenuInitialized) {
        return;
    }

    // Nastavíme globální proměnnou, abychom věděli, že menu již bylo inicializováno
    window.mobileMenuInitialized = true;

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!mobileMenuToggle || !mainNav || !menuOverlay) {
        // Pokud nejsou elementy k dispozici, zkusíme to znovu za chvíli
        setTimeout(initMobileMenu, 100);
        return;
    }

    const navLinks = document.querySelectorAll('.main-nav a');

    // Toggle menu when hamburger icon is clicked
    mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when overlay is clicked
    menuOverlay.addEventListener('click', function() {
        mainNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when Escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Inicializace submenu pro mobilní zařízení
    initSubmenu();
}

// Funkce pro inicializaci submenu
function initSubmenu() {
    const submenuToggle = document.getElementById('submenu-toggle');
    const subnavContainer = document.getElementById('subnav-container');

    if (!submenuToggle || !subnavContainer) {
        // Pokud nejsou elementy k dispozici, zkusíme to znovu za chvíli
        setTimeout(initSubmenu, 100);
        return;
    }

    // Toggle submenu when button is clicked
    submenuToggle.addEventListener('click', function() {
        subnavContainer.classList.toggle('active');
        submenuToggle.classList.toggle('active');
    });

    // Close submenu when a link in it is clicked
    const subnavLinks = document.querySelectorAll('.subnav a');
    subnavLinks.forEach(link => {
        link.addEventListener('click', function() {
            subnavContainer.classList.remove('active');
            submenuToggle.classList.remove('active');
        });
    });

    // Kontrola, zda je na stránce submenu
    // Pokud není, skryjeme tlačítko pro zobrazení submenu
    if (subnavLinks.length === 0) {
        submenuToggle.style.display = 'none';
    }
}

// Spustíme inicializaci ihned
if (document.readyState === 'loading') {
    // Pokud se dokument ještě načítá, počkáme na událost DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    // Pokud je dokument již načten, spustíme inicializaci ihned
    initMobileMenu();
}

// Pro jistotu zkusíme inicializovat menu ještě po 500ms
setTimeout(initMobileMenu, 500);
