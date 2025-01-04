import { useState } from 'react'
import {Container, Row, Col, Button } from 'react-bootstrap'
import {Film, FilmLibrary} from './FilmLibrary.mjs'
import NavigationBar from './components/NavigationBar.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Films from './components/Films.jsx';
import dayjs from 'dayjs';


const fl = new FilmLibrary();
fl.init();

function App() {

  const [filter, setFilter] = useState('all');

  const changeFilter = (e) => {
    setFilter(e);
  }

  const [filmLibrary, setFilmLibrary] = useState(fl); 

  const [films, setFilms] = useState(filmLibrary.getFilms());

  const updateState = (filter) => {
    setFilter(filter);
  }

  const addFilm = (film) => {
    setFilms((oldFilms) => {
      const newId = Math.max(...oldFilms.map(film => film.id)) + 1;
      const newFilm = new Film(newId, film.title, film.favorite, film.date ? dayjs(film.date) : null, film.rating);
      return [...oldFilms, newFilm];
    });
  }

  const updateFilm = (film) => {
    setFilms((oldFilms) => {
      return oldFilms.map((f) => {
        if (f.id === film.id) {
          return new Film(f.id, film.title, film.favorite, film.date ? dayjs(film.date) : null, film.rating);
        }
        return f;
      });
    });
  }

  const deleteFilm = (film) => {
    setFilms((oldFilms) => {
      return oldFilms.filter(f => f.id !== film.id);
    });
  }

  return (
    <>
      <NavigationBar />
      <Container fluid className='flex-grow-1 d-flex flex-column'>
        <Row className='flex-grow-1'>
          <SideBar filter={filter} updateState={updateState}/>
          <Films films={films} filter={filter} addFilm={addFilm} deleteFilm={deleteFilm} updateFilm={updateFilm}/>
        </Row>
      </Container>
    </>
  )
}

export default App
