import {Col, Nav, NavItem } from 'react-bootstrap' 
import { useNavigate, useParams } from 'react-router-dom';
import { NavLink } from 'react-bootstrap';

function SideBar(props) {
    const params = useParams();
    const navigate = useNavigate();
    return (
        <Col md={3} className='collapse bg-light d-md-block'>
            <h5 className="mb-3" style={{marginTop: '20px'}}>Filters</h5>
            <Nav className="nav-pills flex-column gap-2 min-vh-100">
                <NavItem><NavLink className={`link-dark ${params.filter == "all" ? "active" : ""}`} onClick={() => navigate("/films/all")}>All</NavLink></NavItem>
                <NavItem><NavLink className={`link-dark ${params.filter == "favorites" ? "active" : ""}`} onClick={() => navigate("/films/favorites")}>Favorites</NavLink></NavItem>
                <NavItem><NavLink className={`link-dark ${params.filter == "best" ? "active" : ""}`} onClick={() => navigate("/films/best")}>Best Rated</NavLink></NavItem>
                <NavItem><NavLink className={`link-dark ${params.filter == "seen" ? "active" : ""}`} onClick={() => navigate("/films/seen")}>Seen Last Month</NavLink></NavItem>
                <NavItem><NavLink className={`link-dark ${params.filter == "unseen" ? "active" : ""}`} onClick={() => navigate("/films/unseen")}>Unseen</NavLink></NavItem>
            </Nav>
        </Col>
    )
}

export default SideBar;
