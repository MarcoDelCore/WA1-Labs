import { Container, Navbar, Form } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function NavigationBar () {
    return (
        <Navbar bg='primary'>
            <Container fluid>
                <Navbar.Brand className='text-light'>
                    <i className="bi bi-collection-play"></i> FilmLibrary
                </Navbar.Brand>
                <Form className='d-flex' role='search'>
                    <Form.Control className='me-2' type='search' placeholder='Search' aria-label='Search' />
                </Form>
                <Navbar.Brand className='text-white-50'>
                    <i className="bi bi-person-circle"></i> 
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;