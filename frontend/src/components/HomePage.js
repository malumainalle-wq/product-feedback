// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import FeedbackForm from './FeedbackForm'; // Will update this
import FeedbackList from './FeedbackList'; // Will update this

function HomePage() {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    const res = await axios.get("http://localhost:5000/api/feedbacks");
    setFeedbacks(res.data.feedbacks); // Data is now paginated
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const addFeedback = async (feedbackData) => {
    const res = await axios.post("http://localhost:5000/api/feedbacks", feedbackData);
    setFeedbacks([res.data, ...feedbacks]); // Add to top
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4 text-primary">Product Feedback System</h1>
      <FeedbackForm onSubmit={addFeedback} />
      <FeedbackList feedbacks={feedbacks} />
    </Container>
  );
}

export default HomePage;