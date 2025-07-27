import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Settings,
  PlusCircle,
  MinusCircle,
  Bell,
  Lock,
  Star, // Import Star icon for dynamic star ratings
  Clock, // For event time
  MapPin, // For event location
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Dashboard.css";
import { createReview, getBookings, getVerifiedPandits } from "../api/api";
import ChatWindow from "./ChatWindow";
import { useNavigate, useLocation } from "react-router-dom";

// --- Configuration Data ---
const mainSidebarLinks = [
  { label: "Home", icon: Home, goto: "/" },
  { label: "Book Puja", icon: Book, goto: "/booking" },
  { label: "Submit Review", icon: MessageCircle, goto: "#review" },
  { label: "Pandits", icon: Users, goto: "#pandit" },
  { label: "Search", icon: Search, goto: "#highlight" }, // Changed to highlight for dynamic content
  { label: "Bookings", icon: CalendarDays, goto: "#booking" },
  { label: "Logout", icon: LogOut, goto: "/home", logout: true },
];

const settingsSubLinks = [
  { label: "Profile", icon: Users, goto: "/profile" },
  { label: "Notifications", icon: Bell, goto: "/notifications" },
  { label: "Privacy", icon: Lock, goto: "/privacy" },
];

const sliderImages = [
  "/images/i2.jpeg",
  "/images/kalash.jpeg",
  "/images/havan.jpeg",
  "/images/i3.jpeg",
  "/images/i1.jpeg",
];

// Upcoming Festivals sample data (more detailed with dynamic content)
const upcomingFestivals = [
  {
    name: "Diwali",
    date: "November 4, 2025",
    description: "Festival of Lights celebrating victory of good over evil. Involves Lakshmi Puja and fireworks.",
    img: "/images/diwali.jpg",
    location: "Pan India",
    time: "Evening",
  },
  {
    name: "Holi",
    date: "March 14, 2026",
    description: "Festival of Colors marking arrival of spring and joy. Celebrated with bonfires and vibrant colors.",
    img: "/images/holi.jpg",
    location: "Pan India",
    time: "Day",
  },
  {
    name: "Navratri",
    date: "October 10 - 18, 2025",
    description: "Nine nights dedicated to Goddess Durga with fasting, prayers, and traditional dances (Garba, Dandiya).",
    img: "/images/navratri.jpg",
    location: "Pan India",
    time: "Evening",
  },
  {
    name: "Maha Shivaratri",
    date: "February 26, 2026",
    description: "A major Hindu festival celebrating the Maha Shivaratri. Devotees observe fasts and offer prayers to Shiva.",
    img: "/images/shivaratri.jpg",
    location: "Pan India",
    time: "Night",
  },
  {
    name: "Janmashtami",
    date: "August 16, 2026",
    description: "Celebrates the birth of Lord Krishna. Devotees fast, sing bhajans, and decorate temples.",
    img: "/images/janmashtami.jpg",
    location: "Pan India",
    time: "Midnight",
  },
];


// --- StarRating Component (re-usable) ---
function StarRating({ rating, onChange, editable = true }) {
  return (
    <div className="star-rating" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          role={editable ? "button" : "img"} // Role changes based on editability
          tabIndex={editable ? "0" : "-1"}
          className={`star ${i <= rating ? "active" : ""}`}
          aria-label={editable ? `Rate ${i} star${i > 1 ? "s" : ""}` : `Rated ${i} star${i > 1 ? "s" : ""}`}
          onClick={() => editable && onChange(i)}
          onKeyDown={(e) => editable && (e.key === "Enter" || e.key === " ") && onChange(i)}
        >
          {i <= rating ? <Star fill="#ffc107" strokeWidth={0} size={20} /> : <Star color="#ccc" strokeWidth={1} size={20} />}
        </span>
      ))}
    </div>
  );
}

