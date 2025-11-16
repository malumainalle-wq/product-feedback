// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form } from 'react-bootstrap'; // <-- Import Form
import ReactPaginate from 'react-paginate';
import FeedbackList from './FeedbackList';

function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ totalFeedbacks: 0, avgRating: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --- NEW FILTER STATE ---
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterRating, setFilterRating] = useState("");
  // -------------------------

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

  const fetchAllData = async () => {
    // Fetch stats
    const statsRes = await axios.get("http://localhost:5000/api/feedbacks/stats");
    setStats(statsRes.data);
    
    // Fetch feedbacks (this will now use the new fetchFeedbacks function)
    fetchFeedbacks(page); 
  };

  const fetchFeedbacks = async (currentPage) => {
    try {
      const params = {
        page: currentPage,
        limit: 5
      };
      if (filterCategory) params.category = filterCategory;
      if (filterRating) params.rating = filterRating;
      
      const fbRes = await axios.get(`http://localhost:5000/api/feedbacks`, { params });
      setFeedbacks(fbRes.data.feedbacks);
      setTotalPages(fbRes.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    }
  };

  // Re-fetch when page or filters change
  useEffect(() => {
    fetchAllData();
  }, [page, filterCategory, filterRating]); // <-- Added filters

  const handlePageClick = (e) => {
    setPage(e.selected + 1);
  };

  return (
    <Container>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Analytics Dashboard */}
      {/* ... (this section remains the same as your file) ... */}
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
      
      {/* --- NEW FILTER SECTION --- */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Category</Form.Label>
            <Form.Select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}>
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
            <Form.Select value={filterRating} onChange={(e) => { setFilterRating(e.target.value); setPage(1); }}>
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
      {/* --------------------------- */}
      
      <FeedbackList 
        feedbacks={feedbacks} 
        adminMode={true} 
        onFeedbackUpdate={fetchAllData} 
      />

      {/* Pagination */}
      {/* ... (this section remains the same as your file) ... */}
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