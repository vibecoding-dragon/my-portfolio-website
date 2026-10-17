document.addEventListener('DOMContentLoaded', () => {
  // 1. ЛОГИКА МОБИЛЬНОГО МЕНЮ (Бургер)
  const burgerToggle = document.getElementById('burger-toggle');
  const headerNav = document.getElementById('header-nav');

  if (burgerToggle && headerNav) {
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

    document.querySelectorAll('.header__link').forEach(link => {
      link.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        const isMenuOpen = headerNav.classList.contains('header__nav--active');

        if (isMobile && isMenuOpen) {
          e.preventDefault();
          const href = link.getAttribute('href');

          if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
            closeMenu();
            return;
          }

          closeMenu();
          setTimeout(() => {
            window.location.href = href;
          }, 400);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && headerNav.classList.contains('header__nav--active')) {
        closeMenu();
      }
    });
  }
});

// 2. ПЛАВНЫЙ ЗАПУСК АНИМАЦИЙ GSAP
document.addEventListener('localeChanged', () => {
  if (typeof gsap !== 'undefined') {
    gsap.from('.gsap-fade', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
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

      ScrollTrigger.refresh();
    }
  }
});

// 3. ЗАЩИТА ОТ "ПРЫЖКОВ" ПРИ ЗАГРУЗКЕ КАРТИНОК (Обновляет позиции триггеров)
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

// Дополнительно: блокируем drag изображений
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});