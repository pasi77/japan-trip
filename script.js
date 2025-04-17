document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Itinerary Day Toggle
    setupDayToggle();

    // Currency Converter
    setupCurrencyConverter();

    // Load Itinerary Completion Status
    loadCompletionStatus();

    // Handle hash links for day content
    handleHashLinks();

    // Setup subnav highlighting
    setupSubnavHighlighting();

    // Setup mobile menu
    setupMobileMenu();
});

// Countdown Timer Function
function updateCountdown() {
    const tripDate = new Date('October 8, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = tripDate - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    } else {
        document.getElementById('countdown-container').innerHTML = '<p>Cesta již začala!</p>';
    }
}

// Itinerary Day Toggle Function
function setupDayToggle() {
    const dayHeaders = document.querySelectorAll('.day-header');

    dayHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const dayId = this.getAttribute('data-day');
            const content = document.getElementById(dayId);

            // Toggle active class
            content.classList.toggle('active');

            // Toggle icon
            const icon = this.querySelector('i');
            if (content.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// Currency Converter Function
function setupCurrencyConverter() {
    const czkAmountInput = document.getElementById('czk-amount');
    const jpyAmountInput = document.getElementById('jpy-amount');
    const exchangeRateDisplay = document.getElementById('exchange-rate');
    const lastUpdatedDisplay = document.getElementById('last-updated');
    const amountButtons = document.querySelectorAll('.amount-btn');

    if (!czkAmountInput || !jpyAmountInput) return;

    // Exchange rate: 1 CZK = 6.4 JPY (approximate)
    let exchangeRate = 6.4;

    // Fetch current exchange rate from API
    fetchExchangeRate();

    // Function to fetch exchange rate
    function fetchExchangeRate() {
        // For demo purposes, we'll use a fixed rate
        // In production, you would use a real API
        exchangeRate = 6.4;

        // Update exchange rate display
        if (exchangeRateDisplay) {
            exchangeRateDisplay.textContent = `1 Kč = ${exchangeRate} JPY`;
        }

        // Update last updated display
        if (lastUpdatedDisplay) {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            lastUpdatedDisplay.textContent = `Aktualizováno: ${now.toLocaleDateString('cs-CZ', options)}`;
        }
    }

    // CZK to JPY conversion
    czkAmountInput.addEventListener('input', function() {
        if (this.value) {
            jpyAmountInput.value = Math.round(this.value * exchangeRate);
        } else {
            jpyAmountInput.value = '';
        }
    });

    // JPY to CZK conversion
    jpyAmountInput.addEventListener('input', function() {
        if (this.value) {
            czkAmountInput.value = (this.value / exchangeRate).toFixed(2);
        } else {
            czkAmountInput.value = '';
        }
    });

    // Amount buttons
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseFloat(this.getAttribute('data-amount'));

            if (this.classList.contains('jpy')) {
                jpyAmountInput.value = amount;
                czkAmountInput.value = (amount / exchangeRate).toFixed(2);
            } else {
                czkAmountInput.value = amount;
                jpyAmountInput.value = Math.round(amount * exchangeRate);
            }
        });
    });
}

// Toggle Day Function
function toggleDay(dayId, forceOpen = false) {
    const content = document.getElementById(dayId);

    // If forceOpen is true or content is not active, make it active
    if (forceOpen || !content.classList.contains('active')) {
        content.classList.add('active');
    } else {
        // Otherwise toggle the active state
        content.classList.toggle('active');
    }

    const header = document.querySelector(`.day-header[onclick="toggleDay('${dayId}')"]`);
    const icon = header.querySelector('i');

    if (content.classList.contains('active')) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// Itinerary Completion Functions
function markDayComplete(dayId) {
    const checkbox = document.querySelector(`input[onchange="markDayComplete('${dayId}')"]`);
    const statusIndicator = document.getElementById(`status-${dayId}`);

    if (checkbox && statusIndicator) {
        if (checkbox.checked) {
            statusIndicator.classList.add('completed');
        } else {
            statusIndicator.classList.remove('completed');
        }

        saveCompletionStatus();
    }
}

function saveCompletionStatus() {
    const checkboxes = document.querySelectorAll('.completion-checkbox input');
    const status = {};

    checkboxes.forEach(checkbox => {
        const dayId = checkbox.getAttribute('onchange').match(/'([^']+)'/)[1];
        status[dayId] = checkbox.checked;
    });

    localStorage.setItem('itineraryCompletionStatus', JSON.stringify(status));
}

