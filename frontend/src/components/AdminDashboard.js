// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import FeedbackList from './FeedbackList';

function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ totalFeedbacks: 0, avgRating: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAllData = async () => {
    // Fetch stats
    const statsRes = await axios.get("http://localhost:5000/api/feedbacks/stats");
    setStats(statsRes.data);

    // Fetch feedbacks
    fetchFeedbacks(page);
  };

  const fetchFeedbacks = async (currentPage) => {
    const fbRes = await axios.get(`http://localhost:5000/api/feedbacks?page=${currentPage}&limit=5`);
    setFeedbacks(fbRes.data.feedbacks);
    setTotalPages(fbRes.data.totalPages);
  };

  useEffect(() => {
    fetchAllData();
  }, [page]); // Re-fetch when page changes

  const handlePageClick = (e) => {
    setPage(e.selected + 1);
  };

  return (
    <Container>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Analytics Dashboard */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Feedbacks</Card.Title>
              <Card.Text as="h3">{stats.totalFeedbacks}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Average Rating</Card.Title>
              <Card.Text as="h3">{stats.avgRating} / 5</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Manage Feedback */}
      <h3 className="mb-3">Manage Feedback</h3>
      <FeedbackList 
        feedbacks={feedbacks} 
        adminMode={true} 
        onFeedbackUpdate={fetchAllData} // Pass function to re-fetch all data
      />

      {/* Pagination */}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </Container>
  );
}

export default AdminDashboard;