import { Container, Navbar, Form } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function NavigationBar () {

    const navigate = useNavigate();

    const [query, setQuery] = useState('');

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (query === '') return;
        navigate(`/films/search/${query}`);
        setQuery('');
    }

    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };
    
    return (
        <Navbar bg='primary'>
            <Container fluid>
                <Navbar.Brand className='text-light'>
                    <i className="bi bi-collection-play"></i> FilmLibrary
                </Navbar.Brand>

                <Form className='d-flex' role='search' onSubmit={handleSearchSubmit}>
                    <Form.Control 
                        className='me-2' 
                        type='search' placeholder='Search' 
                        aria-label='Search' 
                        value={query}
                        onChange={handleSearchChange}/>
                </Form>
                
                <Navbar.Brand className='text-white-50'>
                    <i className="bi bi-person-circle"></i> 
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
    
}

export default NavigationBar;