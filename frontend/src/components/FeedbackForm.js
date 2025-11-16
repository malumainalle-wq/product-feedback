import React, { useState } from "react";

function FeedbackForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !message) return;
    onSubmit({ username, message });
    setUsername("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow">
      <h5>Add Feedback</h5>

      <div className="mb-3">
        <label className="form-label">Your Name</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Your Feedback</label>
        <textarea
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <button className="btn btn-primary w-100">Submit</button>
    </form>
  );
}

export default FeedbackForm;
