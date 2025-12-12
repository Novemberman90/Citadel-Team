
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector('.switcher-lang__dropdown');
  const btn = document.querySelector(".switcher-lang__btn");

  if (!dropdown || !btn) return;

  // Открыть/закрыть меню
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("switcher-lang__dropdown--active");
    btn.classList.toggle('switcher-lang__btn--active');
  });

  // Закрывать по клику вне
  document.addEventListener("click", () => {
    dropdown.classList.remove("switcher-lang__dropdown--active");
    btn.classList.remove('switcher-lang__btn--active');
  });

});
