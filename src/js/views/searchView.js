import { elements } from './base';

// return the input value of the field
export const getInput = () => elements.searchInput.value;
    
export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () =>{
    // since this is a list, it will remove all the elements
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

// This is just to show 1 line of the title
// not always necessary
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle =[];
    if (title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            } 
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;
}



const renderRecipe = recipe =>{
    // we made a mistake with the pound symbol here, missing it will cause the hash change event to not occur
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    // use this to insert back into the html document
    elements.searchResList.insertAdjacentHTML('beforeend', markup );
}

// type = 'prev' or 'next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'?page - 1: page + 1}>
        <span>Page ${type === 'prev'?page - 1: page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev'?'left' : 'right'}"></use>
        </svg>
    </button>
`;

// helps render the button when there are multiple pages for recipes
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if( page === 1 && pages > 1){
        // button to next page, edge cases
        button = createButton(page, 'next');
    } else if ( page < pages){
        // both buttons
        // how come this works....
        // this work because this is just an html text
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
            `;
    } else if ( page === pages && pages > 1){
        // only button to go prev pages, edge cases
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


export const renderResults = (recipes, page = 1, resPerPage =10 ) => {
    // render results of current page
    // we do not call the function, this is a callback function
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // take a part of the recipe instead
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
    
}

export const highlightSelected = id => {

    const resultArr = Array.from(document.querySelectorAll('.results__link'));

    resultArr.forEach(el => {
        el.classList.remove('results__link--active')
    });
    // use the CSS selector
    // the attributes that we are looking for is the href
    // it will select that element
    // 
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}