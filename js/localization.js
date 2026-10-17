let currentLang = localStorage.getItem('language') || 'en';
let cachedTranslations = null;

async function loadLanguage(lang) {
  try {
    const response = await fetch(`./locales/${lang}.json`); 
    if (!response.ok) throw new Error('Не удалось загрузить JSON-файл локализации');
    
    cachedTranslations = await response.json();
    currentLang = lang;

    // Сначала обновляем весь текст и картинки в DOM
    updateDOM();
    
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    
    // Переключаем визуальное состояние кнопок (белый фон)
    updateSwitcherUI(lang);

    // Только после этого будим скрипт анимаций GSAP
    document.dispatchEvent(new CustomEvent('localeChanged'));

  } catch (error) {
    console.error('Ошибка при переводе страницы:', error);
  }
}

function updateDOM() {
  if (!cachedTranslations) return;

  const w = window.innerWidth;

  /*
    Три режима переключения картинок:
    1) data-responsive="true"  — карточки на главной.
    2) data-responsive="case"  — обложки на страницах кейсов.
    3) Карточки внутри секции .case-other — всегда мобильная картинка.
  */
  const isMobileHomepage = w <= 1100 || w >= 1400;
  const isMobileCase = w <= 768;

  document.querySelectorAll('[data-lng]').forEach(element => {
    const key = element.getAttribute('data-lng');
    const value = key.split('.').reduce((obj, i) => obj?.[i], cachedTranslations);
    
    if (value != null && value !== '') {
      if (element.tagName.toLowerCase() === 'img') {
        const respMode = element.getAttribute('data-responsive');

        if (respMode && typeof value === 'object') {
          const inOtherSection = element.closest('.case-other') !== null;

          let useMobile;
          if (respMode === 'case') {
            useMobile = isMobileCase;
          } else if (inOtherSection) {
            useMobile = true;
          } else {
            useMobile = isMobileHomepage;
          }

          const newSrc = useMobile ? value.mobile : value.desktop;
          if (element.src !== newSrc) element.src = newSrc;
        } 
        else if (typeof value === 'string') {
          if (element.src !== value) element.src = value;
        }
      } else {
        element.innerHTML = value;
      }
    }
  });
}

function updateSwitcherUI(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang-set') === lang) {
      btn.classList.add('lang-btn--active');
    } else {
      btn.classList.remove('lang-btn--active');
    }
  });
}

function initSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      const selectedLang = newBtn.getAttribute('data-lang-set');
      if (selectedLang && selectedLang !== currentLang) {
        loadLanguage(selectedLang);
      }
    });
  });
}

// Debounce для resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateDOM, 150);
});

document.addEventListener('DOMContentLoaded', () => {
  loadLanguage(currentLang).then(() => {
    initSwitcher();
  });
});