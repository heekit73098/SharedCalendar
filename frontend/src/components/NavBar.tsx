import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AuthService from "../utils/authService";
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();
    function logout() {
        AuthService.logout();
        navigate("/");
    } 
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">Futurum</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/calendar">Calendar</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Item>{}</Nav.Item>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
}