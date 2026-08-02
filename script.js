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

// Mobile navigation toggle: robust overlay menu with backdrop
(function() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // ensure there's at least one .nav-toggle in the nav
    let toggles = Array.from(nav.querySelectorAll('.nav-toggle'));
    if (!toggles.length) {
        const btn = document.createElement('button');
        btn.className = 'nav-toggle';
        btn.setAttribute('aria-label', 'Toggle navigation');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '&#9776;';
        const ul = nav.querySelector('ul');
        if (ul) nav.insertBefore(btn, ul);
        else nav.appendChild(btn);
        toggles = [btn];
    }

    function addBackdrop() {
        let backdrop = document.querySelector('.nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'nav-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', closeMenu);
        }
        return backdrop;
    }

    function removeBackdrop() {
        const existing = document.querySelector('.nav-backdrop');
        if (existing) existing.remove();
    }

    function openMenu() {
        nav.classList.add('open');
        toggles.forEach(t => t.setAttribute('aria-expanded', 'true'));
        addBackdrop();
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        nav.classList.remove('open');
        toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
        removeBackdrop();
        document.body.style.overflow = '';
    }

    // Attach handlers to all toggles. Use event delegation removal by replacing nodes to avoid duplicate listeners.
    toggles.forEach(t => {
        const newT = t.cloneNode(true);
        t.parentNode.replaceChild(newT, t);
    });
    toggles = Array.from(nav.querySelectorAll('.nav-toggle'));
    toggles.forEach(t => t.addEventListener('click', (e) => {
        e.stopPropagation();
        if (nav.classList.contains('open')) closeMenu(); else openMenu();
    }));

    // Delegated click handler as a fallback (catches taps even if individual listeners fail)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.nav-toggle');
        if (btn && nav.contains(btn)) {
            e.preventDefault();
            if (nav.classList.contains('open')) closeMenu(); else openMenu();
        }
    });

    // close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });

    // close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('open')) closeMenu();
    });

    // Ensure nav links work while menu is open: close overlay then navigate
    const navLinks = Array.from(nav.querySelectorAll('a'));
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href) return;
            // on-page anchors: intercept and smooth-scroll after closing menu
            if (href.startsWith('#')) {
                e.preventDefault();
                closeMenu();
                const target = document.querySelector(href);
                if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 60);
                return;
            }
            // For normal links, close the menu and navigate programmatically (mobile-safe)
            e.preventDefault();
            closeMenu();
            // respect target (e.g., _blank)
            const targetAttr = link.getAttribute('target');
            setTimeout(() => {
                if (targetAttr === '_blank') window.open(href, '_blank');
                else window.location.href = href;
            }, 80);
        });
    });
})();
