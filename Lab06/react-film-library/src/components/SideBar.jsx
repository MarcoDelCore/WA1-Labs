import {Col, Nav, NavItem, NavLink} from 'react-bootstrap' 

function SideBar(props) {
    return (
        <Col md={3} className='collapse bg-light d-md-block'>
            <h5 className="mb-3" style={{marginTop: '20px'}}>Filters</h5>
            <Nav className="nav-pills flex-column gap-2 min-vh-100">
                <NavItem><NavLink className={`link-dark ${props.filter === "all" ? "active" : ""}`} onClick={() => props.updateState('all')} href='#all'>All</NavLink></NavItem>
                <NavItem><NavLink className='link-dark' href='#favorites' onClick={() => props.updateState('favorites')}>Favorites</NavLink></NavItem>
                <NavItem><NavLink className='link-dark' href='#best' onClick={() => props.updateState('best')}>Best Rated</NavLink></NavItem>
                <NavItem><NavLink className='link-dark' href='#seen' onClick={() => props.updateState('seen')}>Seen Last Month</NavLink></NavItem>
                <NavItem><NavLink className='link-dark' href='#unseen' onClick={() => props.updateState('unseen')}>Unseen</NavLink></NavItem>
            </Nav>
        </Col>
    )
}

export default SideBar;
