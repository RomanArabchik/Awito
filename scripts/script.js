'use strict';
// Массив
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
// Переменные
let counter = dataBase.length;
const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add');
    
const searchInput = document.querySelector('.search__input'),
    menuContainer = document.querySelector('.menu__container');
// Переменные из модалки
const modalImageItem = document.querySelector('.modal__image-item'),
    modalHeaderItem = document.querySelector('.modal__header-item'),
    modalStatusItem = document.querySelector('.modal__status-item'),
    modalDescriptionItem = document.querySelector('.modal__description-item'),
    modalCostItem = document.querySelector('.modal__cost-item');


//Временные переменные для обновления кнопки "Добавить фото"
const texFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;
// Все элементы формы кроме кнопки
const elementsModalSubmit = [...modalSubmit.elements].
filter(elem => elem.tagName !== 'BUTTON');

const infoPhoto = {};



// -----Функции
//Создает карточки на основе нашей базы данных
const renderCard = (DB = dataBase) => {
    catalog.textContent = '';

    DB.forEach((item) => {
        catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${item.id}">
            <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} ₽</div>
            </div>
         </li>
        `)
    });
};

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
        modalFileBtn.textContent = texFileBtn;
        modalImageAdd.src = srcModalImage;
        checkForm();
    }
}

// Отправка данных в localStorage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));
// -----Функции/

menuContainer.addEventListener('click', event => {
    const target = event.target;
    if (target.tagName === 'A') {
        const result = dataBase.filter(item => item.category === target.dataset.category);
        renderCard();
    }
})

// После загрузки картинки проверяем её размер и заменяем картинку
modalFileInput.addEventListener('change', event => {
    const target = event.target;
    const reader = new FileReader();
    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);
    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
        modalFileBtn.textContent = infoPhoto.filename;
        infoPhoto.base64 = btoa(event.target.result); // формат base64 можно выводить на страницу в виде картинки
        modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`; // заменяем картинку
        } else {
            modalFileBtn.textContent = 'файл не должен превышать 200кб';
            modalFileInput.value = '';
            checkForm();
        }
    })
});

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
    const card = target.closest('.card');
    if (card) {
        const item = dataBase.find(item =>item.id === +card.dataset.id);

        modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
        modalHeaderItem.textContent = item.nameItem;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
        modalDescriptionItem.textContent = item.descriptionItem;
        modalCostItem.textContent = item.costItem;
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
    itemObj.id = counter++;
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    closeModal({target: modalAdd})
    saveDB();
    renderCard();
});

// Закрытие модалок
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);
//

// Поиск
searchInput.addEventListener('input', () => {
    const valueSearch = searchInput.value.trim().toLowerCase();
    if (valueSearch.length > 2) {
        const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) ||
                                             item.descriptionItem.toLowerCase().includes(valueSearch));
        renderCard(result);
    }
});
// Карточки из localStorage появляются сразу при загрузке
renderCard();

