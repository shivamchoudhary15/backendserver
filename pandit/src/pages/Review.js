import React, { useState } from 'react';
import { createReview } from '../api/api';

function ReviewForm() {
  const [review, setReview] = useState({
    name: '',
    rating: '',
    comment: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingValue = Number(review.rating);
    if (!review.name || !review.comment || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      alert('Please fill all fields and enter a rating between 1 and 5.');
      return;
    }

    try {
      setLoading(true);
      await createReview({
        name: review.name,
        rating: ratingValue,
        comment: review.comment,
      });
      alert('✅ Review submitted!');
      setReview({ name: '', rating: '', comment: '' });
    } catch (error) {
      console.error('Review submission failed:', error);
      const msg = error.response?.data?.error || 'Failed to submit review';
      alert(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Submit a Review</h2>

      <label>
        Name:
        <input
          type="text"
          value={review.name}
          onChange={(e) => setReview({ ...review, name: e.target.value })}
          required
        />
      </label>

      <label>
        Rating (1–5):
        <input
          type="number"
          value={review.rating}
          onChange={(e) => setReview({ ...review, rating: e.target.value })}
          min={1}
          max={5}
          required
        />
      </label>

      <label>
        Comment:
        <textarea
          value={review.comment}
          onChange={(e) => setReview({ ...review, comment: e.target.value })}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;


