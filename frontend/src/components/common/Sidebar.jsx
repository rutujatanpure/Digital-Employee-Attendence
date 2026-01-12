import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaUsers,
  FaCheckSquare,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
  FaLayerGroup,
  FaTimes,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleToggle = () => setMobileOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      if (!mobileView) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Employee List", icon: <FaUsers />, path: "/admin/employees" },
    { label: "Create Employee ID", icon: <FaUserPlus />, path: "/admin/add" },
    { label: "Attendance", icon: <FaCheckSquare />, path: "/admin/attendance" },
    {
      label: "Attendance Report",
      icon: <FaFileAlt />,
      path: "/admin/attendance-report",
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="btn-toggle-mobile"
          onClick={handleToggle}
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 1040,
            background: "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            fontSize: "1.25rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#5568d3";
            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#667eea";
            e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
          }}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: isMobile ? "250px" : "220px",
          background: "#2c3e50",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1030,
          transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
          transition: "transform 0.3s ease",
          overflowY: "auto"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 1rem",
            borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.5rem"
              }}
            >
              <FaLayerGroup />
            </div>
            <span
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "1.1rem"
              }}
            >
              HR Pro
            </span>
          </div>
          {isMobile && (
            <button
              onClick={handleToggle}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "1.25rem",
                cursor: "pointer",
                padding: "0.5rem"
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Menu */}
        <ul
          style={{
            listStyle: "none",
            padding: "1rem 0",
            margin: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Top Menu Items */}
          <div style={{ flex: 1 }}>
            {menuItems.map((item, index) => (
              <li key={index} style={{ margin: "0.5rem 0" }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.875rem 1rem",
                    color: "#fff",
                    textDecoration: "none",
                    borderLeft: isActive ? "4px solid #667eea" : "4px solid transparent",
                    background: isActive ? "rgba(102, 126, 234, 0.1)" : "transparent",
                    transition: "all 0.3s ease",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "600" : "500",
                    cursor: "pointer",
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem",
                    borderRadius: "0 0.5rem 0.5rem 0",
                    paddingLeft: "calc(1rem - 4px)"
                  })}
                  onMouseEnter={(e) => {
                    if (!e.target.closest("a").className.includes("active")) {
                      e.currentTarget.style.background = "rgba(102, 126, 234, 0.05)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.closest("a").className.includes("active")) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </div>

          {/* Bottom Logout */}
          <div style={{ borderTop: "2px solid rgba(255, 255, 255, 0.1)", padding: "1rem 0" }}>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.875rem 1rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  background: "transparent",
                  border: "none",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  margin: "0.5rem 0",
                  marginLeft: "0.5rem",
                  marginRight: "0.5rem",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  borderLeft: "4px solid transparent",
                  paddingLeft: "calc(1rem - 4px)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(220, 53, 69, 0.1)";
                  e.currentTarget.style.color = "#ff6b6b";
                  e.currentTarget.style.borderLeftColor = "#ff6b6b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  e.currentTarget.style.borderLeftColor = "transparent";
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>
                  <FaSignOutAlt />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </div>
        </ul>
      </div>

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleToggle}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1025,
            animation: "fadeIn 0.3s ease-out"
          }}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Custom scrollbar */
        [style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }

        [style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        [style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 3px;
        }

        [style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.5);
        }
      `}</style>
    </>
  );
}

export default Sidebar;