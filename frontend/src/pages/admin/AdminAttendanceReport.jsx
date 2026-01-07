import { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import API from "../../services/api";

export default function AdminAttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchReport = () => {
    if (!month || !year) {
      setError("Please select month and year");
      return;
    }
    setError("");

    API.get(`/attendance/report?month=${month}&year=${year}`)
      .then((res) => setAttendance(res.data))
      .catch(() => setError("Failed to load attendance report"));
  };

  // Generate years dynamically
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 }, (_, i) => 2001 + i);

  // Download CSV
  const downloadCSV = () => {
    if (!attendance.length) return;

    const headers = ["Employee ID", "Date", "In Time", "Out Time"];
    const rows = attendance.map((a) => {
      const dateStr = new Date(a.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      const inTimeStr = a.inTime ? new Date(a.inTime).toLocaleTimeString() : "-";
      const outTimeStr = a.outTime ? new Date(a.outTime).toLocaleTimeString() : "-";
      return [a.employeeId, dateStr, inTimeStr, outTimeStr];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      encodedUri
    );
    link.setAttribute(
      "download",
      `Attendance_Report_${month || "AllMonths"}_${year || "AllYears"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sidebar collapse state
  useEffect(() => {
    const handleCollapsed = () => {
      const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
      setCollapsed(isCollapsed);
    };
    window.addEventListener("storage", handleCollapsed);
    return () => window.removeEventListener("storage", handleCollapsed);
  }, []);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div
        className="flex-grow-1 overflow-auto p-3 p-md-4"
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s ease",
          height: "100vh",
        }}
      >
        {/* Filters */}
        <div className="row g-2 mb-3 align-items-center">
          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <button
              className="btn btn-primary w-100"
              style={{ height: "38px", fontSize: "0.875rem" }}
              onClick={fetchReport}
            >
              Generate
            </button>
          </div>
        </div>

        {error && <p className="text-danger">{error}</p>}

        {/* Table */}
        <div className="table-responsive flex-grow-1 mb-2">
          <table className="table table-bordered table-hover table-sm mb-0 text-center">
            <thead className="table-light sticky-top">
              <tr>
                <th>Employee ID</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No records found
                  </td>
                </tr>
              ) : (
                attendance.map((a, i) => (
                  <tr key={i}>
                    <td>{a.employeeId}</td>
                    <td>
                      {new Date(a.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {a.inTime
                        ? new Date(a.inTime).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td>
                      {a.outTime
                        ? new Date(a.outTime).toLocaleTimeString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Download Button */}
        {attendance.length > 0 && (
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-success"
              style={{ height: "38px", fontSize: "0.875rem" }}
              onClick={downloadCSV}
            >
              Download Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
