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
