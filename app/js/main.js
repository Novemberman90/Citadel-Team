
window.addEventListener('DOMContentLoaded', ()=>{


const tabBtn = document.querySelectorAll('.tab-nav__btn'),
      tabItem = document.querySelectorAll('.tab__item');
  
  tabBtn.forEach(button => {
    button.addEventListener('click', (e)=>{
      const tabId = button.getAttribute('data-btn');
      e.preventDefault();
      
       // Убираем активный класс у всех кнопок
      tabBtn.forEach(btn => {
        btn.classList.remove('tab-nav__btn--active');
      });

      // Добавляем активный класс нажатой кнопке
      button.classList.add('tab-nav__btn--active');

      // Скрываем все табы
      tabItem.forEach(item => {
        item.classList.remove('tab__item--active', 'fade');
      });

      document.getElementById(tabId).classList.add('tab__item--active', 'fade');
    })

  });
});