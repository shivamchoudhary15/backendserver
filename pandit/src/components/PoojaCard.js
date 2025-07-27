// src/components/PoojaCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CalendarDays } from 'lucide-react'; // Import icons

export default function PoojaCard({ pooja, addToCart, navigate }) {
  const handleBookNow = () => {
    navigate('/booking', { state: { selectedPooja: pooja } });
  };

  return (
    <motion.div
      className="pooja-card neon-card glass-highlight glossy shadow-pop horizontal-card"
      whileHover={{ y: -4, scale: 1.04 }}
      tabIndex={0}
      aria-label={`Pooja service: ${pooja.name}`}
    >
      <img
        src={pooja.image_url || "/images/default-pooja.jpeg"} // Add a default image
        alt={pooja.name}
        className="pooja-image"
      />
      <h4 className="pooja-name">{pooja.name}</h4>
      <p className="pooja-description">{pooja.description}</p>
      <div className="pooja-price">₹{pooja.price?.toLocaleString('en-IN') || 'N/A'}</div>
      <div className="pooja-actions">
        <button className="custom-btn glow-btn" onClick={() => addToCart(pooja)} aria-label={`Add ${pooja.name} to cart`}>
          <ShoppingCart size={18} /> Add to Cart
        </button>
        <button className="custom-btn" onClick={handleBookNow} aria-label={`Book ${pooja.name} now`}>
          <CalendarDays size={18} /> Book Now
        </button>
      </div>
    </motion.div>
  );
}
