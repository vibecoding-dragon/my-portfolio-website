document.addEventListener('DOMContentLoaded', () => {
  // 1. ЛОГИКА МОБИЛЬНОГО МЕНЮ (Бургер)
  const burgerToggle = document.getElementById('burger-toggle');
  const headerNav = document.getElementById('header-nav');

  if (burgerToggle && headerNav) {
    // Открытие / Закрытие шторки меню
    burgerToggle.addEventListener('click', (e) => {
      e.stopPropagation(); 
      burgerToggle.classList.toggle('header__burger--active');
      headerNav.classList.toggle('header__nav--active');
      document.body.style.overflow = headerNav.classList.contains('header__nav--active') ? 'hidden' : '';
    });

    const closeMenu = () => {
      burgerToggle.classList.remove('header__burger--active');
      headerNav.classList.remove('header__nav--active');
      document.body.style.overflow = '';
    };

    // Закрываем шторку при клике на ссылки страниц (с анимацией)
    document.querySelectorAll('.header__link').forEach(link => {
      link.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        const isMenuOpen = headerNav.classList.contains('header__nav--active');

        // Если мы на мобилке и меню открыто — сначала анимируем закрытие, потом переходим
        if (isMobile && isMenuOpen) {
          e.preventDefault();

          const href = link.getAttribute('href');

          // Если это внешняя ссылка или якорь — не трогаем логику
          if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
            closeMenu();
            return;
          }

          closeMenu();

          // Ждём завершения анимации (400ms = duration в CSS) и только затем переходим
          setTimeout(() => {
            window.location.href = href;
          }, 400);
        }
      });
    });

    // Защита: если пользователь увеличил экран с открытым меню — сбрасываем блокировку скролла body
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && headerNav.classList.contains('header__nav--active')) {
        closeMenu();
      }
    });
  }
});

// 2. ПЛАВНЫЙ ЗАПУСК АНИМАЦИЙ GSAP (Привязан к смене языка)
document.addEventListener('localeChanged', () => {
  if (typeof gsap !== 'undefined') {
    
    // Плавное появление Hero-блока и заголовка проектов
    gsap.from('.gsap-fade', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    // Плавная скролл-анимация для карточек проектов
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Вычищаем старые триггеры, чтобы избежать дублирования анимаций при переключении RU/EN
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      document.querySelectorAll('.gsap-project').forEach(card => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%', 
            toggleActions: 'play none none none'
          }
        });
      });

      // Пересчитываем позиции всех триггеров после смены языка:
      // тексты могли стать длиннее/короче, и блоки сместились по вертикали.
      ScrollTrigger.refresh();
    }
  }
});

// Дополнительно: блокируем drag изображений
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});