import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsers,
  FaCheckSquare,
  FaFileAlt,
  FaSignOutAlt,
  FaBars
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleToggle = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  // Responsive: auto collapse on small screens
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    // Collapse if width < 768px
    if (windowWidth < 768) setCollapsed(true);
    else setCollapsed(false);

    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
    { label: "Create Employee ID", icon: <FaUserPlus />, path: "/admin/add" },
    { label: "Employee List", icon: <FaUsers />, path: "/admin/employees" },
    { label: "Attendance", icon: <FaCheckSquare />, path: "/admin/attendance" },
    { label: "Attendance Report", icon: <FaFileAlt />, path: "/admin/attendance-report" }
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="btn-toggle" onClick={handleToggle}>
          <FaBars />
        </button>
        {!collapsed && <h3 className="sidebar-title">Admin Menu</h3>}
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className="sidebar-link">
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          </li>
        ))}

        {/* Logout */}
        <li>
          <button
            onClick={handleLogout}
            className="sidebar-link logout-btn"
          >
            <span className="sidebar-icon"><FaSignOutAlt /></span>
            {!collapsed && "Logout"}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
