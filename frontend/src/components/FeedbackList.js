// src/components/FeedbackList.js
import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
// <-- Import Image and Badge -->
import { Card, Button, Modal, Row, Col, Badge, Image } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import FeedbackForm from "./FeedbackForm";

function FeedbackList({ feedbacks, adminMode = false, onFeedbackUpdate }) {
  const { token } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  // ... (all helper functions openEdit, closeEdit, etc. remain the same) ...
  const openEdit = (fb) => { setSelected(fb); setShowEdit(true); };
  const closeEdit = () => setShowEdit(false);
  const openDelete = (fb) => { setSelected(fb); setShowDelete(true); };
  const closeDelete = () => setShowDelete(false);

  const handleEdit = async (feedbackData) => {
    await axios.put(`http://localhost:5000/api/feedbacks/${selected._id}`, feedbackData, {
      headers: { 'x-auth-token': token }
    });
    onFeedbackUpdate();
    closeEdit();
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/feedbacks/${selected._id}`, {
      headers: { 'x-auth-token': token }
    });
    onFeedbackUpdate();
    closeDelete();
  };


  return (
    <div>
      {feedbacks.length === 0 ? (
        <p className="text-muted text-center">No feedback found for these filters.</p>
      ) : (
        feedbacks.map((fb) => (
          <Card key={fb._id} className="p-3 mb-3 shadow-sm">
            <Row className="align-items-center">
              {/* --- NEW Image Column --- */}
              <Col xs="auto">
                <Image
                  src={fb.product?.imageUrl || 'https://via.placeholder.com/100'}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  rounded
                />
              </Col>

              {/* --- Main Feedback Content Column --- */}
              <Col>
                <div className="mb-2">
                  <Badge bg="secondary" className="me-2">{fb.category}</Badge>
                  <span className="fw-bold">{fb.product?.name || 'Product'}</span>
                </div>
                {/* --- MODIFIED: Added submission date and time column --- */}
                <h6 className="fw-bold d-flex justify-content-between align-items-center">
                  <span>{fb.username}</span>
                  <small className="text-muted fw-normal">
                    Submitted: {new Date(fb.createdAt).toLocaleString()}
                  </small>
                </h6>
                <p className="mb-0">{fb.message}</p>
              </Col>

              {/* --- Rating & Admin Column --- */}
              <Col xs="auto" className="text-end">
                <Rating initialValue={fb.rating} readonly size={25} />
                {adminMode && (
                  <div className="mt-2">
                    <Button variant="outline-secondary" size="sm" onClick={() => openEdit(fb)}>Edit</Button>
                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => openDelete(fb)}>Delete</Button>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        ))
      )}

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={closeEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FeedbackForm onSubmit={handleEdit} existingFeedback={selected} handleClose={closeEdit} />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={closeDelete}>
        {/* ... (modal content is unchanged) ... */}
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this feedback?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDelete}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FeedbackList;