// src/components/CartModal.js
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Plus, Minus, Trash2 } from 'lucide-react'; // Icons

export default function CartModal({ cartItems, onClose, onRemove, onUpdateQuantity, onCheckout }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (item, delta) => {
    const newQuantity = item.quantity + delta;
    onUpdateQuantity(item._id, newQuantity);
  };

  return (
    <motion.div
      className="cart-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Close when clicking outside
    >
      <motion.div
        className="cart-modal-content"
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button className="cart-modal-close-btn" onClick={onClose} aria-label="Close cart">
          <XCircle size={32} />
        </button>
        <h3>Your Cart</h3>

        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty. Start adding some Pujas!</p>
        ) : (
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <li key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</div>
                </div>
                <div className="cart-item-quantity-controls">
                  <button className="quantity-btn" onClick={() => handleQuantityChange(item, -1)} disabled={item.quantity <= 1}>
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item._id, parseInt(e.target.value) || 0)}
                    className="quantity-input"
                    min="1"
                    aria-label={`Quantity of ${item.name}`}
                  />
                  <button className="quantity-btn" onClick={() => handleQuantityChange(item, 1)}>
                    <Plus size={18} />
                  </button>
                  <button className="cart-item-remove" onClick={() => onRemove(item._id)} aria-label={`Remove ${item.name} from cart`}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="cart-summary">
              Total: ₹{totalAmount.toLocaleString('en-IN')}
            </div>
            <button className="cart-checkout-btn" onClick={onCheckout}>
              Proceed to Booking ({totalAmount.toLocaleString('en-IN')})
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
