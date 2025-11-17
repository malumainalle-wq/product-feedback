// src/components/RegisterPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // We will add this to AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setError('');
      setLoading(true);
      await register(username, password);
      navigate('/admin'); // Redirect to admin dashboard on success
    } catch (err) {
      setError('Failed to create an account. User might already exist.');
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register Admin</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group id="password"
              className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center py-3">
          Already have an account? <Link to="/login">Log In</Link>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default RegisterPage;