// CRM Training Portal - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadTariffs();
    loadSIMPlans();
    loadFAQ();
    loadNews();
    initializeSearch();
    initializeContactForm();
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update active nav link
                navLinks.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    // Show home section by default
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('active');
    }
}

// Load Internet Tariffs
function loadTariffs() {
    const container = document.getElementById('tariffs-container');
    if (!container) return;
    
    container.innerHTML = internetTariffs.map(tariff => `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card tariff-card h-100">
                <div class="card-header">
                    <h4>${tariff.name}</h4>
                </div>
                <div class="card-body">
                    <div class="text-center mb-3">
                        <div class="price">${tariff.price}</div>
                        <div class="speed">${tariff.speed}</div>
                    </div>
                    <p class="card-text">${tariff.description}</p>
                    <ul class="features">
                        ${tariff.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <hr>
                    <p><strong>Оборудование:</strong> ${tariff.equipment}</p>
                    <p><strong>Акция:</strong> <span class="badge bg-success">${tariff.promotion}</span></p>
                    <p><small class="text-muted">${tariff.conditions}</small></p>
                </div>
            </div>
        </div>
    `).join('');
}

// Load SIM Plans
function loadSIMPlans() {
    // Activ plans
    const activContainer = document.getElementById('activ-plans');
    if (activContainer) {
        activContainer.innerHTML = activPlans.map(plan => createPlanCard(plan, 'Activ')).join('');
    }
    
    // Altel plans
    const altelContainer = document.getElementById('altel-plans');
    if (altelContainer) {
        altelContainer.innerHTML = altelPlans.map(plan => createPlanCard(plan, 'Altel')).join('');
    }
}

function createPlanCard(plan, operator) {
    return `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card tariff-card h-100">
                <div class="card-header">
                    <h4>${plan.name}</h4>
                    <small>${operator}</small>
                </div>
                <div class="card-body">
                    <div class="text-center mb-3">
                        <div class="price">${plan.price}</div>
                    </div>
                    <ul class="features">
                        <li>${plan.gb}</li>
                        <li>${plan.minutes}</li>
                        <li>${plan.sms}</li>
                    </ul>
                    <p class="card-text">${plan.description}</p>
                    <p><small class="text-muted">${plan.conditions}</small></p>
                </div>
            </div>
        </div>
    `;
}

// Load FAQ
function loadFAQ() {
    // Internet FAQ
    const internetContainer = document.getElementById('faqInternetAccordion');
    if (internetContainer) {
        internetContainer.innerHTML = faqInternet.map((faq, index) => createFAQItem(faq, index, 'faqInternetAccordion')).join('');
    }
    
    // SIM FAQ
    const simContainer = document.getElementById('faqSimAccordion');
    if (simContainer) {
        simContainer.innerHTML = faqSim.map((faq, index) => createFAQItem(faq, index, 'faqSimAccordion')).join('');
    }
}

function createFAQItem(faq, index, parentId) {
    return `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${parentId}-${index}">
                    ${faq.question}
                </button>
            </h2>
            <div id="${parentId}-${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#${parentId}">
                <div class="accordion-body">
                    ${faq.answer}
                </div>
            </div>
        </div>
    `;
}

// Load News
function loadNews() {
    const homeContainer = document.getElementById('news-home');
    const newsContainer = document.getElementById('news-container');
    
    const newsHTML = news.map(item => createNewsCard(item)).join('');
    
    if (homeContainer) {
        homeContainer.innerHTML = news.slice(0, 3).map(item => createNewsCard(item)).join('');
    }
    
    if (newsContainer) {
        newsContainer.innerHTML = newsHTML;
    }
}

function createNewsCard(item) {
    const badgeColors = {
        'Новое': 'success',
        'Акция': 'warning',
        'Важно': 'danger',
        'Инфо': 'info',
        'Обновление': 'primary'
    };
    
    const badgeColor = badgeColors[item.badge] || 'secondary';
    
    return `
        <div class="card news-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-${badgeColor}">${item.badge}</span>
                    <small class="text-muted">${formatDate(item.date)}</small>
                </div>
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.content}</p>
                <small class="text-muted">${item.category}</small>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Search Functionality
function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            
            if (query.length < 2) {
                alert('Введите минимум 2 символа для поиска');
                return;
            }
            
            performSearch(query);
        });
    }
}

function performSearch(query) {
    const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) || 
               item.content.toLowerCase().includes(query);
    });
    
    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    // Switch to home section and show results
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    const homeSection = document.getElementById('home');
    homeSection.classList.add('active');
    
    // Create search results container
    let searchContainer = document.getElementById('search-results-container');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.id = 'search-results-container';
        homeSection.querySelector '.container').appendChild(searchContainer);
    }
    
    if (results.length === 0) {
        searchContainer.innerHTML = `
            <div class="alert alert-info mt-4">
                <h5>Результаты поиска: "${query}"</h5>
                <p>Ничего не найдено. Попробуйте другие ключевые слова.</p>
            </div>
        `;
    } else {
        searchContainer.innerHTML = `
            <div class="search-results mt-4">
                <h5>Результаты поиска: "${query}" (${results.length})</h5>
                ${results.map(result => `
                    <div class="search-result-item" onclick="navigateToSection('${result.section}')">
                        <h5>${result.title}</h5>
                        <p class="mb-0">${result.content.substring(0, 150)}...</p>
                        <small class="text-muted">Раздел: ${getSectionName(result.section)}</small>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Scroll to search results
    searchContainer.scrollIntoView({ behavior: 'smooth' });
}

function navigateToSection(sectionId) {
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (navLink) {
        navLink.click();
    }
}

function getSectionName(sectionId) {
    const names = {
        'internet': 'Домашний интернет',
        'services': 'Дополнительные услуги',
        'faq': 'FAQ',
        'news': 'Новости',
        'crm-training': 'Обучение CRM',
        'knowledge': 'База знаний'
    };
    return names[sectionId] || sectionId;
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // In a real application, this would send data to a server
            // For this local version, we'll just show a success message
            alert(`Спасибо за обращение, ${name}!\n\nВаше сообщение отправлено.\nМы свяжемся с вами по адресу ${email} в ближайшее время.`);
            
            contactForm.reset();
        });
    }
}

// Utility function to get element by ID safely
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id "${id}" not found`);
    }
    return element;
}

// Initialize tooltips if Bootstrap tooltips are used
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.section) {
        const section = document.getElementById(event.state.section);
        if (section) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            section.classList.add('active');
        }
    }
});

// Add loading state helper
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="spinner-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
            </div>
        `;
    }
}

// Add error handling helper
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger">
                <h5>Ошибка</h5>
                <p>${message}</p>
            </div>
        `;
    }
}

// Console log for debugging
console.log('CRM Training Portal initialized successfully');
console.log('Available sections:', ['home', 'crm-training', 'internet', 'services', 'faq', 'knowledge', 'news', 'contacts']);
console.log('Data loaded:', {
    tariffs: internetTariffs.length,
    activPlans: activPlans.length,
    altelPlans: altelPlans.length,
    faqInternet: faqInternet.length,
    faqSim: faqSim.length,
    news: news.length
});
