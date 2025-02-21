import React, { useState } from "react";
import { Container, Button, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import "../style/login.css";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!name || !email) {
      setError("Both fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/login`, { name, email }, { withCredentials: true });
      onLogin(name, email);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="main-container">
     
     

      {/* Adopt Me Button */}
      <Button className="adopt-btn" onClick={() => setShowModal(true)}>
        Adopt Me Now!
      </Button>

      {/* Login Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="blur">
        <Modal.Body>
          <h1 className="modal-header">Fetch Dog Adoption</h1>
          <h2 className="modal-title">Login</h2>
          <p className="modal-subtitle">Please enter your name and email to adopt a dog.</p>
          <hr />
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!error}
              />
              {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
            </Form.Group>
            <Button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Take Me Home"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;
