// src/pages/DashboardSearchPooja.js
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PoojaCard from '../components/PoojaCard'; // Reusing PoojaCard

export default function DashboardSearchPooja() {
  const {
    poojas, // All poojas (from context)
    filteredPoojas, // Filtered poojas based on search input (from context)
    searchPoojas,
    setSearchPoojas,
    addToCart,
    poojaListRef,
    scrollList,
    navigate
  } = useOutletContext();

  return (
    <section id="pooja-services" className="pooja-section horizontal-carousel-section" tabIndex={-1} aria-label="Pooja Services">
      <div className="section-header">
        <h3 className="section-heading highlighted-heading">Pooja Services</h3>
        <div className="carousel-controls">
          <button
            aria-label="Scroll pooja services left"
            onClick={() => scrollList(poojaListRef, "left")}
            className="carousel-arrow-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label="Scroll pooja services right"
            onClick={() => scrollList(poojaListRef, "right")}
            className="carousel-arrow-btn"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <input
        type="text"
        className="booking-search"
        aria-label="Search pooja services"
        placeholder="Search by pooja name or description..."
        value={searchPoojas}
        onChange={(e) => setSearchPoojas(e.target.value)}
      />
      <div className="pooja-list horizontal-scroll" ref={poojaListRef} tabIndex={0}>
        {filteredPoojas.length === 0 ? (
          <p className="empty-msg">No pooja services found matching your search.</p>
        ) : (
          filteredPoojas.map((pooja) => (
            <PoojaCard key={pooja._id} pooja={pooja} addToCart={addToCart} navigate={navigate} />
          ))
        )}
      </div>
    </section>
  );
}
