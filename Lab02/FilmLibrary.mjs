import sqlite3 from "sqlite3";
import Film from "./Film.mjs";
import dayjs from "dayjs";
import { resolve } from "path";

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

    this.getWatchedToday = function() {
        return new Promise((resolve, reject) => {
            const today = dayjs().format("YYYY-MM-DD");
            const sql = `SELECT *
                        FROM films
                        WHERE watchDate = ?`;
            db.all(sql, [today], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows))
            });
        });
    };

    this.getWatchedBefore = function(date) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                    FROM films
                    WHERE watchDate < ?`;
            const ref = date.format("YYYY-MM-DD");
            db.all(sql, [ref], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
            });
        });  
    }; 

    this.getRatedAbove = function(rating) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                        FROM films
                        WHERE rating >= ?`;
            db.all(sql, [rating], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
            });
        });
    };

    this.getContainingString = function(string) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                        FROM films
                        WHERE title LIKE ?`;
            db.all(sql, [`%${string}%`], (err, rows) => {
                if (err) reject(err);
                else resolve(mapRowsToFilms(rows));
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

    this.resetWatchDates = function() {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE films
                         SET watchDate = NULL `;
            db.run(sql, [], (err) => {
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