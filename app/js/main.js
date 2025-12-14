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

    const addonElement = document.querySelector('.metrics'); 
  if (addonElement) { 
    const observer = new IntersectionObserver((entries, observer) => { 
      entries.forEach(entry => { 

      if (entry.isIntersecting) { 
          const elements = document.querySelectorAll('[data-activeNum]'); 
          startAddonNumber(elements); 
          observer.disconnect(); // Отключаем после первого срабатывания 
         }
     });

     }, { threshold: 0.5 }); 
     observer.observe(addonElement); // Слежу за нужным или любым другим элементом в конце страницы 
    
  }

    

/*    document.querySelectorAll('.metric-card__circle').forEach(circle => {
  const progress = Number(circle.dataset.progress); // 0–100
  const path = circle.querySelector('.progress-ring__value');

  const length = path.getTotalLength();

  // инициализация
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  // принудительный reflow
  path.getBoundingClientRect();

  // анимация
  const offset = length * (1 - progress / 100);
  path.style.strokeDashoffset = offset;
  
}); */


/////////////////////////////-------------------
/* function animateRing(canvas) {
  const ctx = canvas.getContext('2d');

  const size = canvas.width;
  const center = size / 2;

  const percent = Number(canvas.dataset.progress) / 100;
  const color = canvas.dataset.color || '#fff';

  const radius = center - 16;
  const lineWidth = 16;

  const startAngle = -Math.PI / 2;
  const maxAngle = startAngle + Math.PI * 2 * percent;

  let currentAngle = startAngle;

  function draw(angle) {
    ctx.clearRect(0, 0, size, size);

    // фон
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,.2)';
    ctx.lineWidth = lineWidth;
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    // значение
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = percent === 1 ? 'butt' : 'round';
    ctx.arc(center, center, radius, startAngle, angle);
    ctx.stroke();
  }

  function animate() {
    currentAngle += 0.03;
    if (currentAngle > maxAngle) currentAngle = maxAngle;

    draw(currentAngle);

    if (currentAngle < maxAngle) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}


document.querySelectorAll('.metric-canvas').forEach(canvas => {
  animateRing(canvas);
});
 */


//////////----------------- Работает только на одну карточку

/* function getCanvasSize(card) {
  const w = window.innerWidth;

  if (card.classList.contains('metric-card--download')) {
    if (w <= 1080) return 226;
    return 332;
  }

  // upload + latency
  if (w <= 389) return 145;
  if (w <= 576) return 155;
  if (w <= 1080) return 188;
  return 268;
}

function animateRing(canvas) {
  const ctx = canvas.getContext('2d');
  const card = canvas.closest('.metric-card');

  const size = getCanvasSize(card);
  const dpr = window.devicePixelRatio || 1;

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  ctx.scale(dpr, dpr);

  const center = size / 2;
  const radius = center - 8;
  const lineWidth = 8;

  const percent = Number(canvas.dataset.progress) / 100;
  const color = canvas.dataset.color;

  const start = -Math.PI / 2;
  const end = start + Math.PI * 2 * percent;

  let current = start;

  function draw(angle) {
    ctx.clearRect(0, 0, size, size);

    // bg
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,.2)';
    ctx.lineWidth = lineWidth;
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    // value
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = percent === 1 ? 'butt' : 'round';
    ctx.arc(center, center, radius, start, angle);
    ctx.stroke();
  }

  function animate() {
    current += 0.04;
    if (current > end) current = end;

    draw(current);

    if (current < end) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

function animateNumber(span, duration = 1500) {
  const target = Number(span.dataset.countNum);
  const hasDecimal = target % 1 !== 0;

  let start = null;

  function tick(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);

    const value = target * progress;
    span.textContent = hasDecimal
      ? value.toFixed(1)
      : Math.round(value);

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const card = entry.target;
    const canvas = card.querySelector('.metric-canvas');

    animateRing(canvas);
    animateNumber(number);
  });
}, {
  threshold: 0.4
});

document.querySelectorAll('.metric-card').forEach(card => {
  observer.observe(card);
});


// слежу за секцией
document.querySelectorAll('.metric-card').forEach(card => {
  observer.observe(card);
});


let resizeTimeout;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    document.querySelectorAll('.metric-card').forEach(card => {
      const canvas = card.querySelector('.metric-canvas');
      if (!canvas) return;

      animateRing(canvas); // перерисовываем под новый размер
    });
  }, 200);
}); */

/* ===========================
   CANVAS RING (CSS driven)
=========================== */

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


/* ===========================
   NUMBER COUNTER
=========================== */

function animateNumber(span, duration = 1500) {
  const target = Number(span.dataset.countNum);
  const hasDecimal = target % 1 !== 0;

  let start = null;

  function tick(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);

    const value = target * progress;
    span.textContent = hasDecimal
      ? value.toFixed(1)
      : Math.round(value);

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}


/* ===========================
   INTERSECTION OBSERVER
=========================== */

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const card = entry.target;
    const canvas = card.querySelector('.metric-canvas');
    const number = card.querySelector('[data-activeNum]');

    if (canvas) drawAnimatedRing(canvas);
    if (number) animateNumber(number);

    obs.unobserve(card);
  });
}, {
  threshold: 0.4
});

document.querySelectorAll('.metric-card').forEach(card => {
  observer.observe(card);
});


/* ===========================
   RESIZE (re-draw, no re-animate)
=========================== */

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
