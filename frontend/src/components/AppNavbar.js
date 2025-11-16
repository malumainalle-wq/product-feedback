// src/components/AppNavbar.js
// (Paste this correct code into your file)

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Feedback System</Navbar.Brand>
        <Nav className="ms-auto">
          {isAuth ? (
            <>
              <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">Admin Login</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;