// --- Dashboard Component ---
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
  const [activeLink, setActiveLink] = useState("/");
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // New state for scroll to top button

  const navigate = useNavigate();
  const location = useLocation();

  const panditListRef = useRef(null);
  const bookingListRef = useRef(null);
  const mainContentRef = useRef(null); // Ref for main content area to detect scroll

  // --- Initial Data Load & AOS Animation ---
  useEffect(() => {
    AOS.init({ duration: 750, once: true, offset: 50 }); // Adjusted offset for better trigger
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/home"); // Redirect to home if not authenticated
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setReview((r) => ({ ...r, name: parsedUser.name }));

      // Fetch bookings and pandits concurrently for faster loading
      Promise.all([
        getBookings({ userid: parsedUser._id }),
        getVerifiedPandits(),
      ]).then(([bookingsRes, panditsRes]) => {
        setBookings(bookingsRes.data || []);
        setPandits(panditsRes.data || []);
      }).catch(error => {
        console.error("Failed to fetch dashboard data:", error);
        // Optionally show a user-friendly error message
      });

    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      localStorage.clear(); // Clear invalid data
      navigate("/home");
    }
  }, [navigate]);

  // --- Active Link Tracking ---
  useEffect(() => {
    setActiveLink(location.pathname || "/");
  }, [location.pathname]);

  // --- Carousel Auto-Play ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % sliderImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // --- Current Date & Time Display ---
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

  // --- Scroll-to-Top Button Logic ---
  const handleScroll = useCallback(() => {
    if (mainContentRef.current) {
      if (mainContentRef.current.scrollTop > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    }
  }, []);

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
      return () => mainContent.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- Pandit Card Expansion ---
  function toggleExpand(id) {
    setExpandedPandits((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // --- Horizontal Scroll for lists ---
  function scrollList(ref, direction = "left") {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.7; // Scroll by 70% of visible width
      if (direction === "left") {
        ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  }

  // --- Filtered Data (Pandits & Bookings) ---
  const filteredPandits = pandits.filter(
    (p) =>
      (p.name?.toLowerCase() || "").includes(searchPandits.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(searchPandits.toLowerCase()) ||
      (p.specialties?.some(s => s.toLowerCase().includes(searchPandits.toLowerCase())) || false) // Search by specialty
  );

  const filteredBookings = bookings.filter((b) => {
    const q = searchBookings.toLowerCase();
    return (
      (b.panditid?.name || "").toLowerCase().includes(q) ||
      (b.serviceid?.name || "").toLowerCase().includes(q) ||
      new Date(b.puja_date).toLocaleDateString().includes(q) ||
      (b.location || "").toLowerCase().includes(q) || // Search by location
      (b.status || "").toLowerCase().includes(q) // Search by status
    );
  });

  // --- Review Submission Handler ---
  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!review.name || !review.comment || review.rating === 0) {
      setReviewMessage("Please complete all fields and provide a star rating.");
      return;
    }
    setReviewLoading(true);
    try {
      await createReview(review);
      setReviewMessage("Thank you for your review!");
      setReview((r) => ({ name: r.name, rating: 0, comment: "" })); // Reset form, keep name
    } catch (error) {
      console.error("Review submission failed:", error);
      setReviewMessage("Failed to submit review. Please try again later.");
    } finally {
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(""), 3000); // Clear message after 3 seconds
    }
  }

  // --- Sidebar Navigation Handler ---
  function handleNavClick(item) {
    if (item.logout) {
      localStorage.clear();
      navigate("/home");
    } else if (String(item.goto).startsWith("#")) {
      // Smooth scroll to section
      const section = document.querySelector(item.goto);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        setActiveLink(item.goto);
      }
    } else {
      navigate(item.goto);
      setActiveLink(item.goto);
    }
  }

  // --- Booking Status Class Helper ---
  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "accepted":
        return "status accepted";
      case "rejected":
        return "status rejected";
      case "pending":
        return "status pending";
      case "completed": // New status for completed bookings
        return "status completed";
      case "cancelled": // New status for cancelled bookings
        return "status cancelled";
      default:
        return "status";
    }
  };

  // --- Framer Motion Variants ---
  const heroVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const btnHoverTap = {
    hover: { scale: 1.05, boxShadow: "0 6px 20px rgba(255, 113, 0, 0.6)" },
    tap: { scale: 0.95 },
  };
  const sidebarTransition = { type: "tween", duration: 0.3 };

  return (
    <div
      className="dashboard-app-bg"
      style={{
        background: "linear-gradient(123deg, #ff7100, #1f1700)",
        transition: "background 0.5s ease-in-out",
      }}
    >
      {/* Sidebar */}
      <motion.aside
        className={`sidebar-root${collapsed ? " collapsed" : ""}`}
        initial={false}
        animate={{ width: collapsed ? 60 : 240 }}
        transition={sidebarTransition}
        aria-label="Main navigation sidebar"
      >
        <div className="sidebar-brand" tabIndex={0} role="banner">
          <img src="/images/subh.png" alt="Shubhkarya Logo" className="sidebar-logo" />
          {!collapsed && (
            <span className="sidebar-brand-name white-logo" style={{ color: "#1abc9c" }}>
              Shubhkarya
            </span>
          )}
        </div>
        <nav className="sidebar-links" aria-label="Main navigation links">
          {mainSidebarLinks.map(({ label, icon: Icon, goto, logout }) => (
            <motion.button
              key={label}
              className={`sidebar-link ${
                (activeLink === goto || (activeLink === "/" && goto === "/")) ? "active" : ""
              }`}
              tabIndex={0}
              onClick={() => handleNavClick({ goto, logout })}
              aria-label={label}
              aria-current={activeLink === goto ? "page" : false}
              title={collapsed ? label : undefined}
              whileHover={{ scale: 1.1, boxShadow: "0 6px 20px rgba(255, 113, 0, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                size={22}
                className="sidebar-link-icon"
                aria-hidden="true"
                style={{ color: "#1abc9c" }}
              />
              {!collapsed && <span>{label}</span>}
            </motion.button>
          ))}

          {/* Settings expandable menu */}
          <div className="sidebar-setting-group">
            <motion.button
              className={`sidebar-link settings-link ${settingsExpanded ? "expanded" : ""}`}
              onClick={() => setSettingsExpanded((v) => !v)}
              aria-expanded={settingsExpanded}
              aria-controls="settings-submenu"
              tabIndex={0}
              title={collapsed ? "Settings" : undefined}
              whileHover={{ scale: 1.1, boxShadow: "0 6px 20px rgba(255, 113, 0, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={22} aria-hidden="true" style={{ color: "#1abc9c" }} />
              {!collapsed && <span>Settings</span>}
              {!collapsed && (
                <span className="settings-toggle-icon">
                  {settingsExpanded ? <MinusCircle size={18} /> : <PlusCircle size={18} />}
                </span>
              )}
            </motion.button>
            <AnimatePresence initial={false}>
              {settingsExpanded && !collapsed && (
                <motion.div
                  id="settings-submenu"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} // Softer animation
                  className="sidebar-submenu"
                >
                  {settingsSubLinks.map(({ label, icon: Icon, goto }) => (
                    <motion.button
                      key={label}
                      className={`sidebar-link sub-link ${
                        activeLink === goto ? "active" : ""
                      }`}
                      onClick={() => handleNavClick({ goto })}
                      tabIndex={0}
                      aria-current={activeLink === goto ? "page" : false}
                      title={label}
                      whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(100,255,218,0.4)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={18} aria-hidden="true" style={{ color: "#64ffda" }} />
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
        <motion.button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          style={{ color: "#1abc9c" }}
          whileHover={{ scale: 1.15, boxShadow: "0 8px 24px rgba(28, 212, 151, 0.6)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ListChecks size={22} />
        </motion.button>
      </motion.aside>

      {/* Header */}
      <header className="header-root dark-header" role="banner">
        <div className="user-block">
          <div>
            <div className="header-user-welcome dark-welcome">
              {user?.name ? `Welcome, ${user.name}!` : "Welcome to Shubhkarya"}
            </div>
            <div className="header-user-email dark-email">{user?.email || "user@example.com"}</div>
          </div>
        </div>
        <div className="header-datetime dark-datetime" aria-live="polite">{currentDateTime}</div>
      </header>

      <main className="dashboard-main" tabIndex={-1} ref={mainContentRef}>
        {/* Hero & Slider */}
        <section className="hero-section" aria-labelledby="hero-title">
          <motion.div
            className="hero-content"
            initial="initial"
            animate="animate"
            variants={heroVariants}
          >
            <h1 id="hero-title" className="hero-title">
              Experience{" "}
              <span className="hero-highlight">Auspicious Rituals</span> with{" "}
              <span className="hero-brand-white">Shubhkarya</span>
            </h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Welcome{user?.name && <span>, <b>{user.name}</b></span>}!
              <br />
              Book trusted Pandits for your{" "}
              <span style={{ color: "#fcd75a", fontWeight: 600 }}>
                pujas, havans, and ceremonies
              </span>{" "}
              with elegance and ease.
              <br />
              Now enhanced with same-day bookings and instant chat support.
            </motion.p>
            <div className="hero-actions">
              <motion.button
                className="main-cta-btn"
                onClick={() => navigate("/booking")}
                whileHover="hover"
                whileTap="tap"
                variants={btnHoverTap}
                style={{
                  background: "linear-gradient(123deg, #ff7100, #1f1700)",
                  color: "#fff",
                  border: "none",
                  fontWeight: "700",
                }}
                aria-label="Book Puja Now"
              >
                Book Puja Now
              </motion.button>
            </div>
          </motion.div>
          <div className="slider-wrapper" aria-live="polite" aria-atomic="true">
            <div className="carousel-frame hero-slider-bg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={carouselIndex}
                  src={sliderImages[carouselIndex]}
                  alt={`Religious ritual imagery - Slide ${carouselIndex + 1}`}
                  loading="eager" // Eager loading for main hero image
                  initial={{ opacity: 0.7, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ borderRadius: 12 }}
                />
              </AnimatePresence>
              <div className="carousel-dots" role="tablist" aria-label="Image Carousel Pagination">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot${carouselIndex === i ? " active" : ""}`}
                    onClick={() => setCarouselIndex(i)}
                    aria-selected={carouselIndex === i}
                    role="tab"
                    aria-label={`Go to slide ${i + 1}`}
                    tabIndex={0}
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

        {/* Upcoming Festivals & Events */}
        <section className="upcoming-festivals-section" aria-label="Upcoming festivals and events" id="highlight">
          <h3 className="section-heading highlighted-heading">Upcoming Festivals & Events</h3>
          <div className="festival-cards-responsive-container">
            {upcomingFestivals.map(({ name, date, description, img, location, time }) => (
              <motion.div
                key={name}
                className="festival-card"
                tabIndex={0}
                initial={{ y: 18, opacity: 0.85 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.06, boxShadow: "0 12px 40px #ff710077" }}
                whileFocus={{ scale: 1.06, boxShadow: "0 12px 40px #ff71007f" }}
                viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of item is in view
                transition={{ type: "spring", stiffness: 180, damping: 19 }}
                aria-label={`${name} festival details`}
                role="article"
              >
                <div className="festival-img-wrapper">
                  <img
                    src={img}
                    alt={`${name} festival`}
                    className="festival-img"
                    loading="lazy"
                  />
                </div>
                <div className="festival-info">
                  <h4>{name}</h4>
                  <p className="festival-date"><CalendarDays size={16} /> {date}</p>
                  <p className="festival-desc">{description}</p>
                  <div className="festival-meta">
                    <span className="festival-location"><MapPin size={16} /> {location}</span>
                    <span className="festival-time"><Clock size={16} /> {time}</span>
                  </div>
                  <motion.button
                    className="festival-learn-more-btn"
                    onClick={() => navigate(`/festival/${name.toLowerCase().replace(/\s/g, '-')}`)} // Dynamic routing for festival details
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Learn more about ${name}`}
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Verified Pandits */}
        <section
          id="pandit"
          className="pandit-section horizontal-carousel-section"
          tabIndex={-1}
          aria-label="Verified Pandits section"
        >
          <div className="section-header">
            <h3 className="section-heading highlighted-heading">Verified Pandits</h3>
            <div className="carousel-controls">
              <button
                aria-label="Scroll pandits left"
                onClick={() => scrollList(panditListRef, "left")}
                className="carousel-arrow-btn"
                tabIndex={0}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Scroll pandits right"
                onClick={() => scrollList(panditListRef, "right")}
                className="carousel-arrow-btn"
                tabIndex={0}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <input
            type="text"
            className="booking-search search-input-glow"
            aria-label="Search pandits by name, city, or specialty"
            placeholder="Search by name, city, or specialty..."
            value={searchPandits}
            onChange={(e) => setSearchPandits(e.target.value)}
          />
          <div className="pandit-list horizontal-scroll" ref={panditListRef} tabIndex={0} role="list">
            {filteredPandits.length === 0 ? (
              <p className="empty-msg">No pandits found matching your search.</p>
            ) : (
              filteredPandits.map((pandit) => (
                <motion.div
                  key={pandit._id}
                  className="improved-pandit-card neon-card glass-highlight glossy shadow-pop horizontal-card"
                  whileHover={{ y: -4, scale: 1.04, boxShadow: "0 6px 24px #ff710099" }}
                  tabIndex={0}
                  role="listitem"
                  aria-expanded={expandedPandits[pandit._id] || false}
                  onClick={() => toggleExpand(pandit._id)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && toggleExpand(pandit._id)
                  }
                >
                  <div
                    className="pandit-avatar glass"
                    style={{
                      backgroundImage: `url(${pandit.profile_photo_url || "/images/placeholder_pandit.jpg"})`, // Placeholder image
                    }}
                    aria-label={`Profile photo of Pandit ${pandit.name}`}
                  >
                    {!pandit.profile_photo_url && (
                      <span className="pandit-avatar-initial">{pandit.name.slice(0, 1)}</span>
                    )}
                  </div>
                  <div className="pandit-main-info">
                    <h4 className="pandit-name hero-text-glow">🧑‍🦳 {pandit.name}</h4>
                    <div className="pandit-city"><MapPin size={16} /> {pandit.city}</div>
                    {pandit.averageRating && (
                      <div className="pandit-rating">
                        <StarRating rating={pandit.averageRating} editable={false} />
                        <span className="rating-value">({pandit.averageRating.toFixed(1)})</span>
                      </div>
                    )}
                    <AnimatePresence>
                      {expandedPandits[pandit._id] && (
                        <motion.div
                          className="pandit-extra expanded horizontal-extra"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
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
                              <b>Specialties:</b> {pandit.specialties?.join(", ") || "N/A"}
                            </div>
                            <p className="pandit-bio">{pandit.bio || "No detailed bio available."}</p> {/* Added bio */}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.button
                      className="chat-pandit-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card expansion
                        setChatPanditId(pandit._id);
                        setChatPanditName(pandit.name);
                        setShowChatbot(true); // Automatically open chatbot
                      }}
                      style={{ marginTop: 8 }}
                      aria-label={`Chat with ${pandit.name}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Chat with Pandit <MessageCircle size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Chat Window */}
        <AnimatePresence>
          {chatPanditId && showChatbot && ( // Ensure chatbot is visible if pandit is selected
            <ChatWindow
              userId={user?._id}
              panditId={chatPanditId}
              chatName={chatPanditName}
              onClose={() => { setChatPanditId(null); setShowChatbot(false); }}
            />
          )}
        </AnimatePresence>

        {/* Booking History Section */}
        <section
          id="booking"
          className="bookings-section horizontal-carousel-section blur-bg"
          tabIndex={-1}
          aria-label="Booking History section"
        >
          <div className="section-header">
            <h3 className="section-heading highlighted-heading">Your Bookings</h3>
            <div className="carousel-controls">
              <button
                aria-label="Scroll bookings left"
                onClick={() => scrollList(bookingListRef, "left")}
                className="carousel-arrow-btn"
                tabIndex={0}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Scroll bookings right"
                onClick={() => scrollList(bookingListRef, "right")}
                className="carousel-arrow-btn"
                tabIndex={0}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <input
            type="text"
            className="booking-search search-input-glow"
            aria-label="Search bookings by pandit, service, date, location, or status"
            placeholder="Search bookings by pandit, service, date, location or status..."
            value={searchBookings}
            onChange={(e) => setSearchBookings(e.target.value)}
          />
          <div className="booking-list horizontal-scroll" ref={bookingListRef} tabIndex={0} role="list">
            {filteredBookings.length === 0 ? (
              <p className="empty-msg">No bookings found. Book your first puja now!</p>
            ) : (
              filteredBookings.map((b) => (
                <motion.div
                  key={b._id}
                  className="booking-card card-glossy glass neon-card shadow-pop horizontal-card"
                  whileHover={{ scale: 1.032, boxShadow: "0 6px 32px #aecaee51" }}
                  tabIndex={0}
                  role="listitem"
                  aria-label={`Booking for ${b.serviceid?.name} with ${
                    b.panditid?.name || "N/A"
                  } on ${new Date(b.puja_date).toLocaleDateString()} at ${b.puja_time}. Status: ${b.status}`}
                >
                  <div className="booking-card-left">
                    <span className="booking-icon" aria-hidden="true">
                      ✨
                    </span> {/* Changed icon for visual appeal */}
                    <div>
                      <div className="booking-type">
                        <Book size={18} style={{ verticalAlign: "middle", marginRight: 5 }} />
                        {b.serviceid?.name || "N/A Puja Service"}
                      </div>
                      <div className="booking-date">
                        <CalendarDays size={18} style={{ verticalAlign: "middle", marginRight: 5 }} />
                        {new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}
                      </div>
                    </div>
                  </div>
                  <div className="booking-card-right">
                    <div className="booking-pandit">
                      <Users size={18} style={{ verticalAlign: "middle", marginRight: 5 }} />
                      <span className="booking-pandit-label">Pandit:</span>{" "}
                      <span>{b.panditid?.name ?? "N/A"}</span>
                    </div>
                    <div className="booking-location">
                      <MapPin size={18} style={{ verticalAlign: "middle", marginRight: 5 }} />
                      {b.location}
                    </div>
                    <div className={getStatusClass(b.status)}>{b.status}</div>
                    {b.status?.toLowerCase() === 'completed' && b.panditid && (
                      <motion.button
                        className="review-booking-btn"
                        onClick={() => {
                          setReview({ ...review, panditId: b.panditid._id });
                          const reviewSection = document.querySelector("#review");
                          if (reviewSection) reviewSection.scrollIntoView({ behavior: "smooth" });
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Review your booking with ${b.panditid.name}`}
                      >
                        Review this booking
                      </motion.button>
                    )}
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
          aria-label="Submit Review section"
        >
          <h3 className="section-heading neon-text">Submit a Review</h3>
          {reviewMessage && (
            <motion.p
              className={
                reviewMessage.includes("review") ? "success-message" : "error-message"
              }
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              role="alert"
            >
              {reviewMessage}
            </motion.p>
          )}
          <form
            onSubmit={handleReviewSubmit}
            className="review-form card-glossy glass nice-glass"
            aria-label="Review submission form"
          >
            <div className="review-row">
              <input
                type="text"
                value={user?.name || review.name} // Ensure user's name is pre-filled
                disabled // Name should not be editable by the user for a review
                className="review-input"
                aria-label="Your name (disabled)"
                title="Your name is pre-filled from your profile."
              />
              <StarRating
                rating={review.rating}
                onChange={(v) => setReview((prev) => ({ ...prev, rating: v }))}
                editable={true}
              />
            </div>
            <textarea
              placeholder="Share your experience with us..." // More engaging placeholder
              value={review.comment}
              onChange={(e) =>
                setReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="review-input review-textarea"
              required
              aria-required="true"
              rows={4} // Give more space for typing
              maxLength={500} // Add character limit
              aria-label="Your feedback or comment about the service"
            />
            <motion.button
              type="submit"
              className="custom-btn glow-btn"
              disabled={reviewLoading}
              whileHover={{ scale: 1.05, boxShadow: "0 6px 25px #ff7100bb" }}
              whileTap={{ scale: 0.95 }}
              aria-live="polite" // Announce changes to screen readers
            >
              {reviewLoading ? "Submitting Review..." : "Submit Review 💬"}
            </motion.button>
          </form>
        </section>

        {/* Chatbot Button */}
        <motion.button
          aria-label={showChatbot ? "Close Chatbot" : "Open Chatbot"}
          className="chatbot-toggle"
          onClick={() => setShowChatbot((s) => !s)}
          whileHover={{ scale: 1.1, boxShadow: "0 8px 38px rgba(38, 82, 132, 0.25)" }}
          whileTap={{ scale: 0.9 }}
          data-aos="fade-up" // AOS animation for the button itself
          data-aos-anchor-placement="bottom-bottom" // Appear when scrolling to bottom
        >
          {showChatbot ? (
            "×"
          ) : (
            <img
              src="/images/subh.png"
              alt="Shubhkarya Chatbot Icon"
              style={{ borderRadius: "50%", width: 38, height: 38 }}
            />
          )}
        </motion.button>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              className="scroll-to-top-btn"
              onClick={scrollToTop}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
              aria-label="Scroll to top"
            >
              <ChevronUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}