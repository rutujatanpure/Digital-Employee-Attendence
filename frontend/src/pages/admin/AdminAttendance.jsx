import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [search, setSearch] = useState("");
  const [yearSearch, setYearSearch] = useState("");

  // Fetch attendance data
  useEffect(() => {
    API.get("/attendance")
      .then((res) => setAttendance(res.data))
      .catch(() => setError("Failed to load attendance"));
  }, []);

  // Listen to window resize for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to sidebar collapsed state
  useEffect(() => {
    const handleCollapsed = () => {
      const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
      setCollapsed(isCollapsed);
    };
    window.addEventListener("storage", handleCollapsed);
    return () => window.removeEventListener("storage", handleCollapsed);
  }, []);

  // Filtered attendance based on search + year
  const filteredAttendance = attendance.filter((a) => {
    const lowerSearch = search.toLowerCase();
    const formattedDate = new Date(a.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const inTimeStr = a.inTime ? new Date(a.inTime).toLocaleTimeString() : "";
    const outTimeStr = a.outTime ? new Date(a.outTime).toLocaleTimeString() : "";

    const matchesSearch =
      !search.trim() ||
      a.employeeId.toString().includes(lowerSearch) ||
      formattedDate.toLowerCase().includes(lowerSearch) ||
      inTimeStr.toLowerCase().includes(lowerSearch) ||
      outTimeStr.toLowerCase().includes(lowerSearch);

    const matchesYear =
      !yearSearch.trim() || new Date(a.date).getFullYear().toString().includes(yearSearch);

    return matchesSearch && matchesYear;
  });

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div
        className="flex-grow-1 overflow-auto p-4"
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s ease",
          height: "100vh",
        }}
      >
        {/* Header */}
        <h5 className="mb-3">Attendance Records</h5>

        {/* Display error if any */}
        {error && <p className="text-danger mb-2">{error}</p>}

        {/* Top Controls: Left search + Right year filter */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            style={{ width: "250px" }}
            placeholder="Search Employee, date or time..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            className="form-control"
            style={{ width: "100px" }}
            placeholder="Year..."
            value={yearSearch}
            onChange={(e) => setYearSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-responsive h-100">
          <table className="table table-bordered table-hover text-center table-sm mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Employee ID</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Saved Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No attendance found
                  </td>
                </tr>
              )}
              {filteredAttendance.map((a, i) => {
                const formattedDate = new Date(a.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });
                return (
                  <tr key={i}>
                    <td>{a.employeeId}</td>
                    <td>{formattedDate}</td>
                    <td>{a.inTime ? new Date(a.inTime).toLocaleTimeString() : "-"}</td>
                    <td>{a.outTime ? new Date(a.outTime).toLocaleTimeString() : "-"}</td>
                    <td>
                      {a.outTime ? (
                        <span className="badge bg-success">Attendance Saved Successfully</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
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
