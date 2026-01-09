import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { FiSearch } from "react-icons/fi";

// Month names for display (MOVED OUTSIDE COMPONENT)
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

  // Fetch attendance data
  useEffect(() => {
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
      .catch(() => setError("Failed to load attendance"));
  }, []);

  // Filter attendance based on search term and selected year
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

  // Listen to window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to sidebar collapsed state
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

  const tableStyles = {
    headerRow: { display: "table", width: "100%", tableLayout: "fixed" },
    headerCell: {
      position: "sticky",
      top: 0,
      backgroundColor: "#f8f9fa",
      fontWeight: 600,
      padding: "1rem",
      width: "16.66%",
      minWidth: "140px"
    },
    dataRow: {
      display: "table",
      width: "100%",
      tableLayout: "fixed",
      borderBottom: "1px solid #e9ecef"
    },
    dataCell: {
      padding: "1rem",
      width: "16.66%",
      minWidth: "140px"
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar />

      <div
        className="flex-grow-1 overflow-hidden p-4"
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <h5 className="fw-bold mb-1">Attendance Records</h5>
        <p className="text-muted mb-3">
          Maintain and monitor attendance data
        </p>

        <div className="d-flex justify-content-between mb-3">
          <div className="position-relative">
            <input
              className="form-control form-control-sm ps-5"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            />
          </div>

          <select
            className="form-select form-select-sm"
            style={{ width: "140px" }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="border h-100 overflow-hidden">
          {error && <div className="alert alert-danger">{error}</div>}

          <table className="table mb-0">
            <thead>
              <tr style={tableStyles.headerRow}>
                {["Employee ID", "Date", "In Time", "Out Time", "Total Hours", "Status"]
                  .map(h => (
                    <th key={h} style={tableStyles.headerCell}>{h}</th>
                  ))}
              </tr>
            </thead>

            <tbody style={{ display: "block", overflowY: "auto", height: "65vh" }}>
              {filteredAttendance.map((a, i) => {
                const totalHours = () => {
                  if (!a.inTime || !a.outTime) return "-";
                  const diff = new Date(a.outTime) - new Date(a.inTime);
                  return `${Math.floor(diff / 3600000)}h ${Math.floor(
                    (diff % 3600000) / 60000
                  )}m`;
                };

                return (
                  <tr key={i} style={tableStyles.dataRow}>
                    <td style={tableStyles.dataCell}>{a.employeeId}</td>
                    <td style={tableStyles.dataCell}>{formatDate(a.date)}</td>
                    <td style={tableStyles.dataCell}>{formatTime(a.inTime)}</td>
                    <td style={tableStyles.dataCell}>{formatTime(a.outTime)}</td>
                    <td style={tableStyles.dataCell}>{totalHours()}</td>
                    <td style={tableStyles.dataCell}>
                      {a.outTime ? "Completed" : "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
