import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Film, FilmLibrary } from './FilmLibrary.mjs'
import NavigationBar from './components/NavigationBar.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Films from './components/Films.jsx';
import dayjs from 'dayjs';
import { Routes, Route } from 'react-router-dom';
import FilmForm from './components/FilmForm.jsx';
import SearchFilm from './components/SearchFilm.jsx';


const fl = new FilmLibrary();
fl.init();

function App() {

  const [filter, setFilter] = useState('all');

  const changeFilter = (e) => {
    setFilter(e);
  }

  const [filmLibrary, setFilmLibrary] = useState(fl);

  const [films, setFilms] = useState(filmLibrary.getFilms());


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
        if (f.id === parseInt(film.id)) {
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

  const setFavorite = (film) => {
    setFilms((oldFilms) => {
      return oldFilms.map(f => {
        if (f.id === film.id) {
          return new Film(f.id, f.title, !f.favorites, f.watchedDate, f.rating);
        }
        return f;
      });
    });
  }

  const setScore = (film, score) => {
    setFilms((oldFilms) => {
      return oldFilms.map(f => {
        if (f.id === film.id) {
          return new Film(f.id, f.title, f.favorites, f.watchedDate, score);
        }
        return f;
      });
    });
  }

  return (
    <>
      <NavigationBar />
        <Routes>
          <Route path='/' element={
            <Container fluid className='flex-grow-1 d-flex flex-column'>
            <Row className='flex-grow-1'>
            <SideBar />
            <Col md={9} className='d-flex flex-column'>
            <h1>Select a filter</h1>
            </Col>
            </Row>
            </Container>
          } />
          <Route path='/films/:filter' element={
            <Container fluid className='flex-grow-1 d-flex flex-column'>
            <Row className='flex-grow-1'>
            <SideBar />
            <Films films={films} addFilm={addFilm} deleteFilm={deleteFilm} updateFilm={updateFilm} setFavorite={setFavorite} setScore={setScore}/>
            </Row>
            </Container>
            } />
            <Route path='/films/add' element={
              <Container fluid className='flex-grow-1 d-flex flex-column'>
                <FilmForm addFilm={addFilm} />
              </Container>
            } />
            <Route path='/films/:id/edit' element={
              <Container fluid className='flex-grow-1 d-flex flex-column'>
                <FilmForm updateFilm={updateFilm} films={films} />
              </Container>
            } />
            <Route path='/films/search/:query' element={
              <Container fluid className='flex-grow-1 d-flex flex-column'>
                <SearchFilm films={films} deleteFilm={deleteFilm} updateFilm={updateFilm} setFavorite={setFavorite} setScore={setScore}/>
              </Container>
            } />
        </Routes>
    </>
  )
}

export default App
