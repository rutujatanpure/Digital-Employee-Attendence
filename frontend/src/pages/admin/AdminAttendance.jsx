import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { FiSearch } from "react-icons/fi";
import { FaCalendar, FaClock, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/attendance")
      .then((res) => {
        const data = res.data;
        setAttendance(data);
        setFilteredAttendance(data);

        const uniqueYears = [
          ...new Set(
            data.map(item => new Date(item.date).getFullYear())
          )
        ].sort((a, b) => b - a);

        setYears(uniqueYears);
      })
      .catch(() => setError("Failed to load attendance"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = attendance;

    if (selectedYear !== "All") {
      filtered = filtered.filter(item => {
        const d = new Date(item.date);
        return d.getFullYear() === parseInt(selectedYear);
      });
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const d = new Date(item.date);
        const monthName = monthNames[d.getMonth()];
        const day = d.getDate().toString();

        return (
          item.employeeId.toLowerCase().includes(term) ||
          monthName.toLowerCase().includes(term) ||
          day.includes(term) ||
          (item.inTime && item.inTime.toLowerCase().includes(term)) ||
          (item.outTime && item.outTime.toLowerCase().includes(term))
        );
      });
    }

    setFilteredAttendance(filtered);
  }, [searchTerm, selectedYear, attendance]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleCollapsed = () => {
      const isCollapsed =
        localStorage.getItem("sidebar-collapsed") === "true";
      setCollapsed(isCollapsed);
    };
    window.addEventListener("storage", handleCollapsed);
    return () => window.removeEventListener("storage", handleCollapsed);
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
  };

  const getStatusColor = (status) => {
    return status === "Completed" 
      ? { bg: "#e7f5e9", color: "#27ae60", icon: <FaCheckCircle /> } 
      : { bg: "#fff3cd", color: "#f39c12", icon: <FaHourglassHalf /> };
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar />

      <div
        className="flex-grow-1 overflow-hidden"
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s ease",
          background: "#f8f9fa"
        }}
      >
        <div style={{ padding: "2rem", height: "100%", display: "flex", flexDirection: "column" }}>
          {/* HEADER SECTION */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ color: "#212529", fontSize: "1.75rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
              Attendance Records
            </h1>
            <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>
              Monitor and manage employee attendance data
            </p>
          </div>

          {/* FILTER SECTION */}
          <div style={{
            background: "#fff",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center"
          }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
              <FiSearch
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                  fontSize: "1rem"
                }}
              />
              <input
                type="text"
                placeholder="Search by ID, date, time..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Year Filter */}
            <div style={{ minWidth: "150px" }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#212529",
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: "#fff",
                  cursor: "pointer"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="All">All Years</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Result Counter */}
            <div style={{
              fontSize: "0.9rem",
              color: "#666",
              fontWeight: "500"
            }}>
              {filteredAttendance.length} record{filteredAttendance.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* TABLE SECTION */}
          <div style={{
            background: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            {error && (
              <div style={{
                padding: "1rem",
                background: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb",
                borderRadius: "0.5rem",
                margin: "1rem"
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div className="spinner-border" style={{ color: "#667eea", marginBottom: "1rem" }}></div>
                  <p style={{ color: "#666" }}>Loading attendance data...</p>
                </div>
              </div>
            ) : filteredAttendance.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                <div style={{ textAlign: "center" }}>
                  <FaCalendar style={{ fontSize: "2.5rem", color: "#ccc", marginBottom: "1rem" }} />
                  <p style={{ color: "#999", fontSize: "1rem" }}>No attendance records found</p>
                </div>
              </div>
            ) : (
              <div style={{ overflowY: "auto", flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
                  <thead>
                    <tr style={{
                      background: "#f8f9fa",
                      borderBottom: "2px solid #e9ecef",
                      position: "sticky",
                      top: 0,
                      zIndex: 10
                    }}>
                      {["Employee ID", "Date", "In Time", "Out Time", "Total Hours", "Status"].map((h, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: "1rem",
                            textAlign: "left",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            color: "#495057",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            width: idx === 0 ? "15%" : "17%",
                            minWidth: "120px"
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((a, i) => {
                      const totalHours = () => {
                        if (!a.inTime || !a.outTime) return "-";
                        const diff = new Date(a.outTime) - new Date(a.inTime);
                        return `${Math.floor(diff / 3600000)}h ${Math.floor(
                          (diff % 3600000) / 60000
                        )}m`;
                      };

                      const status = a.outTime ? "Completed" : "Pending";
                      const statusStyle = getStatusColor(status);

                      return (
                        <tr
                          key={i}
                          style={{
                            borderBottom: "1px solid #e9ecef",
                            transition: "all 0.2s ease",
                            background: i % 2 === 0 ? "#fff" : "#f8f9fa"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f0f4ff";
                            e.currentTarget.style.boxShadow = "inset 0 0 10px rgba(102, 126, 234, 0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f8f9fa";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <td style={{ padding: "1rem", color: "#667eea", fontWeight: "600" }}>
                            {a.employeeId}
                          </td>
                          <td style={{ padding: "1rem", color: "#212529", fontSize: "0.9rem" }}>
                            <FaCalendar style={{ marginRight: "0.5rem", color: "#999", fontSize: "0.8rem" }} />
                            {formatDate(a.date)}
                          </td>
                          <td style={{ padding: "1rem", color: "#212529", fontSize: "0.9rem" }}>
                            <FaClock style={{ marginRight: "0.5rem", color: "#27ae60", fontSize: "0.8rem" }} />
                            {formatTime(a.inTime)}
                          </td>
                          <td style={{ padding: "1rem", color: "#212529", fontSize: "0.9rem" }}>
                            <FaClock style={{ marginRight: "0.5rem", color: "#e74c3c", fontSize: "0.8rem" }} />
                            {formatTime(a.outTime)}
                          </td>
                          <td style={{ padding: "1rem", color: "#212529", fontWeight: "500" }}>
                            {totalHours()}
                          </td>
                          <td style={{ padding: "1rem" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              padding: "0.5rem 1rem",
                              borderRadius: "0.5rem",
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              fontSize: "0.85rem",
                              fontWeight: "600"
                            }}>
                              {statusStyle.icon}
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}