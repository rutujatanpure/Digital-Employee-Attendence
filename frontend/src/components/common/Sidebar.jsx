import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaUsers,
  FaCheckSquare,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      if (!mobileView) setMobileOpen(false); // desktop always open
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Employee List", icon: <FaUsers />, path: "/admin/employees" },
    { label: "Create Employee ID", icon: <FaUserPlus />, path: "/admin/add" },
    { label: "Attendance", icon: <FaCheckSquare />, path: "/admin/attendance" },
    { label: "Attendance Report", icon: <FaFileAlt />, path: "/admin/attendance-report" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button className="btn-toggle-mobile" onClick={handleToggle}>
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${
          isMobile ? (mobileOpen ? "open-mobile" : "closed-mobile") : ""
        }`}
      >
        <div className="sidebar-header">
          <span className="sidebar-title">Admin Menu</span>
        </div>

        <ul className="sidebar-menu">
          <div className="menu-top">
            {menuItems.map((item, index) => (
              <li key={index} className="sidebar-item">
                <Link to={item.path} className="sidebar-link">
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </div>

          <div className="menu-bottom">
            <li>
              <button onClick={handleLogout} className="sidebar-link logout-btn">
                <span className="sidebar-icon">
                  <FaSignOutAlt />
                </span>
                <span className="sidebar-label">Logout</span>
              </button>
            </li>
          </div>
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && <div className="sidebar-overlay" onClick={handleToggle} />}
    </>
  );
}

export default Sidebar;
