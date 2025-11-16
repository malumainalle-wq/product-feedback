// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

function HomePage() {
  const [feedbacks, setFeedbacks] = useState([]);
  
  // State for filters
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterRating, setFilterRating] = useState("");

  // Fetch categories for the filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch feedbacks based on filters
  const fetchFeedbacks = async () => {
    try {
      const params = {
        // page: 1, // You can add pagination back here if you want
        limit: 20 // Show latest 20
      };
      if (filterCategory) params.category = filterCategory;
      if (filterRating) params.rating = filterRating;

      const res = await axios.get("http://localhost:5000/api/feedbacks", { params });
      setFeedbacks(res.data.feedbacks);
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    fetchFeedbacks();
  }, [filterCategory, filterRating]);

  const addFeedback = async (feedbackData) => {
    await axios.post("http://localhost:5000/api/feedbacks", feedbackData);
    // After adding, fetch all feedbacks again to show the new one
    fetchFeedbacks(); 
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4 text-primary">Product Feedback System</h1>
      <FeedbackForm onSubmit={addFeedback} />
      
      <hr className="my-4" />

      {/* Filter Section */}
      <h3 className="mb-3">Filter Feedback</h3>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Category</Form.Label>
            <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Rating</Form.Label>
            <Form.Select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <FeedbackList feedbacks={feedbacks} onFeedbackUpdate={fetchFeedbacks} />
    </Container>
  );
}

export default HomePage;