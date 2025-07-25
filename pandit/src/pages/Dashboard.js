import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  CalendarDays,
  Book,
  LogOut,
  ListChecks,
  MessageCircle,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Dashboard.css";
import { createReview, getBookings, getVerifiedPandits } from "../api/api";
import ChatWindow from "./ChatWindow";
import { useNavigate } from "react-router-dom";


const sidebarLinks = [
  { label: "Home", icon: Home, goto: "/" },
  { label: "Book Puja", icon: Book, goto: "/booking" },
  { label: "Submit Review", icon: MessageCircle, goto: "#review" },
  { label: "Pandits", icon: Users, goto: "#pandit" },
  { label: "Search", icon: Search, goto: "#highlight" },
  { label: "Bookings", icon: CalendarDays, goto: "#booking" },
  { label: "Logout", icon: LogOut, goto: "/home", logout: true },
];


const sliderImages = [
  "/images/i2.jpeg",
  "/images/kalash.jpeg",
  "/images/havan.jpeg",
  "/images/i3.jpeg",
  "/images/i1.jpeg",
];


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


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expandedPandits, setExpandedPandits] = useState({});
  const [searchPandits, setSearchPandits] = useState("");
  const [searchBookings, setSearchBookings] = useState("");
  const [review, setReview] = useState({ name: "", rating: 0, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatPanditId, setChatPanditId] = useState(null);
  const [chatPanditName, setChatPanditName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");


  const navigate = useNavigate();


  const panditListRef = useRef(null);
  const bookingListRef = useRef(null);


  useEffect(() => {
    AOS.init({ duration: 750, once: true });
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) return;
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setReview((r) => ({ ...r, name: parsedUser.name }));
      getBookings({ userid: parsedUser._id }).then((res) =>
        setBookings(res.data || [])
      );
      getVerifiedPandits().then((res) => setPandits(res.data || []));
    } catch {}
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % sliderImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const itv = setInterval(() => {
      setCurrentDateTime(
        new Date().toLocaleString("en-IN", {
          dateStyle: "full",
          timeStyle: "medium",
          timeZone: "Asia/Kolkata",
        })
      );
    }, 1000);
    return () => clearInterval(itv);
  }, []);


  function toggleExpand(id) {
    setExpandedPandits((prev) => ({ ...prev, [id]: !prev[id] }));
  }


  const getStatusClass = (status) =>
    ({
      accepted: "status accepted",
      rejected: "status rejected",
      pending: "status pending",
    }[(status || "").toLowerCase()] || "status");


  const filteredPandits = pandits.filter(
    (p) =>
      (p.name?.toLowerCase() || "").includes(searchPandits.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(searchPandits.toLowerCase())
  );


  const filteredBookings = bookings.filter((b) => {
    const q = searchBookings.toLowerCase();
    return (
      (b.panditid?.name || "").toLowerCase().includes(q) ||
      (b.serviceid?.name || "").toLowerCase().includes(q) ||
      new Date(b.puja_date).toLocaleDateString().includes(q)
    );
  });


  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!review.name || !review.comment || !review.rating) {
      setReviewMessage("Please complete all fields and provide star rating.");
      return;
    }
    setReviewLoading(true);
    try {
      await createReview(review);
      setReviewMessage("Thank you for your review!");
      setReview((r) => ({ name: r.name, rating: 0, comment: "" }));
    } catch {
      setReviewMessage("Failed to submit review.");
    } finally {
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(""), 2500);
    }
  }


  function handleNavClick(item) {
    if (item.logout) {
      localStorage.clear();
      alert("Logout clicked, implement navigation");
    } else if (String(item.goto).startsWith("#")) {
      const section = document.querySelector(item.goto);
      if (section)
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
    } else {
      navigate(item.goto);
    }
  }


  function scrollList(ref, direction = "left") {
    if (ref.current) {
      const scrollAmount = 320;
      if (direction === "left") {
        ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  }


  return (
    <div className="dashboard-app-bg">
      {/* Sidebar */}
      <aside className={`sidebar-root${collapsed ? " collapsed" : ""}`}>
        <div className="sidebar-brand">
          <img src="/images/subh.png" alt="Logo" className="sidebar-logo" />
          {!collapsed && (
            <span
              className="sidebar-brand-name white-logo"
              tabIndex={0}
              style={{ color: "#1abc9c" }}
            >
              Shubhkarya
            </span>
          )}
        </div>
        <nav className="sidebar-links" aria-label="Main navigation">
          {sidebarLinks.map(({ label, icon: Icon, goto, logout }) => (
            <button
              key={label}
              className="sidebar-link"
              tabIndex={0}
              onClick={() => handleNavClick({ goto, logout })}
              aria-label={label}
            >
              <Icon
                size={22}
                className="sidebar-link-icon"
                aria-hidden="true"
                style={{ color: "#1abc9c" }}
              />
              {!collapsed && (
                <span style={{ color: "#1abc9c", fontWeight: "700" }}>{label}</span>
              )}
            </button>
          ))}
        </nav>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ color: "#1abc9c" }}
        >
          <ListChecks size={22} />
        </button>
      </aside>


      {/* Header */}
      <header className="header-root dark-header">
        <div className="user-block">
          <div>
            <div className="header-user-welcome dark-welcome">
              {user?.name ? `Welcome, ${user.name}!` : "Welcome to Shubhkarya"}
            </div>
            <div className="header-user-email dark-email">
              {user?.email || "user@example.com"}
            </div>
          </div>
        </div>
        <div className="header-datetime dark-datetime">{currentDateTime}</div>
      </header>


      <main className="dashboard-main">
        {/* Hero & Slider */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Experience{" "}
              <span className="hero-highlight">Auspicious Rituals</span> with{" "}
              <span className="hero-brand-white">Shubhkarya</span>
            </h1>
            <p className="hero-subtitle">
              Welcome{user?.name && <span>, <b>{user.name}</b></span>}!
              <br />
              Book trusted Pandits for your{" "}
              <span style={{ color: "#fcd75a", fontWeight: 600 }}>
                pujas, havans, and ceremonies
              </span>{" "}
              with elegance and ease.
              <br />
              Now enhanced with same-day bookings and instant chat support.
            </p>
            <div className="hero-actions">
              <button className="main-cta-btn" onClick={() => navigate("/booking")}>
                Book Puja Now
              </button>
              <button
                className="main-alt-btn"
                onClick={() => {
                  const panditSection = document.querySelector("#pandit");
                  if (panditSection) {
                    panditSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Browse Pandits
              </button>
            </div>
            {/* Removed hero-badges section here as requested */}
          </div>
          <div className="slider-wrapper">
            <div className="carousel-frame hero-slider-bg">
              <img
                src={sliderImages[carouselIndex]}
                alt={`Slide ${carouselIndex + 1}`}
                loading="lazy"
              />
              <div className="carousel-dots">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot${carouselIndex === i ? " active" : ""}`}
                    onClick={() => setCarouselIndex(i)}
                    aria-selected={carouselIndex === i}
                    role="tab"
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="slider-caption">
                <div>
                  Find <span style={{ color: "#fcd75a" }}>expert guidance</span> for every ritual
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Feature Cards */}
        <section className="dashboard-features">
          <div className="feature-card">
            <h3>Live Chat Support</h3>
            <p>Ask spiritual or booking questions to our team – instant help, 7am to 10pm.</p>
          </div>
          <div className="feature-card">
            <h3>Preferred Pandit Booking</h3>
            <p>Save favorite Pandits, see their next available slots, and book with just one tap.</p>
          </div>
          <div className="feature-card">
            <h3>Festive Offers</h3>
            <p>Special discounts and promo codes for all major festivals and family events.</p>
          </div>
        </section>


        {/* Verified Pandits - Horizontal Scroll Carousel */}
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
            {filteredPandits.map((pandit) => (
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
                    aria-label={`Chat with ${pandit.name}`}
                  >
                    Chat with Pandit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Chat Window */}
        <AnimatePresence>
          {chatPanditId && (
            <ChatWindow
              userId={user?._id}
              panditId={chatPanditId}
              chatName={chatPanditName}
              onClose={() => setChatPanditId(null)}
            />
          )}
        </AnimatePresence>


        {/* Bookings - Horizontal Scroll Carousel */}
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


        {/* Review Submission */}
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


        {/* Chatbot Button */}
        <button
          aria-label="Toggle Chatbot"
          className="chatbot-toggle"
          onClick={() => setShowChatbot((s) => !s)}
        >
          {showChatbot ? (
            "×"
          ) : (
            <img
              src="/images/subh.png"
              alt="Open Chatbot"
              style={{ borderRadius: "50%", width: 38, height: 38 }}
            />
          )}
        </button>
        {showChatbot && (
          <div
            className="chatbot-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Chatbot window"
          >
            <iframe
              title="Chatbot"
              src="https://www.chatbase.co/chatbot-iframe/usovl2iS71gPfrO5xmRyP"
              style={{ width: "100%", height: "100%", border: "none", borderRadius: 15 }}
              allow="clipboard-write"
            />
          </div>
        )}
      </main>
    </div>
  );
}
