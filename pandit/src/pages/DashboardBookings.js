// src/pages/DashboardBookings.js
import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardBookings() {
  const {
    bookings, // All bookings (from context)
    filteredBookings, // Filtered bookings based on search input (from context)
    searchBookings,
    setSearchBookings,
    bookingListRef,
    scrollList,
    getStatusClass
  } = useOutletContext();

  return (
    <section
      id="booking"
      className="bookings-section horizontal-carousel-section blur-bg"
      tabIndex={-1}
      aria-label="Booking History"
    >
      <div className="section-header">
        <h3 className="section-heading highlighted-heading">Your Bookings</h3>
        <div className="carousel-controls">
          <button
            aria-label="Scroll bookings left"
            onClick={() => scrollList(bookingListRef, "left")}
            className="carousel-arrow-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label="Scroll bookings right"
            onClick={() => scrollList(bookingListRef, "right")}
            className="carousel-arrow-btn"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <input
        type="text"
        className="booking-search"
        aria-label="Search bookings"
        placeholder="Search bookings..."
        value={searchBookings}
        onChange={(e) => setSearchBookings(e.target.value)}
      />
      <div className="booking-list horizontal-scroll" ref={bookingListRef} tabIndex={0}>
        {filteredBookings.length === 0 ? (
          <p className="empty-msg">No bookings found. Book your first puja now!</p>
        ) : (
          filteredBookings.map((b) => (
            <motion.div
              key={b._id}
              className="booking-card card-glossy glass neon-card shadow-pop horizontal-card"
              whileHover={{ scale: 1.032, boxShadow: "0 6px 32px #aecaee51" }}
              tabIndex={0}
              role="article"
              aria-label={`Booking for ${b.serviceid?.name} with ${
                b.panditid?.name || "N/A"
              } on ${new Date(b.puja_date).toLocaleDateString()} at ${b.puja_time}`}
            >
              <div className="booking-card-left">
                <span className="booking-icon" aria-hidden="true">
                  📅
                </span>
                <div>
                  <div className="booking-type">{b.serviceid?.name}</div>
                  <div className="booking-date">
                    {new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}
                  </div>
                </div>
              </div>
              <div className="booking-card-right">
                <div className="booking-pandit">
                  <span className="booking-pandit-label">Pandit:</span>{" "}
                  <span>{b.panditid?.name ?? "N/A"}</span>
                </div>
                <div className="booking-location">📍 {b.location}</div>
                <div className={getStatusClass(b.status)}>{b.status}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
