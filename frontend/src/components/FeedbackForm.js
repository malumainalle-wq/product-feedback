// src/components/FeedbackForm.js
import React, { useState, useEffect } from "react";
// <-- Import Image -->
import { Form, Button, Card, Row, Col, Image } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import axios from 'axios';

function FeedbackForm({ onSubmit, existingFeedback, handleClose }) {
  const [username, setUsername] = useState(existingFeedback?.username || "");
  const [message, setMessage] = useState(existingFeedback?.message || "");
  const [rating, setRating] = useState(existingFeedback?.rating || 0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(existingFeedback?.category || "");
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(existingFeedback?.product?._id || "");

  // --- NEW: State for product image preview ---
  const [selectedProductImage, setSelectedProductImage] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/categories");
        setCategories(res.data);

        if (existingFeedback?.category) {
          fetchProducts(existingFeedback.category);
        }
        // --- NEW: Set image on load if editing ---
        if (existingFeedback?.product?.imageUrl) {
          setSelectedProductImage(existingFeedback.product.imageUrl);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [existingFeedback]);
  
  const fetchProducts = async (category) => {
    if (!category) {
      setProducts([]);
      setSelectedProduct("");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/products?category=${category}`);
      setProducts(res.data);
      if (!existingFeedback) setSelectedProduct("");
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchProducts(category);
    setSelectedProductImage(null); // <-- NEW: Reset image on category change
  };

  // --- NEW: Handle product change to set image ---
  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
    
    if (productId) {
      const product = products.find(p => p._id === productId);
      setSelectedProductImage(product.imageUrl);
    } else {
      setSelectedProductImage(null);
    }
  };

  const handleSubmit = (e) => {
    // ... (handleSubmit logic is unchanged from previous step) ...
    e.preventDefault();
    if (!username || !message || rating === 0 || !selectedProduct || !selectedCategory) {
      alert("Please fill out all fields, including category and product.");
      return;
    }
    
    onSubmit({ 
      username, 
      message, 
      rating, 
      product: selectedProduct,
      category: selectedCategory
    });

    if (!existingFeedback) {
      setUsername("");
      setMessage("");
      setRating(0);
      setSelectedCategory("");
      setSelectedProduct("");
      setProducts([]);
      setSelectedProductImage(null); // <-- NEW: Reset image on submit
    }
    if (handleClose) handleClose();
  };

  return (
    <Card className="p-4 mb-4 shadow">
      <Form onSubmit={handleSubmit}>
        <h5 className="mb-3">{existingFeedback ? "Edit" : "Add"} Feedback</h5>

        {/* --- NEW: Image Preview --- */}
        {selectedProductImage && (
          <div className="text-center mb-3">
            <Image 
              src={selectedProductImage} 
              style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
              rounded 
            />
          </div>
        )}

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
                onChange={handleProductChange} // <-- Use new handler
                disabled={!selectedCategory} 
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