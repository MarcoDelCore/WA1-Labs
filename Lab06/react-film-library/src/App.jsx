import { useState } from 'react'
import {Container, Row, Col, Button } from 'react-bootstrap'
import FilmLibrary from './FilmLibrary.mjs'
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

  const [films, setFilms] = useState(fl.getFilms());

  const selectFilms = (filter) => {
    if (filter === 'all') {
      setFilms(fl.getFilms());
    } else if (filter === 'favorites') {
      setFilms(fl.getFilms().filter(film => film.favorites));
    } else if (filter === 'best') {
      setFilms(fl.getFilms().filter(film => film.rating == 5));
    } else if (filter === 'seen') {
      setFilms(fl.getFilms().filter(film => film.watchedDate && film.watchedDate.isAfter(dayjs().subtract(1, 'month'))));
    } else {
      setFilms(fl.getFilms().filter(film => !film.watchedDate));
    }
  }

  const updateState = (filter) => {
    setFilter(filter);
    selectFilms(filter);
  }

  return (
    <>
      <NavigationBar />
      <Container fluid className='flex-grow-1 d-flex flex-column'>
        <Row className='flex-grow-1'>
          <SideBar filter={filter} updateState={updateState}/>
          <Films films={films} filter={filter} />
        </Row>
      </Container>
    </>
  )
}

export default App