function loadCompletionStatus() {
    const savedStatus = localStorage.getItem('itineraryCompletionStatus');

    if (savedStatus) {
        const status = JSON.parse(savedStatus);

        for (const dayId in status) {
            const checkbox = document.querySelector(`input[onchange="markDayComplete('${dayId}')"]`);
            const statusIndicator = document.getElementById(`status-${dayId}`);

            if (checkbox && statusIndicator && status[dayId]) {
                checkbox.checked = true;
                statusIndicator.classList.add('completed');
            }
        }
    }
}

// Handle hash links for day content
function handleHashLinks() {
    // Check if there's a hash in the URL when page loads
    if (window.location.hash) {
        const dayId = window.location.hash.substring(1); // Remove the # character
        openDayContent(dayId);
    }

    // Add click event listeners to all simplified item links
    const simplifiedLinks = document.querySelectorAll('.simplified-item');
    simplifiedLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default link behavior
            e.preventDefault();

            // Get the day ID from the href attribute
            const href = this.getAttribute('href');
            const dayId = href.substring(1); // Remove the # character

            // Open the day content
            openDayContent(dayId);

            // Update URL hash without triggering scroll
            history.pushState(null, null, href);
        });
    });
}

// Function to open day content
function openDayContent(dayId) {
    // Get the header element
    const header = document.querySelector(`.day-header[onclick="toggleDay('${dayId}')"]`);

    if (header) {
        // Directly call toggleDay function with forceOpen=true to ensure it opens
        toggleDay(dayId, true);

        // Scroll to the header
        setTimeout(() => {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// Simplified Itinerary Checkbox Functions
document.addEventListener('DOMContentLoaded', function() {
    const simplifiedCheckboxes = document.querySelectorAll('.simplified-checkbox');

    // Load saved states
    loadSimplifiedCheckboxStates();

    // Add event listeners
    simplifiedCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveSimplifiedCheckboxStates);
    });

    // Reset button
    const resetButton = document.getElementById('reset-simplified-itinerary');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Opravdu chcete resetovat všechny položky itineráře?')) {
                simplifiedCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                saveSimplifiedCheckboxStates();
            }
        });
    }
});

function saveSimplifiedCheckboxStates() {
    const checkboxes = document.querySelectorAll('.simplified-checkbox');
    const states = {};

    checkboxes.forEach((checkbox, index) => {
        states[`checkbox_${index}`] = checkbox.checked;
    });

    localStorage.setItem('simplifiedItineraryStates', JSON.stringify(states));
}

function loadSimplifiedCheckboxStates() {
    const savedStates = localStorage.getItem('simplifiedItineraryStates');

    if (savedStates) {
        const states = JSON.parse(savedStates);
        const checkboxes = document.querySelectorAll('.simplified-checkbox');

        checkboxes.forEach((checkbox, index) => {
            const savedState = states[`checkbox_${index}`];

            if (savedState !== undefined) {
                checkbox.checked = savedState;
            }
        });
    }
}

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    // Setup subnav highlighting
    setupSubnavHighlighting();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90,
                    behavior: 'smooth'
                });

                // Update active link in subnav
                if (this.closest('.subnav')) {
                    document.querySelectorAll('.subnav a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
});

// Setup Subnav Highlighting based on scroll position
function setupSubnavHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const simplifiedDays = document.querySelectorAll('.simplified-day[id]');
    const navLinks = document.querySelectorAll('.subnav a');

    if ((sections.length === 0 && simplifiedDays.length === 0) || navLinks.length === 0) return;

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY;

        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 90; // Adjust for header and subnav height
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });

        // Find the current simplified day section (for itinerary page)
        simplifiedDays.forEach(section => {
            const sectionTop = section.offsetTop - 90; // Adjust for header and subnav height
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });

        // Update active link in subnav
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });

    // Set initial active link based on scroll position
    window.dispatchEvent(new Event('scroll'));
}

// Mobile Menu Setup
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
