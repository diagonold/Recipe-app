export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {
            id, 
            title,
            author,
            img
        }
        this.likes.push(like);

        // persist data in local storage
        this.persistData();
        return like;   
    }

    deleteLike(id){
        // with find index, we can specify a call back function that returns true
        const index = this.likes.findIndex( el => el.id === id);
        // mutate the original array
        // [2,4,8].splice(1,2) --> returns [4,8] orininal array is [2]
        // [2,4,8].slice(1,2) --> returs [4,8], orinigal array is [2,4,8]
        this.likes.splice(index, 1);

        // persist data in local storage
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el=> el.id === id ) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }


    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));

        // restoring the likes from the storage
        if(storage)this.likes = storage
    }
}