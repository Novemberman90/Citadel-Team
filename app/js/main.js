document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     GEO IP MAP HIGHLIGHT
  ========================= */

  fetch('https://ipwho.is/')
    .then(res => res.json())
    .then(data => {
      // ipwho.is повертає success = false у разі помилки
      if (!data.success) return;

      const countryCode = data.country_code;
      if (!countryCode) return;

      const flag = document.querySelector(
        `.map-flag[data-country="${countryCode}"]`
      );

      if (flag) {
        flag.classList.add('is-active');
      }

      // Debug (можеш прибрати після перевірки)
      console.log('GeoIP data:', data);
      console.log('Country:', data.country);
      console.log('Country code:', countryCode);
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

      // Закрыть все
      accordionButtons.forEach(btn => {
        btn.classList.remove('active');

        const block = btn.nextElementSibling;
        if (!block) return;

        const text = block.querySelector('.faq__answer');
        const subtitle = block.querySelector('.faq__subtitle');
        const icon = btn.parentElement.querySelector('.faq__icon');

        if (text) text.style.maxHeight = 0;
        if (subtitle) subtitle.style.marginBottom = 0;
        if (icon) icon.style.transform = 'rotate(90deg)';
      });

      // Если клик по уже открытому — просто закрываем
      if (isActive) return;

      // Открыть текущий
      button.classList.add('active');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      title.style.marginBottom = '12px';
      arrow.style.transform = 'rotate(0deg)';
    });
  });

  /* =========================
     NUMBER COUNTER
  ========================= */

  const animateNumbers = (elements) => {
    const duration = 2000;

    elements.forEach(item => {
      const targetValue = item.dataset.countNum;
      const target = parseFloat(targetValue);

      if (isNaN(target)) return;

      const hasDecimal = targetValue.includes('.');
      const decimals = hasDecimal ? targetValue.split('.')[1].length : 0;

      let startTime = null;

      const update = (timeStamp) => {
        if (!startTime) startTime = timeStamp;

        const progress = Math.min((timeStamp - startTime) / duration, 1);
        const current = target * progress;

        item.textContent = hasDecimal
          ? current.toFixed(decimals)
          : Math.floor(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    });
  };

  /* =========================
     METRICS OBSERVER
  ========================= */

  const metricsBlock = document.querySelector('.metrics');

  if (metricsBlock) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = document.querySelectorAll('[data-activeNum]');
          animateNumbers(numbers);
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(metricsBlock);
  }

  /* =========================
     LANGUAGE SWITCHER
  ========================= */

  const dropdown = document.querySelector('.switcher-lang__dropdown');
  const langBtn = document.querySelector('.switcher-lang__btn');

  if (dropdown && langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('switcher-lang__dropdown--active');
      langBtn.classList.toggle('switcher-lang__btn--active');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('switcher-lang__dropdown--active');
      langBtn.classList.remove('switcher-lang__btn--active');
    });
  }



});
