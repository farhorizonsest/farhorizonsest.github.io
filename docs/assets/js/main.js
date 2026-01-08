/* =========================================
   FAR HORIZONS - AI BEAST MODE ENGINE
   Handles: Translations, RTL/LTR, Mobile Menu
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Language
    const savedLang = localStorage.getItem('fh_lang') || 'en';
    setLanguage(savedLang);

    // 2. Initialize Mobile Menu
    setupMobileMenu();
});

// --- LANGUAGE SWITCHING LOGIC ---
async function setLanguage(lang) {
    try {
        console.log(`Attempting to switch to: ${lang}`); // DEBUG

        // FIX: Added '/' at the start to force Root Path
        // This ensures it works on localhost:8080/Contact_Us/ and localhost:8080/
        const response = await fetch(`/assets/json/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        
        const translations = await response.json();
        console.log("JSON Loaded Successfully"); // DEBUG

        // Apply Translations
        applyTranslations(translations);

        // Update Direction & Fonts
        updateLayout(lang);

        // Save Preference
        localStorage.setItem('fh_lang', lang);

    } catch (error) {
        console.error('CRITICAL ERROR loading language:', error);
        alert("Translation Error: Check Console (F12)");
    }
}

function applyTranslations(data) {
    // Select all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        // Resolve dot notation (e.g., "hero.title_1")
        const value = key.split('.').reduce((obj, i) => obj ? obj[i] : null, data);
        
        if (value) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.innerHTML = value; 
            }
        }
    });
}

function updateLayout(lang) {
    const body = document.body;
    const langBtnText = document.querySelector('#lang-text');

    if (lang === 'ar') {
        body.setAttribute('dir', 'rtl');
        body.classList.remove('en');
        body.classList.add('ar');
        if(langBtnText) langBtnText.textContent = "English";
    } else {
        body.setAttribute('dir', 'ltr');
        body.classList.remove('ar');
        body.classList.add('en');
        if(langBtnText) langBtnText.textContent = "العربية";
    }
}

function toggleLanguage() {
    const currentLang = localStorage.getItem('fh_lang') || 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
}

// --- MOBILE MENU LOGIC ---
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Toggle Logic using Classes for better control or inline styles
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '75px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#fff';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                navLinks.style.zIndex = '999';
            }
        });
    }
}