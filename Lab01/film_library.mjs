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
    this.addNewFilm = (film) => { this.films.push(film); };
    this.printFilms = () => {
        for (const film of this.films) {
            film.toString();
        }
    };
    this.sortByDate = () => {
        const ans = [...this.films];
        ans.sort( (f1, f2) => { 
            if (f1.watchedDate == null) return 1;
            if (f2.watchedDate == null) return -1;
            return f1.watchedDate.valueOf() - f2.watchedDate.valueOf(); } )
        this.films = [...ans];
    };
    this.deleteFilm = (id) => { this.films = this.films.filter( f => f.id !== id ) };
    this.resetWathcedFilms = () => { this.films.forEach( f => f.watchedDate = null ) }; 
    this.getRated = () => {
        let ans = [];
        for (const element of this.films) {
            if (element.rating !== 0) {
                ans.push(element);
            }
        }
        ans = ans.sort( (f1, f2) => f2.rating - f1.rating );
        for (const element of ans) {
            element.toString();
        }
    }
}

const myLibrary = new FilmLibrary();
myLibrary.addNewFilm( new Film(1, "Pulp Fiction", true, dayjs("2024-03-10"), 5) );
myLibrary.addNewFilm( new Film(2, "21 Grams", true, dayjs("2024-03-17"), 4) );
myLibrary.addNewFilm( new Film(3, "Star Wars") );
myLibrary.addNewFilm( new Film(4, "Matrix") );
myLibrary.addNewFilm( new Film(5, "Shrek", false, dayjs("2024-03-21"), 3) );

myLibrary.printFilms();
myLibrary.sortByDate()
console.log("Films sorted by date");
myLibrary.printFilms();
myLibrary.deleteFilm(1);
console.log("Film list without film 1");
myLibrary.printFilms();
myLibrary.deleteFilm(3);
console.log("Film list without film 3");
myLibrary.printFilms();
myLibrary.resetWathcedFilms();
console.log("Reset WatchedDate");
myLibrary.printFilms();
console.log("Rated films");
myLibrary.getRated();
