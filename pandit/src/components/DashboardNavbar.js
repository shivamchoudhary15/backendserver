// src/components/DashboardNavbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './DashboardNavbar.css'; // Create a new CSS file for this navbar

const dashboardNavLinks = [
  { label: "Home", path: "/dashboard/home" },
  { label: "My Profile", path: "/dashboard/profile" },
  { label: "Pooja Services", path: "/dashboard/search-pooja" },
  { label: "Pandits", path: "/dashboard/search-pandits" },
  { label: "Book Puja", path: "/dashboard/booking" },
  { label: "Booking History", path: "/dashboard/booking-history" },
  { label: "Submit Review", path: "/dashboard/reviews" },
  { label: "Payment", path: "/dashboard/payment" },
];

export default function DashboardNavbar() {
  return (
    <nav className="dashboard-navbar" aria-label="Dashboard sections">
      <ul className="dashboard-nav-list">
        {dashboardNavLinks.map((link) => (
          <li key={link.label} className="dashboard-nav-item">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive ? "dashboard-nav-link active-dashboard-nav-link" : "dashboard-nav-link"
              }
              aria-current={({ isActive }) => isActive ? "page" : undefined}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
