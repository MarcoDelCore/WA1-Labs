import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListGroup, ListGroupItem, Row, Col, Button } from 'react-bootstrap';
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";

function SearchFilm(props) {

    const params = useParams();
    const navigate = useNavigate();

    const query = params.query;
    const films = props.films.filter(film => film.title.toLowerCase().startsWith(query.toLowerCase()));

    const handleEdit = (film) => { 
        navigate(`/films/${film.id}/edit`);
    };

    return (
        <>
            <h1>Search results for: {query}</h1>
            <ListGroup className="list-group-flush">
            {films.map(film => (
                <FilmRow 
                    key={film.id} 
                    film={film} 
                    deleteFilm={props.deleteFilm} 
                    handleEdit={handleEdit}
                    setScore={props.setScore}
                    setFavorite={props.setFavorite}
                />
            ))}
            </ListGroup>
            <Row className="d-flex">
                <Col md={12} className="d-flex">
                <Button 
                    variant="primary" 
                    onClick={() => navigate("/films/all")}>
                    Back</Button>
                </Col>
            </Row>
        </>
    )
}

function FilmRow(props) {
    return (
        <ListGroupItem key={props.film.id}>
            <Row>
                <Col className="favorite-title d-flex gap-2 align-items-center">
                    {props.film.title}
                </Col>
                <Col className="text-end text-xl-center">
                    <FormCheckInput type="checkbox"checked={props.film.favorites} onChange={() => props.setFavorite(props.film)}/> Favorite
                </Col>
                <Col className="text-xl-center">
                    {props.film.watchedDate ? props.film.watchedDate.format("MMMM DD[, ]YYYY") : ''}
                </Col>
                <Col className="text-end">
                    {Array.from({ length: 5 }, (_, index) => (
                        <i
                            key={index}
                            className={`bi bi-star${index < props.film.rating ? "-fill" : ""} text-warning mx-1`}
                            onClick={() => props.setScore(props.film, index + 1)}
                        ></i>
                    ))}
                </Col>
                <Col className="text-end">
                    <Button variant="warning" className="mx-1" onClick={() => props.handleEdit(props.film)}><i className="bi bi-pencil"></i></Button>
                    <Button variant="danger" className="mx-1" onClick={() => props.deleteFilm(props.film)} ><i className="bi bi-trash"></i></Button>
                </Col>
            </Row>
        </ListGroupItem>
    );
}
export default SearchFilm;