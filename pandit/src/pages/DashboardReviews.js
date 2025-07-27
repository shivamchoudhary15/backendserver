// src/pages/DashboardReviews.js
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { createReview } from '../api/api'; // Ensure createReview is imported

// StarRating component (copied here for self-containment, or import from components if preferred)
function StarRating({ rating, onChange }) {
  return (
    <div className="star-rating" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          role="button"
          tabIndex="0"
          className={`star ${i <= rating ? "active" : ""}`}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function DashboardReviews() {
  const {
    review, setReview,
    reviewMessage, setReviewMessage,
    reviewLoading, setReviewLoading,
    handleReviewSubmit // Use the handler from context
  } = useOutletContext();

  return (
    <section
      id="review"
      className="review-section glass-review"
      tabIndex={-1}
      aria-label="Submit Review"
    >
      <h3 className="section-heading neon-text">Submit a Review</h3>
      {reviewMessage && (
        <p
          className={
            reviewMessage.includes("review")
              ? "success-message"
              : "error-message"
          }
        >
          {reviewMessage}
        </p>
      )}
      <form
        onSubmit={handleReviewSubmit}
        className="review-form card-glossy glass nice-glass"
        aria-label="Review submission form"
      >
        <div className="review-row">
          <input
            type="text"
            value={review.name}
            disabled
            className="review-input"
            aria-label="Your name"
          />
          <StarRating
            rating={review.rating}
            onChange={(v) => setReview((prev) => ({ ...prev, rating: v }))}
          />
        </div>
        <textarea
          placeholder="Write your feedback..."
          value={review.comment}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, comment: e.target.value }))
          }
          className="review-input review-textarea"
          required
          aria-required="true"
        />
        <button
          type="submit"
          className="custom-btn glow-btn"
          disabled={reviewLoading}
        >
          {reviewLoading ? "Submitting..." : "Submit Review 💬"}
        </button>
      </form>
    </section>
  );
}
