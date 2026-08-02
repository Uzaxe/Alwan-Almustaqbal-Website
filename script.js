// Alwan Almustaqbal - Smooth Scrolling & Service Filtering

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Service filtering logic
const serviceFilterButtons = document.querySelectorAll('#filter-container [data-filter]');
const serviceGroups = document.querySelectorAll('.service-group');

function setActiveFilter(buttons, filterType) {
    buttons.forEach(button => {
        const isActive = button.getAttribute('data-filter') === filterType;
        button.classList.toggle('active', isActive);
    });
}

function filterGroups(groups, filterType, statusId, labelPrefix) {
    groups.forEach(group => {
        const shouldShow = filterType === 'all' || group.dataset.category === filterType;
        group.style.display = shouldShow ? '' : 'none';
    });

    const status = document.getElementById(statusId);
    if (status) {
        const label = filterType === 'all'
            ? `Showing all ${labelPrefix}`
            : `${filterType.charAt(0).toUpperCase()}${filterType.slice(1)} ${labelPrefix}`;
        status.textContent = label;
    }
}

if (serviceFilterButtons.length && serviceGroups.length) {
    serviceFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.getAttribute('data-filter');
            filterGroups(serviceGroups, filterType, 'filter-status', 'services');
            setActiveFilter(serviceFilterButtons, filterType);
        });
    });

    filterGroups(serviceGroups, 'all', 'filter-status', 'services');
    setActiveFilter(serviceFilterButtons, 'all');
}

const industryFilterButtons = document.querySelectorAll('#industry-tabs [data-filter]');
const industryGroups = document.querySelectorAll('.industry-group');

if (industryFilterButtons.length && industryGroups.length) {
    industryFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.getAttribute('data-filter');
            filterGroups(industryGroups, filterType, 'filter-status-industries', 'industries');
            setActiveFilter(industryFilterButtons, filterType);
        });
    });

    filterGroups(industryGroups, 'all', 'filter-status-industries', 'industries');
    setActiveFilter(industryFilterButtons, 'all');
}

// Smooth scroll for anchor links (fallback)
document.documentElement.style.scrollBehavior = 'smooth';

// Mobile navigation toggle: injects a toggle button when needed and handles open/close
(function() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Create toggle if not present
    let toggle = nav.querySelector('.nav-toggle');
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Toggle navigation');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;'; // hamburger
        // insert before the nav UL or at end
        const ul = nav.querySelector('ul');
        if (ul) nav.insertBefore(toggle, ul);
        else nav.appendChild(toggle);
    }

    function closeNav() {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        // When menu opens, add body padding-top equal to nav's height so content is pushed down
        if (isOpen) {
            const h = nav.getBoundingClientRect().height;
            document.body.style.paddingTop = h + 'px';
        } else {
            document.body.style.paddingTop = '';
        }
    });

    // Close menu when clicking outside or when resizing to desktop
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && nav.classList.contains('open')) closeNav();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('open')) closeNav();
        // If window resized while open, update body padding to match new nav height
        if (nav.classList.contains('open')) {
            const h = nav.getBoundingClientRect().height;
            document.body.style.paddingTop = h + 'px';
        }
    });
})();
