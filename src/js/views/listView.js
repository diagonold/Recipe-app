import {elements} from './base';

// this is very important for creating your view page
export const renderItem = item =>{
    const markup = 
    // data-itemid , we specify a data attribute
    // this is useful for specifying the css name?
    `
    <li class="shopping__item" data-itemid=${item.id} >
        <div class="shopping__count">
            <input type="number" value="${item.count}"  class="shopping__count--value" step="${item.count}">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;

    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
    const item  = document.querySelector('[data-itemid="${id}"]');
    if(item){item.parentElement.removeChild(item)};
};