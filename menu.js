// Samostatný JavaScript soubor pro ovládání hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
});

// Funkce pro nastavení mobilního menu
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (!mobileMenuToggle || !mainNav || !menuOverlay) return;

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
}
