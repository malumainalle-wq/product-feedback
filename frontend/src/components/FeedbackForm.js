// src/components/FeedbackForm.js
import React, { useState } from "react";
import { Form, Button, Card } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating'; // <-- Import

// Pass in existing feedback for "Edit" mode
function FeedbackForm({ onSubmit, existingFeedback, handleClose }) {
  const [username, setUsername] = useState(existingFeedback?.username || "");
  const [message, setMessage] = useState(existingFeedback?.message || "");
  const [rating, setRating] = useState(existingFeedback?.rating || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !message || rating === 0) return;
    onSubmit({ username, message, rating });

    // Only clear if it's NOT an edit form
    if (!existingFeedback) {
      setUsername("");
      setMessage("");
      setRating(0);
    }
    if (handleClose) handleClose(); // Close modal if in one
  };

  return (
    <Card className="p-4 mb-4 shadow">
      <Form onSubmit={handleSubmit}>
        <h5 className="mb-3">{existingFeedback ? "Edit" : "Add"} Feedback</h5>

        <Rating
          onClick={(rate) => setRating(rate)}
          initialValue={rating}
          size={30}
          className="mb-3"
        />

        <Form.Group className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Your Feedback</Form.Label>
          <Form.Control as="textarea" value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Group>

        <Button className="btn btn-primary w-100" type="submit">Submit</Button>
      </Form>
    </Card>
  );
}

export default FeedbackForm;