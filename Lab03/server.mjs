import express, { json } from 'express'
import morgan from 'morgan'
import FilmLibrary from './FilmLibrary.mjs';
import Film from './Film.mjs';
import dayjs from 'dayjs';

const fl = new FilmLibrary();

fl.resetOriginalDb();

const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(express.text());

app.get('/', (req, res) => {
    res.send("What are you looking for?");
});

app.get('/films', (req, res) => {
    fl.getAll().then((films) => {
        res.json(films);
    }).catch((err) => {
        res.statusCode(500).send("Database error: " + err);
    });
});

app.get('/films/favourite', (req, res) => {
    fl.getFavorites().then((films) => {
        res.json(films);
    }).catch((err) => {
        res.status(500).send("Database Error: " + err);
    });
});

app.get('/films/best', (req, res) => {
    fl.getBestFilms().then((films) => {
        res.json(films);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.get('/films/watchedLastMonth', (req, res) => {
    fl.getWatchedLastMonth().then((films) => {
        res.json(films);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.get('/films/unwatched', (req, res) => {
    fl.getUnwatched().then((films) => {
        res.json(films);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.get('/films/:id', (req, res) => {
    const filmId = req.params.id;
    console.log(filmId)
    fl.getFilm(filmId).then((film) => {
        res.json(film);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

// function that add a film to the database
app.post('/films/add', (req, res) => {
    const newFilm = new Film(undefined, req.body.title, req.body.favorite, dayjs(req.body.watchDate), req.body.rating, req.body.userId);
    fl.addFilm(newFilm).then((film) => {
        res.json(film);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.put('/films/update/:id', (req, res) => {
    const filmId = req.params.id;
    const fields = req.body;
    fl.updateFilm(filmId, fields).then((updated) => {
        res.json(updated);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.put('/films/updateRating/:id', (req, res) => {
    const newRating = req.body;
    const filmId = req.params.id;
    fl.updateRating(filmId, newRating).then((film) => {
        res.json(film);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.put('/films/:id/setAsFavorite', (req, res) => {
    const filmId = req.params.id;
    fl.setFavorite(filmId, true).then((film) => {
        res.json(film);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.put('/films/:id/setAsNotFavorite', (req, res) => {
    const filmId = req.params.id;
    fl.setFavorite(filmId, false).then((film) => {
        res.json(film);
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

app.delete('/films/:id', (req, res) => {
    const filmId = req.params.id;
    fl.deleteFilm(filmId).then((ok) => {
        res.send("Film deleted!");
    }).catch((err) => {
        res.status(500).send("Database error: " + err);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});