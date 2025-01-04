import sqlite3 from "sqlite3";
import Film from "./Film.mjs";
import dayjs from "dayjs";

function mapRowsToFilms(rows) {
    return rows.map(row => new Film(row.id, row.title, row.isFavorite === 1, row.watchDate, row.rating, row.userId));
}

export default function FilmLibrary() {
    const db = new sqlite3.Database('films.db', (err) => {
        if (err) throw err;
    });

    this.closeDB = () => {
        try {
            db.close();
        } catch (error) {
            console.error(`Impossible to close the database! ${error}`);
        }
    };

    this.getAll = function() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM films`;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
            });
        });
        
    };

    this.getFavorites = function() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                        FROM films
                        WHERE isFavorite = 1`;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
            });
        });
    };

    this.getBestFilms = function () {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                        FROM films
                        WHERE rating = 5`;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
            });
        });
    };

    this.getWatchedLastMonth = function () {
        return new Promise((resolve, reject) => {
            const date = dayjs().subtract(1, 'month').format("YYYY-MM-DD");
            const sql = `SELECT *
                        FROM films
                        WHERE watchDate >= ?`;
            db.all(sql, [date], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
            });
        });
    };

    this.getUnwatched = function() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                        FROM films
                        WHERE watchDate IS NULL`;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
            });
        });
    };

    this.getFilm = function(filmId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                        FROM films
                        WHERE id = ?`;
            db.get(sql, [filmId], (err, row) => {
                if (err) reject(err);
                else resolve(new Film(row.id, row.title, row.isFavorite === 1, row.watchDate, row.rating, row.userId));
            });
        });
    };

    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO films (title, isFavorite, watchDate, rating, userId) VALUES (?, ?, ?, ?, ?)';
            const watchDate = film.watchDate ? film.watchDate.format("YYYY-MM-DD") : null;
            let rating = undefined;
            if (!film.rating || film.rating < 1 || film.rating > 5) 
                rating = null;
            else
                rating = film.rating;
            db.run(query, [film.title, film.favorite, watchDate, rating, film.userId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    film.id = this.lastID;
                    resolve(film);
                }
            });
        });
    };

    this.updateFilm = function(id, fields) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE films
                        SET title = ?,
                        isFavorite = ?,
                        rating = ?,
                        watchDate = ?,
                        userId = ?
                        WHERE id = ?`;
            db.run(sql, [fields.title, fields.favorite, fields.rating, fields.watchDate, fields.userId, id], (err) => {
                if (err) reject(err);
                else resolve(this.getFilm(id));
            });
        });
    };

    this.updateRating = function(id, newRating) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE films
                        SET rating = ?
                        WHERE id = ?`;
            db.run(sql, [newRating, id], (err) => {
                if(err) reject(err);
                else resolve(this.getFilm(id));
            });
        });
    };

    this.setFavorite = function(id, val) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE films
                        SET isFavorite = ?
                        WHERE id = ?`;
            db.run(sql, [val, id], (err) => {
                if (err) reject(err);
                else resolve(this.getFilm(id));
            });
        });
    };

    this.deleteFilm = function(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM films
                         WHERE id = ?`
            db.run(sql, [id], (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    };

    this.resetOriginalDb = function() {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM films
                         WHERE id > 5`;
            db.run(sql, [], (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    };
}