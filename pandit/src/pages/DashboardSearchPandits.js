// src/pages/DashboardSearchPandits.js
import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardSearchPandits() {
  const {
    pandits, // All pandits (from context)
    filteredPandits, // Filtered pandits based on search input (from context)
    searchPandits,
    setSearchPandits,
    expandedPandits,
    toggleExpand,
    panditListRef,
    scrollList,
    setChatPanditId,
    setChatPanditName
  } = useOutletContext();

  return (
    <section
      id="pandit"
      className="pandit-section horizontal-carousel-section"
      tabIndex={-1}
      aria-label="Verified Pandits"
    >
      <div className="section-header">
        <h3 className="section-heading highlighted-heading">Verified Pandits</h3>
        <div className="carousel-controls">
          <button
            aria-label="Scroll pandits left"
            onClick={() => scrollList(panditListRef, "left")}
            className="carousel-arrow-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label="Scroll pandits right"
            onClick={() => scrollList(panditListRef, "right")}
            className="carousel-arrow-btn"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <input
        type="text"
        className="booking-search"
        aria-label="Search pandits"
        placeholder="Search by name or city..."
        value={searchPandits}
        onChange={(e) => setSearchPandits(e.target.value)}
      />
      <div className="pandit-list horizontal-scroll" ref={panditListRef} tabIndex={0}>
        {filteredPandits.length === 0 ? (
          <p className="empty-msg">No pandits found matching your search.</p>
        ) : (
          filteredPandits.map((pandit) => (
            <motion.div
              key={pandit._id}
              className="improved-pandit-card neon-card glass-highlight glossy shadow-pop horizontal-card"
              whileHover={{ y: -4, scale: 1.04 }}
              tabIndex={0}
              aria-expanded={expandedPandits[pandit._id] || false}
              onClick={() => toggleExpand(pandit._id)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && toggleExpand(pandit._id)
              }
            >
              <div
                className="pandit-avatar glass"
                style={{
                  backgroundImage: `url(${pandit.profile_photo_url || "/images/i1.jpeg"})`,
                }}
                aria-label={`Pandit ${pandit.name}`}
              >
                <span className="pandit-avatar-initial">{pandit.name.slice(0, 1)}</span>
              </div>
              <div className="pandit-main-info">
                <h4 className="pandit-name hero-text-glow">🧑‍🦳 {pandit.name}</h4>
                <div className="pandit-city">{pandit.city}</div>
                {expandedPandits[pandit._id] && (
                  <div className="pandit-extra expanded horizontal-extra">
                    <div className="pandit-details">
                      <div className="pandit-badges">
                        <span className="pandit-badge exp">
                          Exp: {pandit.experienceYears} yrs
                        </span>
                        <span className="pandit-badge langs">
                          {pandit.languages?.join(", ")}
                        </span>
                      </div>
                      <div className="pandit-specialties">
                        <b>Specialties:</b> {pandit.specialties?.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatPanditId(pandit._id);
                    setChatPanditName(pandit.name);
                  }}
                  style={{ marginTop: 8 }}
                  className="custom-btn glow-btn"
                  aria-label={`Chat with ${pandit.name}`}
                >
                  Chat with Pandit
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
