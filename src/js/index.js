import Search from './models/Search';
import { elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';
import * as recipeView  from './views/recipeView';
import List, * as list from './models/List';
import * as listView  from './views/listView';
import Likes from './models/Likes';
import * as likesView  from './views/likesView';




/**
 * the current state of the object can be define in 1 object
 * 
 * Global state of the app
 * - the search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
 * 
 * we can also make persitent states, for later
 */
const state = {};
// window.state = state;


// ********SEARCH CONTROLLER *****************

// handles the submit button
const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput();
    // TESTING 
    // const query = 'pizza';

    // remember falsy valure are seen as false
    if(query){
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. prepare UI for results
        // clear UI for search
        searchView.clearInput();
        // clear results from the previous search
        searchView.clearResults();
        renderLoader(elements.searchRes);
        

        try{
            //  4. search for recipe
            // to be able to use await, the function needs ot be an async function
            // rememeber that await returns a promise
            await state.search.getResults();

            // 5. render the results on the UI
            // clear the loader image first before displaying results
            clearLoader();
            // our seach object has the result property where we can read the recipes from
            searchView.renderResults(state.search.result);
        } catch(error){
            console.log("Error with search")
            clearLoader();


        }
        
    }
};

elements.searchForm.addEventListener('submit', event =>{
    event.preventDefault();     // prevents a reload of the page

    controlSearch();

});

// FOR TESTING
// window.addEventListener("load", event => {
//     event.preventDefault();
// });                         

elements.searchResPages.addEventListener('click', event =>{ 
    // traverses an element and its parents until it finds a node that matches that provided string
    const btn = event.target.closest('.btn-inline');
    

    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);

        console.log(goToPage);
    }
});




// *************** RECIPE CONTROLLER****************

const controlRecipe = async ()=>{
    // console.log('the hash has changed');

    // get ID from url
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if(id){
        // prepare UI for changes
        // remember that we need the parent
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight the selected search item
        console.log(id)
        if(state.search){searchView.highlightSelected(id)};

        // create new Recipe object
        state.recipe = new Recipe(id);

        // exposing this recipe to the global window

        // this is for TESTTING purposes
        // window.r = state.recipe;

        // get Recipe data and parse intredients
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // render recipe
            clearLoader();
            // state is so useful, it keep all our info for us
            console.log(state.recipe);
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
            
        }catch(error){
            console.log(error);
            alert('Error rendering recipe');
        }
        
    }
}



// if ever the url hash change, this will get fired up
// why we need load?
//      reloading the page on the same hash event will not cause the recipe to be fetched
['hashchange', 'load'].forEach(event => window.addEventListener(event , controlRecipe));



// ************************ List controller *************
// tu this is a good way of testing
// allows you to access the elements from console

const controlList = () =>{
    // create a new list if there is none yet
    if( !state.list) state.list = new List();

    // add each ingredient to the list
    state.recipe.ingredients.forEach( el => {
        // why to we want the item back?
        // so that we can pass it to the listView
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// Handle delete and update list item events
elements.shopping.addEventListener('click', event =>{
    // remember we added the itemid for the markup,
    // we can then access that with the dataset attribute
    const id = event.target.closest('.shopping__item').dataset.itemid;

    // handle the delete event
    // always the same logic for buttons or html pages that yet to exist
    if(event.target.matches('.shopping__delete, .shopping__delete *')){
        // delete from the state
        state.list.deleteItem(id);

        // delete the item from the UI
        listView.deleteItem(id);
    }else if(event.target.matches('.shopping__count--value')){
        // handle the count update
        const val = parseFloat(event.target.value, 10);
        state.list.updateCount(id,val);
    }
})



// ********************* Likes controller **************

// // TESTING, We need a like state in the beggining
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());


const controlLike = () =>{

    if(!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;

    // user has not yet like current recipe
    if(!state.likes.isLiked(currentID)){
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // toggle the like button
        likesView.toggleLikeButton(true);
        // add like to the UI list
        likesView.renderLike(newLike);

    // user has liked the current recipe
    }else{
        // remove like from the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeButton(false);

        // remove like from the UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page loads
window.addEventListener('load', ()=>{
    state.likes = new Likes();
    
    // restore likes
    state.likes.readStorage();

    // toggleLike menut
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})


// ************** HANDLING RECIPE BUTTON *****************
// event delagation for elements that does not yet exist
// This is the decrease an increase button
elements.recipe.addEventListener('click', event => {
    // pass a css selector
    if(event.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clicked
        if( state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)

        }
    }else if (event.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe)

    }else if ( event.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // add ingredient ot the shopping list
        controlList();
    }else if ( event.target.matches('.recipe__love, .recipe__love *')){
        // like controller
        controlLike();
    }


});




