import dayjs from 'dayjs'

function Film(id, title, favorites = false, watchedDate = null, rating = 0, personId = 1) {
    this.id = id;
    this.title = title;
    this.favorites = favorites;
    this.watchedDate = watchedDate;
    this.rating = rating;
    this.personId = personId;
    this.toString = () => {
        console.log(`Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorites}, Watch date: ${this.watchedDate ? this.watchedDate.format("MMMM DD[, ]YYYY") : 'null'}, Score: ${this.rating || 0}, User: ${this.personId}`);
    }
}

function FilmLibrary() {
    this.films = []

    this.addNewFilm = (film) => {
        this.films.push(film);
    }
    
    this.getFilms = () => {
        return [...this.films];
    }
    
    this.init = () =>{
        this.addNewFilm( new Film(1, "Pulp Fiction", true, dayjs("2024-03-10"), 5) );
        this.addNewFilm( new Film(2, "21 Grams", true, dayjs("2024-03-17"), 4) );
        this.addNewFilm( new Film(3, "Star Wars") );
        this.addNewFilm( new Film(4, "Matrix") );
        this.addNewFilm( new Film(5, "Shrek", false, dayjs("2024-04-21"), 3) );
    }
}

export { FilmLibrary, Film };
