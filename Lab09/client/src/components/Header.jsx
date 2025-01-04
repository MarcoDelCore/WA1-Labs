import { Button, Col, Container, Row } from "react-bootstrap/";
import PropTypes from "prop-types";
import { LogoutButton } from "./Registration";

function Header(props) {

    return <header className="py-1 py-md-3 border-bottom bg-primary">
        <Container fluid className="gap-3 align-items-center">
            <Row>
                <Col xs={3} className="d-md-none">
                    <Button
                        onClick={() => props.setIsSidebarExpanded(p => !p)}
                        aria-controls="films-filters"
                        aria-expanded={props.isSidebarExpanded}
                    >
                        <i className="bi bi-list" />
                    </Button>
                </Col>
                <Col xs={6} md={4}>
                    <a href="/"
                        className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none">
                        <i className="bi bi-collection-play me-2 flex-shrink-0"></i>
                        <span className="h5 mb-0">Film Library</span>
                    </a>
                </Col>
                <Col xs={3} md={8} className="d-flex justify-content-between">
                    {props.isLoggedIn ? 
                    <>
                    <form className="d-none d-md-block me-3">
                    <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
                    </form>
                    <div className="d-flex align-items-center justify-content-end text-light flex-grow-1">
                        Welcome&nbsp; <u><i>{props.user.name}</i></u>!&nbsp;
                        <span className="h5 mb-0"><LogoutButton logout={props.handleLogout} /></span>
                    </div> </>
                    : null}
                </Col>
            </Row>
        </Container>
    </header >;
}

Header.propTypes = {
    isSidebarExpanded: PropTypes.bool,
    setIsSidebarExpanded: PropTypes.func
}

export default Header;
