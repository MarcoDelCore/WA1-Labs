import { Row, Col, ListGroup, ListGroupItem, Button } from "react-bootstrap"
import FormCheckInput from "react-bootstrap/esm/FormCheckInput"
import { useState } from "react"
import FilmForm from "./FilmForm.jsx"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs from 'dayjs';

dayjs.extend(isSameOrBefore);

function Films(props) {

    const [mode, setMode] = useState("default");

    const [editableFilm, setEditableFilm] = useState();

    const [sortOrder, setSortOrder] = useState('none');

    const handleEdit = (film) => { 
        setEditableFilm(film);
        setMode('edit');
    };

    let filter_name = "";
    let films = [...props.films];

    if (props.filter === "all") {
        filter_name = "All Films";
    } else if (props.filter === "favorites") {
        filter_name = "Favorite Films";
        films = films.filter(film => film.favorites);
    } else if (props.filter === "best") {
        filter_name = "Best Rated Films";
        films = films.filter(film => film.rating == 5);
    } else if (props.filter === "seen") {
        filter_name = "Films Seen Last Month";
        films = films.filter(film => film.watchedDate && film.watchedDate.isAfter(dayjs().subtract(1, 'month')));
    } else {
        filter_name = "Unseen Films";
        films = films.filter(film => !film.watchedDate);
    }

    const sortByScore = () => {
        setSortOrder((olderOrder) => olderOrder === 'desc_score'? 'asc_score' : 'desc_score');
    }

    const sortByDate = () => {
        setSortOrder((olderOrder) => olderOrder === 'desc_date'? 'asc_date' : 'desc_date');
    }

    const sortByName = () => {
        setSortOrder((olderOrder) => olderOrder === 'asc_name'? 'desc_name' : 'asc_name');
    }

    if (sortOrder === 'asc_score') {
        films.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === 'desc_score') {
        films.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'asc_date') {
        films.sort((a, b) => {
            if (!a.watchedDate) {
                return 1;
            }
            else if (!b.watchedDate) {
                return -1;
            }
            else {
                return a.watchedDate.isSameOrBefore(b.watchedDate) ? -1 : 1;
            }
    });
    } else if (sortOrder === 'desc_date') {
        films.sort((a, b) => {
            if (!a.watchedDate) {
                return 1;
            }
            else if (!b.watchedDate) {
                return -1;
            }
            else {
                return a.watchedDate.isSameOrBefore(b.watchedDate) ? 1 : -1;
            }    
        });
    } else if (sortOrder === 'asc_name') {
        films.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'desc_name') {
        films.sort((a, b) => b.title.localeCompare(a.title));
    }


    return (
        <Col md={9} className="pt-3">
            <h1>{filter_name}
                <Button variant="link" onClick={sortByName}>Sort by name</Button>
                <Button variant="link" onClick={sortByScore}>Sort by score</Button>
                <Button variant="link" onClick={sortByDate}>Sort by date</Button>
                <Button variant="link" onClick={() => setSortOrder('none')}>Reset</Button>
            </h1>
            
            <FilmTable films={films} deleteFilm={props.deleteFilm} setMode={setMode} handleEdit={handleEdit}/>
            <Col md={12} className="d-flex justify-content-end">
                {mode === 'default' && 
                <Button 
                    variant="primary" className="rounded-circle" 
                    style={{position: "fixed", bottom: "10px"}} 
                    onClick={() => {setMode('add')}}>
                    <i className="bi bi-plus-lg"></i></Button>}
            </Col>
            <Col md={12}>
                {mode === 'add' && 
                <FilmForm 
                    setMode={setMode} 
                    addFilm={(film) => {props.addFilm(film); setMode('default')}} 
                    cancel={() => setMode('default')}/>}
            </Col>
            <Col md={12}>
                {mode === 'edit' && 
                <FilmForm 
                    key={editableFilm.id} 
                    setMode={setMode} cancel={() => setMode('default')} 
                    updateFilm={(film) => {props.updateFilm(film); setMode('default')}} 
                    film={editableFilm}/>}
            </Col>
            
        </Col>
    )
}

function FilmTable(props) {
    return (
        <ListGroup className="list-group-flush">
            {props.films.map(film => <FilmRow key={film.id} film={film} deleteFilm={props.deleteFilm} setMode={props.setMode} handleEdit={props.handleEdit}/>)}
        </ListGroup>
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
                    <FormCheckInput type="checkbox" checked={props.film.favorites} readOnly={true}/> Favorite
                </Col>
                <Col className="text-xl-center">
                    {props.film.watchedDate ? props.film.watchedDate.format("MMMM DD[, ]YYYY") : ''}
                </Col>
                <Col className="text-end">
                    {Array.from({ length: 5 }, (_, index) => (
                        <i
                            key={index}
                            className={`bi bi-star${index < props.film.rating ? "-fill" : ""} text-warning mx-1`}
                        ></i>
                    ))}
                </Col>
                <Col className="text-end">
                    <Button variant="warning" className="mx-1" onClick={() => props.handleEdit(props.film)}><i className="bi bi-pencil"></i></Button>
                    <Button variant="danger" className="mx-1" onClick={() => props.deleteFilm(props.film)} ><i className="bi bi-trash"></i></Button>
                </Col>
            </Row>
        </ListGroupItem>
    )
}


export default Films