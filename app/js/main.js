addEventListener('DOMContentLoaded', function () {
    const accardionButtons = document.querySelectorAll('[data-button]');
    
    accardionButtons.forEach(function (button) {
        button.addEventListener('click', function () {

            const answer = button.nextElementSibling.querySelector('.faq__answer');
            let heightAnswer = answer.scrollHeight;
            const title = button.nextElementSibling.querySelector('.faq__subtitle');
            const arrow = button.parentElement.querySelector('.faq__icon');

            if (button.classList.contains('active')) {
                button.classList.remove('active');
                answer.style.maxHeight = 0;
                title.style.marginBottom = 0;
                arrow.style.transform = "rotate(90deg)";
                return;
            } else {
                accardionButtons.forEach(function (button) {
                    button.classList.remove('active');

                    const accardiontexts = button.nextElementSibling.querySelectorAll('.faq__answer');
                    accardiontexts.forEach(function (text) {
                        text.style.maxHeight = 0;
                    });

                    const accardionArrows = button.parentElement.querySelectorAll('.faq__icon');
                    accardionArrows.forEach(function (arrow) {
                        arrow.style.transform = "rotate(90deg)";
                    });
                });

                const titles = document.querySelectorAll('.faq__subtitle');
                titles.forEach(function (title) {
                    title.style.marginBottom = 0;
                });
            }

            button.classList.add('active');
            answer.style.maxHeight = heightAnswer + "px";
            title.style.marginBottom = "12px";
            arrow.style.transform = "rotate(0deg)";
        });
    });



  const startAddonNumber = (elements)=> {
    const time = 2000;  // Общее время анимации в миллисекундах
      
      elements.forEach(item => {
            const targetValue = item.dataset.countNum; // строка
            const num = parseFloat(targetValue);

            // есть ли дробная часть
            const hasDecimal = targetValue.includes('.');
            const decimals = hasDecimal ? targetValue.split('.')[1].length : 0;

            let startTime = null;

          const updateNumber = (timestamp) => {
            if (!startTime) startTime = timestamp;

            const progress = Math.min((timestamp - startTime) / time, 1);
            const currentValue = num * progress;

            item.textContent = hasDecimal
              ? currentValue.toFixed(decimals)
              : Math.floor(currentValue);

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            }
          };

          requestAnimationFrame(updateNumber);
      });
  }


  /* metrics */
/* CANVAS RING  */

  const drawAnimatedRing =(canvas) => {
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


/* ===========================
   INTERSECTION OBSERVER
=========================== */

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const card = entry.target;

      // 🎯 Canvas
      const canvas = card.querySelector('.metric-canvas');
      if (canvas) {
        drawAnimatedRing(canvas);
      }

      // 🔢 Number
      const numbers = card.querySelectorAll('[data-activeNum]');
      if (numbers.length) {
        startAddonNumber(numbers);
      }

      obs.unobserve(card); // 🔥 запускаем один раз
    });
  }, {
    threshold: 0.4
  });

  document.querySelectorAll('.metric-card, .metrics').forEach(card => {
    observer.observe(card);
  });


  /* RESIZE (re-draw, no re-animate) */

  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.metric-canvas').forEach(canvas => {
        drawAnimatedRing(canvas);
      });
    }, 200);
  });


});
