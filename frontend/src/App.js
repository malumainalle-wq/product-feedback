import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";

function App() {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    const res = await axios.get("http://localhost:5000/api/feedbacks");
    setFeedbacks(res.data);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const addFeedback = async (data) => {
    const res = await axios.post("http://localhost:5000/api/feedbacks", data);
    setFeedbacks([...feedbacks, res.data]);
  };

  const upvoteFeedback = async (id) => {
    const res = await axios.put(`http://localhost:5000/api/feedbacks/${id}/upvote`);
    setFeedbacks(feedbacks.map(f => f._id === id ? res.data : f));
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 text-primary">Product Feedback System</h1>
      <FeedbackForm onSubmit={addFeedback} />
      <FeedbackList feedbacks={feedbacks} onUpvote={upvoteFeedback} />
    </div>
  );
}

export default App;
