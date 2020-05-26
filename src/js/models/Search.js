import axios from 'axios';


export default class Search {
    constructor(query){
        this.query = query;
        this.result;
    }

    // method to get the search result  
    // remember in classes do not need to use the word function when defining a function
    async getResults(){

        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;
        }catch(error){
            alert(error);
        }
    }
}