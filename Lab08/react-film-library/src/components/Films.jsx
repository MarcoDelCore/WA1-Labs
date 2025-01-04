import { Row, Col, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useState, useEffect } from "react";
import FilmForm from "./FilmForm.jsx";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs from 'dayjs';
import { useNavigate, useParams } from "react-router-dom";

dayjs.extend(isSameOrBefore);

function Films(props) {
    
    const [sortOrder, setSortOrder] = useState('none');
    const params = useParams();
    const navigate = useNavigate();


    let filter_name = "";
    let films = [...props.films];

    if (params.filter === "all") {
        filter_name = "All Films";
    } else if (params.filter === "favorites") {
        filter_name = "Favorite Films";
        films = films.filter(film => film.favorites);
    } else if (params.filter === "best") {
        filter_name = "Best Rated Films";
        films = films.filter(film => parseInt(film.rating) === 5);
    } else if (params.filter === "seen") {
        filter_name = "Films Seen Last Month";
        films = films.filter(film => film.watchedDate && film.watchedDate.isAfter(dayjs().subtract(1, 'month')));
    } else if (params.filter === "unseen") {
        filter_name = "Unseen Films";
        films = films.filter(film => !film.watchedDate);
    }

    const sortByScore = () => {
        setSortOrder((olderOrder) => olderOrder === 'desc_score' ? 'asc_score' : 'desc_score');
    };

    const sortByDate = () => {
        setSortOrder((olderOrder) => olderOrder === 'desc_date' ? 'asc_date' : 'desc_date');
    };

    const sortByName = () => {
        setSortOrder((olderOrder) => olderOrder === 'asc_name' ? 'desc_name' : 'asc_name');
    };

    if (sortOrder === 'asc_score') {
        films.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === 'desc_score') {
        films.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'asc_date') {
        films.sort((a, b) => {
            if (!a.watchedDate) return 1;
            if (!b.watchedDate) return -1;
            return a.watchedDate.isSameOrBefore(b.watchedDate) ? -1 : 1;
        });
    } else if (sortOrder === 'desc_date') {
        films.sort((a, b) => {
            if (!a.watchedDate) return 1;
            if (!b.watchedDate) return -1;
            return a.watchedDate.isSameOrBefore(b.watchedDate) ? 1 : -1;
        });
    } else if (sortOrder === 'asc_name') {
        films.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'desc_name') {
        films.sort((a, b) => b.title.localeCompare(a.title));
    }

    const handleEdit = (film) => { 
        navigate(`/films/${film.id}/edit`);
    };

    return (
        <Col md={9} className="pt-3">
            <h1>{filter_name}
                <Button variant="link" onClick={sortByName}>Sort by name</Button>
                <Button variant="link" onClick={sortByScore}>Sort by score</Button>
                <Button variant="link" onClick={sortByDate}>Sort by date</Button>
                <Button variant="link" onClick={() => setSortOrder('none')}>Reset</Button>
            </h1>
            
            <FilmTable films={films} deleteFilm={props.deleteFilm} handleEdit={handleEdit} setScore={props.setScore} setFavorite={props.setFavorite}/>
            <Col md={12} className="d-flex justify-content-end">
                <Button 
                    variant="primary" className="rounded-circle" 
                    style={{position: "fixed", bottom: "10px"}} 
                    onClick={() => navigate("/films/add")}>
                    <i className="bi bi-plus-lg"></i></Button>
            </Col>
        </Col>
    )
}

function FilmTable(props) {
    return (
        <ListGroup className="list-group-flush">
            {props.films.map(film => (
                <FilmRow 
                    key={film.id} 
                    film={film} 
                    deleteFilm={props.deleteFilm} 
                    handleEdit={props.handleEdit}
                    setScore={props.setScore}
                    setFavorite={props.setFavorite}
                />
            ))}
        </ListGroup>
    );
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

export default Films;
