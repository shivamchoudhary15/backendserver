// src/pages/Dashboard.js
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
  ShoppingCart,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Dashboard.css"; // Main dashboard CSS
import { getBookings, getVerifiedPandits, getPoojas } from "../api/api";
import ChatWindow from "../components/ChatWindow";
import CartModal from "../components/CartModal"; // Import CartModal
import { useNavigate, Outlet, useLocation } from "react-router-dom"; // Added Outlet and useLocation

// Import the new internal Dashboard Navbar
import DashboardNavbar from "../components/DashboardNavbar";

const sidebarLinks = [
  { label: "Home", icon: Home, goto: "/dashboard/home" },
  { label: "Book Puja", icon: Book, goto: "/dashboard/booking" },
  { label: "My Profile", icon: Users, goto: "/dashboard/profile" },
  { label: "Pandits", icon: Users, goto: "/dashboard/search-pandits" },
  { label: "Pooja Services", icon: Search, goto: "/dashboard/search-pooja" },
  { label: "Bookings History", icon: CalendarDays, goto: "/dashboard/booking-history" },
  { label: "Submit Review", icon: MessageCircle, goto: "/dashboard/reviews" },
  { label: "Payment", icon: ShoppingCart, goto: "/dashboard/payment" },
  { label: "Logout", icon: LogOut, goto: "/login", logout: true }, // Logout goes to login page
];

const sliderImages = [
  "/images/i2.jpeg",
  "/images/kalash.jpeg",
  "/images/havan.jpeg",
  "/images/i3.jpeg",
  "/images/i1.jpeg",
];

// StarRating component (kept here as it's small and reusable across dashboard)
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
  const [poojas, setPoojas] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0); // For hero slider, only used in DashboardHome
  const [expandedPandits, setExpandedPandits] = useState({}); // For DashboardSearchPandits
  const [searchPandits, setSearchPandits] = useState(""); // For DashboardSearchPandits
  const [searchBookings, setSearchBookings] = useState(""); // For DashboardBookings
  const [searchPoojas, setSearchPoojas] = useState(""); // For DashboardSearchPooja
  const [review, setReview] = useState({ name: "", rating: 0, comment: "" }); // For DashboardReviews
  const [reviewMessage, setReviewMessage] = useState(""); // For DashboardReviews
  const [reviewLoading, setReviewLoading] = useState(false); // For DashboardReviews
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatPanditId, setChatPanditId] = useState(null);
  const [chatPanditName, setChatPanditName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [cartItems, setCartItems] = useState([]); // Cart state managed globally in Dashboard layout
  const [showCartModal, setShowCartModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // To check current path for navbar active state

  // Refs for horizontal scrolling (will be passed to child components)
  const panditListRef = useRef(null);
  const bookingListRef = useRef(null);
  const poojaListRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 750, once: true });
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setReview((r) => ({ ...r, name: parsedUser.name })); // Initialize review name
      // Fetch all data needed for the dashboard as it's the main layout
      getBookings({ userid: parsedUser._id }).then((res) =>
        setBookings(res.data || [])
      ).catch(err => console.error("Error fetching bookings:", err));
      getVerifiedPandits().then((res) =>
        setPandits(res.data || [])
      ).catch(err => console.error("Error fetching pandits:", err));
      getPoojas().then((res) =>
        setPoojas(res.data || [])
      ).catch(err => console.error("Error fetching poojas:", err));
    } catch (error) {
      console.error("Failed to parse user data or fetch initial data:", error);
      localStorage.clear(); // Clear invalid data
      navigate("/login"); // Redirect to login
    }
  }, [navigate]);

  // Hero slider interval (only relevant for DashboardHome)
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % sliderImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Current date/time update
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

  // Helper functions (passed as props to relevant children)
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

  const filteredPoojas = poojas.filter((pooja) =>
    (pooja.name?.toLowerCase() || "").includes(searchPoojas.toLowerCase()) ||
    (pooja.description?.toLowerCase() || "").includes(searchPoojas.toLowerCase())
  );

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!review.name || !review.comment || !review.rating) {
      setReviewMessage("Please complete all fields and provide star rating.");
      return;
    }
    setReviewLoading(true);
    try {
      // Assuming createReview API is available
      // await createReview(review); // Uncomment when createReview is fully implemented and imported
      console.log("Submitting review:", review); // Placeholder
      setReviewMessage("Thank you for your review!");
      setReview((r) => ({ name: r.name, rating: 0, comment: "" }));
    } catch (error) {
      console.error("Failed to submit review:", error);
      setReviewMessage("Failed to submit review.");
    } finally {
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(""), 2500);
    }
  }

  function handleNavClick(item) {
    if (item.logout) {
      localStorage.clear();
      navigate(item.goto);
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

  const addToCart = (pooja) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === pooja._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === pooja._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...pooja, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (poojaId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== poojaId)
    );
  };

  const updateCartQuantity = (poojaId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === poojaId ? { ...item, quantity: quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

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
              className={`sidebar-link ${location.pathname.startsWith(goto) ? 'active-sidebar-link' : ''}`}
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
        {/* Internal Dashboard Navbar */}
        <DashboardNavbar />

        {/* Outlet for nested routes - this is where sub-page content will be rendered */}
        <Outlet context={{
          user,
          bookings,
          pandits,
          poojas,
          carouselIndex,
          sliderImages,
          expandedPandits,
          searchPandits,
          setSearchPandits, // Pass setter for search input
          searchBookings,
          setSearchBookings, // Pass setter for search input
          searchPoojas,
          setSearchPoojas, // Pass setter for search input
          review, setReview,
          reviewMessage, setReviewMessage,
          reviewLoading, setReviewLoading,
          handleReviewSubmit,
          addToCart, removeFromCart, updateCartQuantity,
          toggleExpand,
          getStatusClass,
          scrollList,
          panditListRef,
          bookingListRef,
          poojaListRef,
          navigate, // Pass navigate for child components
          cartItems, // Pass cartItems to children if needed (e.g., BookingForm, Payment)
          setChatPanditId, setChatPanditName // For chat initiation
        }} />

        {/* Chat Window (remains global to dashboard layout) */}
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

        {/* Floating Cart Icon (remains global to dashboard layout) */}
        {getTotalCartItems() > 0 && (
          <button
            aria-label={`View ${getTotalCartItems()} items in cart`}
            className="floating-cart-btn"
            onClick={() => setShowCartModal(true)}
          >
            <ShoppingCart size={28} />
            <span className="cart-item-count">{getTotalCartItems()}</span>
          </button>
        )}

        {/* Chatbot Button (remains global to dashboard layout) */}
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

        {/* Cart Modal (remains global to dashboard layout) */}
        <AnimatePresence>
          {showCartModal && (
            <CartModal
              cartItems={cartItems}
              onClose={() => setShowCartModal(false)}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
              onCheckout={() => {
                navigate("/dashboard/booking", { state: { cartItems } }); // Pass cart items to booking page
                setShowCartModal(false);
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
