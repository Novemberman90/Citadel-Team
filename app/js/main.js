document.addEventListener('DOMContentLoaded', () => {
    // ===== MENU =====
    const MENUBTN = document.querySelector(".menu__btn");
    const MENU = document.querySelector('.menu__list');
    const goTop = document.querySelector('.go-top')
    MENUBTN.addEventListener("click", ()=>{
      if(MENUBTN) {
        openMenu();
        document.body.classList.toggle('lock');
      }
    });
  
    const openMenu=()=>{
      MENU.classList.toggle('menu__list--active');
      MENU.classList.toggle('blur-plate');
      MENUBTN.classList.toggle('menu__btn--active');

    }
    const closeMenu =()=>{
      document.body.classList.remove('lock');
      MENU.classList.remove('menu__list--active');
      MENU.classList.remove('blur-plate');
      MENUBTN.classList.remove('menu__btn--active');
    }

    /* Скрол меню */
    const navLink = document.querySelectorAll('a[href^="#"], [data-scroll]');
    navLink.forEach(link => {
      link.addEventListener('click', (e)=>{
        e.preventDefault();
         const targetId = link.dataset.scroll || link.getAttribute('href').substring(1);
         
         if(!link.classList.contains('go-top')) {
          scrollNavigation(targetId)
          closeMenu();
         } else {
          window.scrollTo({
            top: 0,
            behavior:'smooth',
            })
         }
      })
    });

  const scrollNavigation = (targetId)=> {
    const targetElement = document.getElementById(targetId);
  
    if(!targetElement) return;

    const headerHeght = document.querySelector('#header').offsetHeight;
    const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeght;

      window.scrollTo({
        top: top,
        behavior:'smooth',
      })
  }

  /* При скроле меняется хедер и активация кнопки НА ВЕРХ */
let isScrolled = false;
const headerScroll = () => {
  const header = document.querySelector('.header');
  const headerHeght = header.offsetHeight;
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;

  if(scrollPosition > headerHeght) {
    goTop.classList.add('go-top--active'); 
  } else {
    goTop.classList.remove('go-top--active'); 
  } 
  
}
window.addEventListener('scroll', headerScroll);

  /* EO IP MAP HIGHLIGHT */

  // підсвітка флага на карте
 /*  fetch('https://ipwho.is/')
    .then(res => res.json())
    .then(data => {
      const countryCode = data.country_code; // Наприклад UA, PL, DE, US...
      const code = data.country_code;

      // Вибираємо всі кола країни (бо їх 6 штук на одну)
      const flags = document.querySelectorAll(
        `.map-flag[data-country="${countryCode}"]`
      );

      // Додаємо клас is-active кожному колу
      flags.forEach(flag => {
        flag.classList.add('is-active');
      });


        if (['RU', 'BY', 'KZ', 'UA'].includes(code)) {
          localStorage.setItem(LANG_KEY, 'ru');
          //location.replace('/ru/index.html');
          return;
        }

        if (['SA', 'AE', 'EG', 'QA', 'KW'].includes(code)) {
          localStorage.setItem(LANG_KEY, 'ar');
          //location.replace('/ar/index.html');
          return;
        }

        // Европа и все остальные — EN
        localStorage.setItem(LANG_KEY, 'en');

      console.log('GeoIP data:', data);
      console.log('Country:', data.country);
      console.log('Country code:', data.country_code);
    })
    .catch(err => {
      console.error('GeoIP error', err);
    }); */

  /*  FAQ ACCORDION  */

  const accordionButtons = document.querySelectorAll('[data-button]');

accordionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq__item');
    if (!item) return;

    const inner = item.querySelector('.faq__inner');
    const answer = item.querySelector('.faq__answer');
    const icon = item.querySelector('.faq__icon');

    if (!inner || !answer || !icon) return;

    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.faq__item.is-open').forEach(openItem => {
      openItem.classList.remove('is-open');

      const a = openItem.querySelector('.faq__answer');
      const i = openItem.querySelector('.faq__icon');

      if (a) a.style.maxHeight = null;
      if (i) i.classList.remove('faq__icon--open');
    });

    if (isOpen) return;

    item.classList.add('is-open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    icon.classList.add('faq__icon--open');
  });
});


  /* METRICS — NUMBERS */

  function animateNumbers(elements) {
    const duration = 2000;

    elements.forEach(item => {
      const value = item.dataset.countNum;
      const target = parseFloat(value);
      if (isNaN(target)) return;

      const hasDecimal = value.includes('.');
      const decimals = hasDecimal ? value.split('.')[1].length : 0;

      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;

        const progress = Math.min((timestamp - start) / duration, 1);
        const current = target * progress;

        item.textContent = hasDecimal
          ? current.toFixed(decimals)
          : Math.floor(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  /*  METRICS — CANVAS RING  */

  function drawAnimatedRing(canvas) {
    const ctx = canvas.getContext('2d');

    const percent = Number(canvas.dataset.progress) / 100;
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
    const speed = 0.015;

    function animate() {
      ctx.clearRect(0, 0, size, size);

      const start = -Math.PI / 2;
      const end = start + Math.PI * 2 * current;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = percent === 1 ? 'butt' : 'round';
      ctx.arc(center, center, radius, start, end);
      ctx.stroke();

      if (current < percent) {
        current += speed;
        requestAnimationFrame(animate);
      }
    }

    animate();
  }

  /* METRICS — OBSERVER */

  const metricsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const block = entry.target;

      const canvases = block.querySelectorAll('.metric-canvas');
      canvases.forEach(canvas => {
        drawAnimatedRing(canvas);
      });

      const numbers = block.querySelectorAll('[data-activeNum]');
      if (numbers.length) {
        animateNumbers(numbers);
      }

      obs.unobserve(block);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.metric-card, .metrics').forEach(el => {
    metricsObserver.observe(el);
  });

  /* LANGUAGE SWITCHER  */

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

  /*  REVIEWS SLIDER (SWIPER)  */

  if (typeof Swiper !== 'undefined') {
    new Swiper('.reviews-slider', {
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


/* cookie  */
const cookie = document.getElementById('cookie');
const acceptCookieBtn = cookie.querySelector('.cookie__accept');
const closeCookieBtn = cookie.querySelector('.cookie__close');

const COOKIE_KEY = 'cookieConsent';
// еси пользователь уже делал выбор, тогда ничего не делаю
if(localStorage.getItem(COOKIE_KEY) === null ) {
  setTimeout(() => {
    cookie.classList.add('is-visible');
  }, 4000);
}

// если пользватель согласился
const acceptCookie = ()=> {
  localStorage.setItem(COOKIE_KEY, 'true');
  cookie.classList.remove('is-visible');
};

// если пользваотель отказался
const noCookie = ()=> {
  localStorage.setItem(COOKIE_KEY, 'false');
  cookie.classList.remove('is-visible');
}
acceptCookieBtn.addEventListener('click', acceptCookie);
closeCookieBtn.addEventListener('click', noCookie);



document.querySelectorAll('.switcher-lang__link').forEach(link => {
  link.addEventListener('click', () => {
    const lang = link.getAttribute('href').includes('/ru/')
      ? 'ru'
      : link.getAttribute('href').includes('/ar/')
      ? 'ar'
      : 'en';

    localStorage.setItem('site_lang', lang);
  });
});


/* Localization */

const LANG_KEY = 'siteLang';

fetch('https://ipwho.is/')
  .then(res => res.json())
  .then(data => {
    const countryCode = data.country_code; // UA, PL, DE, US...
    const savedLang = localStorage.getItem(LANG_KEY);
    const path = location.pathname;

    /*  1. Подсветка флагов на карте  */
    const flags = document.querySelectorAll(
      `.map-flag[data-country="${countryCode}"]`
    );

    flags.forEach(flag => {
      flag.classList.add('is-active');
    });

      console.log('GeoIP data:', data);
    console.log('Country:', data.country);
    console.log('Country code:', data.country_code);

    /* 2. Если язык уже выбран — НЕ редиректим */
    if (savedLang) return;

    /* 3. Определяем язык по стране  */
    let targetLang = 'en';

    if (['RU', 'BY', 'KZ', 'UA'].includes(countryCode)) {
      targetLang = 'ru';
    }

    if (['SA', 'AE', 'EG', 'QA', 'KW'].includes(countryCode)) {
      targetLang = 'ar';
    }

    localStorage.setItem(LANG_KEY, targetLang);

    /* 4. Редирект ТОЛЬКО если мы не там  */
    if (targetLang === 'ru' && !path.startsWith('/ru/')) {
      location.replace('/ru/index.html');
    }

    if (targetLang === 'ar' && !path.startsWith('/ar/')) {
      location.replace('/ar/index.html');
    }

    // EN — остаёмся на текущей странице
  })
  .catch(err => {
    console.error('GeoIP error:', err);
  });




});
