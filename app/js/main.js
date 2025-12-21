document.addEventListener('DOMContentLoaded', () => {

  /* ================= MENU ================= */

  const MENUBTN = document.querySelector('.menu__btn');
  const MENU = document.querySelector('.menu__list');

  const openMenu = () => {
    if (!MENU || !MENUBTN) return;
    MENU.classList.toggle('menu__list--active');
    MENU.classList.toggle('blur-plate');
    MENUBTN.classList.toggle('menu__btn--active');
  };

  const closeMenu = () => {
    if (!MENU || !MENUBTN) return;
    document.body.classList.remove('lock');
    MENU.classList.remove('menu__list--active');
    MENU.classList.remove('blur-plate');
    MENUBTN.classList.remove('menu__btn--active');
  };

  if (MENUBTN && MENU) {
    MENUBTN.addEventListener('click', () => {
      openMenu();
      document.body.classList.toggle('lock');
    });
  }

  /* ================= SCROLL NAV ================= */

  const navLinks = document.querySelectorAll('a[href^="#"], [data-scroll]');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      if (link.classList.contains('go-top')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetId =
        link.dataset.scroll ||
        link.getAttribute('href')?.substring(1);

      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      const header = document.getElementById('header');
      const headerHeight = header ? header.offsetHeight : 0;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (headerHeight + 80);

      window.scrollTo({ top, behavior: 'smooth' });
      closeMenu();
    });
  });

  /* ================= HEADER + GO TOP ================= */

  const header = document.getElementById('header');
  const goTop = document.querySelector('.go-top');
  const SCROLL_FIXED_THRESHOLD = 50;

  if (header || goTop) {
    const headerScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;

      if (header) {
        if (scrollPosition >= SCROLL_FIXED_THRESHOLD) {
          header.classList.add('is-fixed');
        } else {
          header.classList.remove('is-fixed');
        }
      }

      if (goTop && header) {
        if (scrollPosition > header.offsetHeight) {
          goTop.classList.add('go-top--active');
        } else {
          goTop.classList.remove('go-top--active');
        }
      }
    };

    window.addEventListener('scroll', headerScroll);
  }

  /* ================= FAQ ACCORDION ================= */

  const accordionButtons = document.querySelectorAll('[data-button]');

  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq__item');
      if (!item) return;

      const answer = item.querySelector('.faq__answer');
      const icon = item.querySelector('.faq__icon');
      const subtitle = item.querySelector('.faq__subtitle');

      if (!answer || !icon || !subtitle) return;

      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq__item.is-open').forEach(openItem => {
        if (openItem === item) return;
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq__answer')?.style.removeProperty('max-height');
        openItem.querySelector('.faq__icon')?.classList.remove('faq__icon--open');
        openItem.querySelector('.faq__subtitle')?.style.removeProperty('margin-bottom');
      });

      if (isOpen) {
        item.classList.remove('is-open');
        answer.style.removeProperty('max-height');
        icon.classList.remove('faq__icon--open');
        subtitle.style.removeProperty('margin-bottom');
        return;
      }

      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      icon.classList.add('faq__icon--open');
      subtitle.style.marginBottom = '12px';
    });
  });

  /* ================= METRICS ================= */

  const animateNumbers = elements => {
    const duration = 2000;

    elements.forEach(item => {
      const value = item.dataset.countNum;
      if (!value) return;

      const target = parseFloat(value);
      if (isNaN(target)) return;

      const decimals = value.includes('.') ? value.split('.')[1].length : 0;
      let start = null;

      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = target * progress;

        item.textContent =
          decimals > 0 ? current.toFixed(decimals) : Math.floor(current);

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

/*   const drawAnimatedRing = canvas => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const percent = Number(canvas.dataset.progress || 0) / 100;
    const color = canvas.dataset.color || '#3DDC84';

    const size = canvas.clientWidth;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const center = size / 2;
    const lineWidth = 12;
    const radius = center - lineWidth / 2;

    let current = 0;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.arc(
        center,
        center,
        radius,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * current
      );
      ctx.stroke();

      if (current < percent) {
        current += 0.015;
        requestAnimationFrame(animate);
      }
    };

    animate();
  };
 */

  const drawAnimatedRing = canvas => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const percent = Number(canvas.dataset.progress || 0) / 100;
  const color = canvas.dataset.color || '#3DDC84';

  const size = canvas.clientWidth;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const center = size / 2;

  // ВАЖНО: проверка класса родителя
  const isDownload = canvas.closest('.metrics__cards-item--download');
  const lineWidth = isDownload ? 16 : 10;

  const radius = center - lineWidth / 2;

  let current = 0;

  const animate = () => {
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.arc(
      center,
      center,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * current
    );
    ctx.stroke();

    if (current < percent) {
      current += 0.015;
      requestAnimationFrame(animate);
    }
  };

  animate();
};

  const metricsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target
        .querySelectorAll('.metric-canvas')
        .forEach(drawAnimatedRing);

      animateNumbers(entry.target.querySelectorAll('[data-activeNum]'));
      metricsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  document
    .querySelectorAll('.metric-card, .metrics')
    .forEach(el => metricsObserver.observe(el));

  /* ================= REVIEWS SLIDER  ================= */

  if (typeof Swiper !== 'undefined') {
    const reviewsSlider = document.querySelector('.reviews-slider');

    if (reviewsSlider) {
      new Swiper(reviewsSlider, {
        slidesPerView: 3,
        spaceBetween: 24,
        navigation: {
          nextEl: '.reviews__nav--next',
          prevEl: '.reviews__nav--prev',
        },
        pagination: {
          el: '.swiper-pagination',
        },
        breakpoints: {
          320: { slidesPerView: 1.2, spaceBetween: 16 },
          767: { slidesPerView: 2, spaceBetween: 24 },
          1180: { slidesPerView: 3, spaceBetween: 24 },
        },
      });
    }
  }

  /* ================= LANGUAGE SWITCHER ================= */

  const dropdown = document.querySelector('.switcher-lang__dropdown');
  const langBtn = document.querySelector('.switcher-lang__btn');

  if (dropdown && langBtn) {
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('switcher-lang__dropdown--active');
      langBtn.classList.toggle('switcher-lang__btn--active');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('switcher-lang__dropdown--active');
      langBtn.classList.remove('switcher-lang__btn--active');
    });
  }

  document.querySelectorAll('.switcher-lang__link').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      const lang = href.includes('/ru/')
        ? 'ru'
        : href.includes('/ar/')
        ? 'ar'
        : 'en';
      localStorage.setItem('siteLang', lang);
    });
  });

  /* ================= COOKIE ================= */

  const cookie = document.getElementById('cookie');
  if (cookie) {
    const acceptBtn = cookie.querySelector('.cookie__accept');
    const closeBtn = cookie.querySelector('.cookie__close');
    const COOKIE_KEY = 'cookieConsent';

    if (localStorage.getItem(COOKIE_KEY) === null) {
      setTimeout(() => cookie.classList.add('is-visible'), 4000);
    }

    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'true');
      cookie.classList.remove('is-visible');
    });

    closeBtn?.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'false');
      cookie.classList.remove('is-visible');
    });
  }

