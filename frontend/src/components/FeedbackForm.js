// src/components/FeedbackForm.js
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import axios from 'axios';

function FeedbackForm({ onSubmit, existingFeedback, handleClose }) {
  const [username, setUsername] = useState(existingFeedback?.username || "");
  const [message, setMessage] = useState(existingFeedback?.message || "");
  const [rating, setRating] = useState(existingFeedback?.rating || 0);

  // New state for categories and products
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(existingFeedback?.category || "");
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(existingFeedback?.product?._id || "");

  // 1. Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/categories");
        setCategories(res.data);

        // If editing, load the products for the existing category
        if (existingFeedback?.category) {
          fetchProducts(existingFeedback.category);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [existingFeedback]); // Re-run if editing
  
  // 2. Fetch products when a category is selected
  const fetchProducts = async (category) => {
    if (!category) {
      setProducts([]);
      setSelectedProduct("");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/products?category=${category}`);
      setProducts(res.data);
      // If not editing, reset product selection
      if (!existingFeedback) setSelectedProduct("");
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  // 3. Handle category dropdown change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchProducts(category); // Fetch products for this category
  };

  // 4. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !message || rating === 0 || !selectedProduct || !selectedCategory) {
      alert("Please fill out all fields, including category and product.");
      return;
    }
    
    // Pass all data up
    onSubmit({ 
      username, 
      message, 
      rating, 
      product: selectedProduct,  // Send the product ID
      category: selectedCategory // Send the category name
    });

    if (!existingFeedback) {
      setUsername("");
      setMessage("");
      setRating(0);
      setSelectedCategory("");
      setSelectedProduct("");
      setProducts([]);
    }
    if (handleClose) handleClose();
  };

  return (
    <Card className="p-4 mb-4 shadow">
      <Form onSubmit={handleSubmit}>
        <h5 className="mb-3">{existingFeedback ? "Edit" : "Add"} Feedback</h5>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)} 
                disabled={!selectedCategory} // Disable until category is chosen
              >
                <option value="">Select Product</option>
                {products.map(prod => (
                  <option key={prod._id} value={prod._id}>{prod.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Your Feedback</Form.Label>
          <Form.Control as="textarea" value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Your Rating</Form.Label>
          <div>
            <Rating
              onClick={(rate) => setRating(rate)}
              initialValue={rating}
              size={30}
              className="mb-3"
            />
          </div>
        </Form.Group>

        <Button className="btn btn-primary w-100" type="submit">Submit</Button>
      </Form>
    </Card>
  );
}

export default FeedbackForm;