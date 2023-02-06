import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AuthService from "../utils/authService";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileService from '../utils/profileService';
import logo from '../assets/logo-no-background.png'

export default function NavBar() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [authenticated, setAuthenticated] = useState(false)
    const [loaded, setLoaded] = useState(false)
    function logout() {
        AuthService.logout();
        navigate("/");
    } 

    useEffect(() => {
      ProfileService.getProfile().then( res => {
        setFirstName(res.data.first_name)
        setAuthenticated(true)
        setLoaded(true)
      }).catch((err) => {
        if (err.response.status === 403) {
          setAuthenticated(false)
          setLoaded(true)
        }
      })
    }, [])
    if (!loaded) {
      return (
        <div>Loading...</div>
      )
    }
    if (authenticated) {
      return (
        <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/"><img src={logo} alt="Futurum" width="200px" height = "50px"/></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/calendar">Calendar</Nav.Link>
                <Nav.Link href="/journal">Journal</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="/profile">Welcome, {firstName}</Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    } else {
      return (
        <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/"><img src={logo} alt="Futurum" width="200px" height = "50px"/></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/features">Features</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )
    }
    
}