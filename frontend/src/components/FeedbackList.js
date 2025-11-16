import React from "react";

function FeedbackList({ feedbacks, onUpvote }) {
  return (
    <div>
      {feedbacks.length === 0 ? (
        <p className="text-muted text-center">No feedback yet.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb._id} className="card p-3 mb-3 shadow-sm">
            <h6 className="fw-bold">{fb.username}</h6>
            <p>{fb.message}</p>
            <button
              onClick={() => onUpvote(fb._id)}
              className="btn btn-outline-secondary btn-sm"
            >
              👍 {fb.upvotes}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default FeedbackList;
