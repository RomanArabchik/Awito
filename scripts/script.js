'use strict';
// Массив
const dataBase = [];
// Переменные
const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning');
// Все элементы формы кроме кнопки
const elementsModalSubmit = [...modalSubmit.elements].
filter(elem => elem.tagName !== 'BUTTON');

// -----Функции
// Активация/деактивация кнопки в форме
const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
}

// Закрытие модальных окон
const closeModal = function(event) {
    const target = event.target;
    if (target.closest('.modal__close') ||
    target.classList.contains('modal') || 
    event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        checkForm();
    }
}

// Отправление данных в localStorage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));
// -----Функции

// Проверка формы
modalSubmit.addEventListener('input', checkForm);

// Открытие модального окна объявления
addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);
});

// Открытие модального окна карточки
catalog.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('.card')) {
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

// Отправка формы с закрытием
modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    dataBase.push(itemObj);
    closeModal({target: modalAdd})
    saveDB();
});

// Закрытие модалок
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);
//

