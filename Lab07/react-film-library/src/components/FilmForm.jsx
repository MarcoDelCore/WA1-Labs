import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import dayjs from 'dayjs';

function FilmForm(props) {
    const [title, setTitle] = useState(props.film ? props.film.title : "");
    const [rating, setRating] = useState(props.film ? props.film.rating : 0);
    const [date, setDate] = useState(props.film ? (props.film.watchedDate ? props.film.watchedDate.format('YYYY-MM-DD') : null) : null);
    const [favorite, setFavorite] = useState(props.film ? props.film.favorites : false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.film) {
            const updated_film = {id: props.film.id, title, rating, date, favorite};
            props.updateFilm(updated_film);
            return;
        }
        else {
            const new_film = {title, rating, date, favorite};
            props.addFilm(new_film);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type='text' required={true} minLength={2} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Control type='number' required={true} min={0} max={5} value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Enter score"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="watchedDate">
                <Form.Label>Watched Date</Form.Label>
                <Form.Control type="date" value={date} max={dayjs().format('YYYY-MM-DD')} onChange={(e) => {setDate(e.target.value)}} placeholder="Enter watched date" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="favorites">
                <Form.Label>Favorite</Form.Label>
                <Form.Check type="checkbox" label="Favorite" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
            </Form.Group>
            <Button variant="success" type="submit">Add Film</Button>{' '}
            <Button variant='danger' onClick={props.cancel}>Cancel</Button>
        </Form>
    )
}

export default FilmForm;