document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     GEO IP MAP HIGHLIGHT
  ========================= */

  fetch('https://ipwho.is/')
    .then(res => res.json())
    .then(data => {
      if (!data.success) return;

      const countryCode = data.country_code;
      if (!countryCode) return;

      const flag = document.querySelector(
        `.map-flag[data-country="${countryCode}"]`
      );

      if (flag) {
        flag.classList.add('is-active');
      }

      console.log('GeoIP:', data.country, countryCode);
    })
    .catch(err => {
      console.error('GeoIP error:', err);
    });

  /* =========================
     FAQ ACCORDION
  ========================= */

  const accordionButtons = document.querySelectorAll('[data-button]');

  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const inner = button.nextElementSibling;
      if (!inner) return;

      const answer = inner.querySelector('.faq__answer');
      const title = inner.querySelector('.faq__subtitle');
      const arrow = button.parentElement.querySelector('.faq__icon');

      if (!answer || !title || !arrow) return;

      const isActive = button.classList.contains('active');

      accordionButtons.forEach(btn => {
        btn.classList.remove('active');

        const block = btn.nextElementSibling;
        if (!block) return;

        const a = block.querySelector('.faq__answer');
        const t = block.querySelector('.faq__subtitle');
        const i = btn.parentElement.querySelector('.faq__icon');

        if (a) a.style.maxHeight = 0;
        if (t) t.style.marginBottom = 0;
        if (i) i.style.transform = 'rotate(90deg)';
      });

      if (isActive) return;

      button.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      title.style.marginBottom = '12px';
      arrow.style.transform = 'rotate(0deg)';
    });
  });

  /* =========================
     METRICS — NUMBERS
  ========================= */

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

  /* =========================
     METRICS — CANVAS RING
  ========================= */

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

  /* =========================
     METRICS — OBSERVER
  ========================= */

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

  /* =========================
     LANGUAGE SWITCHER
  ========================= */

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

  /* =========================
     REVIEWS SLIDER (SWIPER)
  ========================= */

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

});
