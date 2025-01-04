import { Row, Col, ListGroup, ListGroupItem, Button } from "react-bootstrap"
import FormCheckInput from "react-bootstrap/esm/FormCheckInput"


function Films(props) {
    let filter_name = "";

    if (props.filter === "all") {
        filter_name = "All Films";
    } else if (props.filter === "favorites") {
        filter_name = "Favorite Films";
    } else if (props.filter === "best") {
        filter_name = "Best Rated Films";
    } else if (props.filter === "seen") {
        filter_name = "Films Seen Last Month";
    } else {
        filter_name = "Unseen Films";
    }

    return (
        <Col md={9} className="pt-3">
            <h2>{`${filter_name}`}</h2>
            <FilmTable films={props.films}/>
            <Col md={12} className="d-flex justify-content-end">
                <Button variant="primary" className="rounded-circle" style={{position: "fixed", bottom: "10px"}}><i className="bi bi-plus-lg"></i></Button>
            </Col>
            
        </Col>
    )
}

function FilmTable(props) {
    return (
        <ListGroup className="list-group-flush">
            {props.films.map(film => <FilmRow film={film}/>)}
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
                    <Button variant="warning" className="mx-1"><i className="bi bi-pencil"></i></Button>
                    <Button variant="danger" className="mx-1"><i className="bi bi-trash"></i></Button>
                </Col>
            </Row>
        </ListGroupItem>
    )
}


export default Films