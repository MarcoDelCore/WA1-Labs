/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 9 - 2024
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap/';
import { Route, Routes, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

import Header from "./components/Header.jsx";
import FilmForm from './components/FilmForm.jsx';
import { EditLayout, FilmLibraryLayout, FilmListLayout, NotFoundLayout } from './components/PageLayout.jsx';
import FeedbackContext from "./contexts/FeedbackContext.js";
import { Toast, ToastBody } from "react-bootstrap";
import { Registration } from './components/Registration.jsx'
import API from "./API.js";

function App() {

    const navigate = useNavigate();

    // ***** Authentication *****
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const user = await API.getUserInfo(); // we have the user info here
            setLoggedIn(true);
            setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
            setUser(user);
        };
        checkAuth();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const user = await API.logIn(credentials);
            setLoggedIn(true);
            setUser(user);
            setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' })
            navigate(-1)
        } catch (err) {
            setMessage({ msg: err, type: 'danger' })
        }
    };

    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false);
        setMessage('');
        setUser('');
    };

    const handleRegistration = async (name, email, password) => {
        try {
            await API.registerUser(name, email, password);
            handleLogin({ username: email, password: password })
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Defining a structure for Filters
     * Each filter is identified by a unique name and is composed by the following fields:
     * - A label to be shown in the GUI
     * - An ID (equal to the unique name), used as key during the table generation
     */
    const filters = {
        'filter-all': { label: 'All', url: '' },
        'filter-favorite': { label: 'Favorites', url: '/filters/filter-favorite' },
        'filter-best': { label: 'Best Rated', url: '/filters/filter-best' },
        'filter-lastmonth': { label: 'Seen Last Month', url: '/filters/filter-lastmonth' },
        'filter-unseen': { label: 'Unseen', url: '/filters/filter-unseen' }
    };

    // This state controls the expansion of the sidebar (on small breakpoints only)
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // This state is used to store the feedback message to be shown in the toast
    const [feedback, setFeedback] = useState('');

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message); // Assuming only one error message at a time
    };

    // This state contains the list of movie. It will be updated when a movie is modified or a new movie is added.
    const [films, setFilms] = useState([]);

    // Workaround to avoid refetching data when creating or updating a film
    const [lastFilter, setLastFilter] = useState(undefined);

    const { pathname } = useLocation();

    useEffect(() => {
        console.log('pathname:', pathname);
        console.log('lastFilter:', lastFilter)
        if (pathname.startsWith('/filters')) {
            setLastFilter(pathname.split('/').pop());
        } else if (pathname === '/') {
            setLastFilter('');
        }
        // else: lastFilter is kept when creating or updating a film
    }, [pathname]);


    useEffect(() => {
        if (lastFilter === undefined) return;
        API.getFilms(lastFilter, user.id)
            .then(films => {
                setFilms(films);
            })
            .catch(e => {
                setFeedbackFromError(e);
            });
    }, [lastFilter, user]);

    // This function add the new film into the FilmLibrary array
    const saveNewFilm = () => {
        API.getFilms(lastFilter, user.id)
            .then(films => {
                setFilms(films);
            })
            .catch(e => {
                setFeedbackFromError(e);
            });
    };

    // This function updates a film already stored into the FilmLibrary array
    const updateFilm = () => {
        API.getFilms(lastFilter, user.id)
            .then(films => {
                setFilms(films);
            })
            .catch(e => {
                setFeedbackFromError(e);
            });
    };

    const deleteFilm = () => {
        API.getFilms(lastFilter, user.id)
            .then(films => {
                setFilms(films);
            })
            .catch(e => {
                setFeedbackFromError(e);
            });
    };

    return (
        /* We forward the setFeedback function via a context as it will be used in add/edit routes for next lab */
        <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError }}>
            <div className="min-vh-100 d-flex flex-column">
                <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded}
                    isLoggedIn={loggedIn} handleLogout={handleLogout} user={user}/>
                <Container fluid className='mt-3'>
                    { }
                    {message && <Row>
                        <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                    </Row>}
                    <Outlet />
                </Container>
                <Container fluid className="flex-grow-1 d-flex flex-column">
                    <Routes>
                        <Route
                            path="/"
                            element={loggedIn ? <FilmLibraryLayout
                                films={films}
                                isSidebarExpanded={isSidebarExpanded}
                                filters={filters} /> : <Navigate to='/login'/>
                            }>
                            <Route path="*" element={<NotFoundLayout />} />
                            <Route index
                                element={<FilmListLayout
                                    films={films}
                                    filters={filters}
                                    updateFilm={updateFilm}
                                    deleteFilm={deleteFilm} />
                                } />
                            <Route path="filters/:filterLabel"
                                element={<FilmListLayout
                                    films={films}
                                    filters={filters}
                                    updateFilm={updateFilm}
                                    deleteFilm={deleteFilm} />
                                } />
                        </Route>
                        <Route path="add" element={<FilmForm addFilm={saveNewFilm} user={user}/>} />
                        <Route path="edit/:filmId" element={<EditLayout films={films} editFilm={updateFilm} user={user}/>} />
                        <Route path='/login' element={
                            loggedIn ? <Navigate replace to='/' /> : <Registration login={handleLogin} register={handleRegistration} />
                        } />
                    </Routes>
                    <Toast
                        show={feedback !== ''}
                        autohide
                        onClose={() => setFeedback('')}
                        delay={4000}
                        position="top-end"
                        className="position-fixed end-0 m-3"
                    >
                        <ToastBody>
                            {feedback}
                        </ToastBody>
                    </Toast>
                </Container>
            </div>
        </FeedbackContext.Provider>
    );
}

export default App;
