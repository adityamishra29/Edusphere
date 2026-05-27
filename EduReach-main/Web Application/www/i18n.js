const I18N_CACHE = {};
const I18N_STORAGE_KEY = 'edusphere_language';

// Determines the base path depending on the current page depth
function getTranslationsBasePath() {
    // Check if we are inside a subfolder like 'subjects/'
    if (window.location.pathname.includes('/subjects/')) {
        return '../translations/';
    }
    return 'translations/';
}

async function loadTranslations(lang) {
    if (I18N_CACHE[lang]) {
        return I18N_CACHE[lang];
    }
    try {
        const basePath = getTranslationsBasePath();
        const response = await fetch(`${basePath}${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang} translations`);
        }
        const translations = await response.json();
        I18N_CACHE[lang] = translations;
        return translations;
    } catch (error) {
        console.error('Error loading translations:', error);
        return null;
    }
}

async function applyTranslations(lang) {
    const translations = await loadTranslations(lang);
    if (!translations) return;

    // Save preference
    localStorage.setItem(I18N_STORAGE_KEY, lang);

    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            // Handle placeholders, inner HTML, or textContent
            if (el.tagName === 'INPUT' && el.type === 'search') {
                el.placeholder = translations[key];
            } else {
                el.innerHTML = translations[key];
            }
        }
    });

    // Update select dropdown to match active language
    const langSelects = document.querySelectorAll('.custom-lang-selector select');
    langSelects.forEach(select => {
        select.value = lang;
    });
}

function changeLanguage(langCode) {
    applyTranslations(langCode);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has a saved preference, otherwise default to 'en'
    const savedLang = localStorage.getItem(I18N_STORAGE_KEY) || 'en';
    applyTranslations(savedLang);
});
