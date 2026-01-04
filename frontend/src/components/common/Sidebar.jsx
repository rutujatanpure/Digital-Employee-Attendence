import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
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
  const [collapsed, setCollapsed] = useState(false); // Collapsed/Expanded sidebar state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detecting mobile responsiveness

  const handleToggle = () => {
    setCollapsed((prev) => !prev); // Toggle collapse or expand
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  // Handle screen resizing (auto-collapse on mobile)
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);

      if (!mobileView) setCollapsed(false); // Expand sidebar automatically on desktop
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
    { label: "Create Employee ID", icon: <FaUserPlus />, path: "/admin/add" },
    { label: "Employee List", icon: <FaUsers />, path: "/admin/employees" },
    { label: "Attendance", icon: <FaCheckSquare />, path: "/admin/attendance" },
    { label: "Attendance Report", icon: <FaFileAlt />, path: "/admin/attendance-report" },
  ];

  return (
    <div
      className={`sidebar ${collapsed && isMobile ? "collapsed-mobile" : ""} ${
        collapsed ? "collapsed" : ""
      }`}
      role="navigation"
      aria-label={isMobile ? "Mobile Sidebar" : "Desktop Sidebar"}
    >
      <div className="sidebar-header">
        <button
          className="btn-toggle"
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>
        {!collapsed && <h3 className="sidebar-title">Admin Menu</h3>}
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            <Link
              to={item.path}
              className="sidebar-link"
              title={collapsed ? item.label : ""} // Tooltip in collapsed mode
            >
              <span className="sidebar-icon">{item.icon}</span>
              {/* Display label fully */}
              <span className={`sidebar-label ${collapsed ? "hidden-label" : ""}`}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}

        {/* Logout */}
        <li>
          <button
            onClick={handleLogout}
            className="sidebar-link logout-btn"
            aria-label="Logout"
            title={collapsed ? "Logout" : ""} // Tooltip when collapsed
          >
            <span className="sidebar-icon">
              <FaSignOutAlt />
            </span>
            <span className={`sidebar-label ${collapsed ? "hidden-label" : ""}`}>
              Logout
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;