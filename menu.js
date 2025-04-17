// Samostatný JavaScript soubor pro ovládání hamburger menu
// Okamžitá inicializace hamburger menu bez čekání na DOMContentLoaded
(function() {
    // Funkce pro inicializaci mobilního menu
    function initMobileMenu() {
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
    }

    // Spustíme inicializaci ihned
    initMobileMenu();

    // A také po načtení DOMContentu pro jistotu
    document.addEventListener('DOMContentLoaded', initMobileMenu);
})();
