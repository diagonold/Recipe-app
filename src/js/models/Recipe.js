import axios from 'axios';
export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){

        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            console.log(error);
            alert('Something went wrong');
        }
    }


    // Not all the functionality have to be fully reatlistic
    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/ 3);
        this.time =  periods * 15;
        // console.log(this.time);
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'cup', 'pound']; 
        const units = [...unitsShort, 'kg', 'g']
 
        const newIngredients = this.ingredients.map(el => {
            // remove units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) =>{
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // remove parentheses
            // use of regular expression
            // ussually can just google, not the most important
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
          

            // parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            // what is findIndex for?
            // it will only return true if the test is true
            // it will then return the index of that element
            const unitIndex = arrIng.findIndex( el2 => units.includes(el2))
            let objIng;


            if(unitIndex > -1){
                // there is a unit
                // eg 4 1/2 cups, arrCount [4, 1/2]
                // eg 4 cups, arrCount [4]
                const arrCount = arrIng.slice(0,unitIndex);

                let count;
                if(arrCount.legnth === 1){
                    count = parseFloat(eval(arrIng[0].replace('-', '+')));
                }else{
                    // eval function
                    // turns a string into a calculation
                    count = parseFloat(eval(arrIng.slice(0,unitIndex).join('+')));
                }

                objIng = {           
                    count,              
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            }else if( parseInt(arrIng[0],10)){
                // there is no unit, but the first element is a number
                // there is no unit, but the element is a number and needs to be converted to an interger
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            }else if( unitIndex === -1){
                // there is no unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;

        })


        this.ingredients = newIngredients
    }

    // type : + or - button
    updateServings(type){
        // servings
        const newServings = type === "dec"? this.servings -1: this.servings + 1;

        // ingredients
        // update each ingredient 
        this.ingredients.forEach( ingredient =>{
            ingredient.count *= (newServings/ this.servings);
        });

        this.servings = newServings;
    }
    
}