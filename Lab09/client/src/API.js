import Film from "./models/Film.js";

const SERVER_URL = 'http://localhost:3000/api';

async function getFilms(filter, id) {
    const films = await fetch(SERVER_URL + '/films'+ `?id=${id}` + (filter ? `&filter=${filter}` : ''))
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiFilmsToFilms);

    return films;
}

async function addFilm(film) {
    const response = await fetch(SERVER_URL + '/films', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(film),
        credentials: 'include'
    })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(film => mapApiFilmsToFilms([film]))

    return response;
}

async function modifyFilm(film) {
    const response = await fetch(SERVER_URL + '/films/' + film.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(film),
        credentials: 'include'
    })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(film => mapApiFilmsToFilms([film]))

    return response;
}

async function deleteFilm(filmId) {
    try {
        const response = await fetch(`${SERVER_URL}/films/${filmId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("In deleteFilm: invalid response code " + response.status);
        }

    } catch (ex) {
        throw new Error("In deleteFilm: " + ex);
    }
}

async function changeRating(filmId, rating) {
    try {
        const response = await fetch(`${SERVER_URL}/films/${filmId}/rating`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: rating }),
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("In changeRating: invalid response code " + response.status);
        }

    } catch (ex) {
        throw new Error("In changeRating: " + ex);
    }

}

async function changeFavorite(filmId, favorite) {
    try {
        const response = await fetch(`${SERVER_URL}/films/${filmId}/favorite`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite: favorite }),
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("In changeFavorite: invalid response code " + response.status);
        }

    } catch (ex) {
        throw new Error("In changeFavorite: " + ex);
    }

}

// ***** Authentication *****

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;  // an object with the error coming from the server
    }
};

const logOut = async () => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const registerUser = async (name, email, password) => {
    const response = await fetch(SERVER_URL + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
        credentials: 'include'
    });
    if (response.ok) {
        return
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }

}

function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}

function mapApiFilmsToFilms(apiFilms) {
    return apiFilms.map(film => new Film(film.id, film.title, film.favorite, film.watchDate, film.rating, film.userId));
}

const API = { getFilms, addFilm, modifyFilm, deleteFilm, changeRating, changeFavorite, logIn, getUserInfo, logOut, registerUser };
export default API;