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
});