/* ================= GEO + LOCALIZATION (FINAL) ================= */

const LANG_KEY = 'siteLang';

(function initGeo() {
  // Перевірка fetch
  if (typeof fetch !== 'function') {
    console.warn('Fetch is not supported');
    return;
  }

  fetch('https://ipwho.is/')
    .then(response => {
      if (!response.ok) {
        throw new Error('GeoIP request failed');
      }
      return response.json();
    })
    .then(data => {
      // Базова перевірка відповіді
      if (!data || data.success !== true || !data.country_code) {
        console.warn('GeoIP invalid data:', data);
        return;
      }

      const countryCode = data.country_code; // UA, PL, DE, SA...

      console.log('GeoIP country:', countryCode);

      /* ===== 1. ПІДСВІТКА КРАЇНИ НА МАПІ ===== */
      const flags = document.querySelectorAll(
        `.map-flag[data-country="${countryCode}"]`
      );

      if (flags.length) {
        flags.forEach(flag => flag.classList.add('is-active'));
      }

      /* ===== 2. ПЕРЕВІРКА ЗБЕРЕЖЕНОЇ МОВИ ===== */
      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang) {
        // Мова вже вибрана — гео тільки для мапи
        return;
      }

      /* ===== 3. ВИЗНАЧЕННЯ МОВИ ПО РЕГІОНУ ===== */
      let targetLang = 'en';

      // RU-регіон
      if (['RU', 'BY', 'KZ', 'UA'].includes(countryCode)) {
        targetLang = 'ru';
      }

      // AR-регіон
      if (['SA', 'AE', 'EG', 'QA', 'KW'].includes(countryCode)) {
        targetLang = 'ar';
      }

      localStorage.setItem(LANG_KEY, targetLang);

      /* ===== 4. РЕДІРЕКТ (ЛИШЕ ЯКЩО НЕ ТАМ) ===== */
      const path = window.location.pathname;

      if (targetLang === 'ru' && !path.startsWith('/ru/')) {
        window.location.replace('/ru/index.html');
        return;
      }

      if (targetLang === 'ar' && !path.startsWith('/ar/')) {
        window.location.replace('/ar/index.html');
        return;
      }

      // EN — залишаємося на поточній сторінці
    })
    .catch(error => {
      console.warn('GeoIP error:', error);
    });
})();

});
