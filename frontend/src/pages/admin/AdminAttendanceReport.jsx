import { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import API from "../../services/api";

export default function AdminAttendanceReport() {
  const [reportData, setReportData] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [dayNames, setDayNames] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    leave: 0,
  });

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // -------------------- FETCH REPORT --------------------
  const fetchReport = async () => {
    if (!month || !year) {
      setError("Please select month and year");
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(
        `/attendance/report?month=${month}&year=${year}`
      );

      const report = res.data.report || [];
      setReportData(report);

      const numDays = res.data.daysInMonth || 0;
      setDaysInMonth(numDays);
      setError("");

      // Day names
      const dayShorts = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const firstDay = new Date(year, month - 1, 1).getDay();
      setDayNames(
        Array.from({ length: numDays }, (_, i) => dayShorts[(firstDay + i) % 7])
      );

      // -------- TODAY BASED SUMMARY --------
      const today = new Date();
      const todayDay = today.getDate();
      const todayMonth = today.getMonth() + 1;
      const todayYear = today.getFullYear();

      let present = 0;
      let absent = 0;
      let leave = 0;

      if (Number(month) === todayMonth && Number(year) === todayYear) {
        report.forEach((emp) => {
          const status = emp.attendance?.[todayDay];

          if (status === "P") present++;
          else if (status === "L") leave++;
          else absent++;
        });
      }

      setSummary({
        totalEmployees: report.length,
        present,
        absent,
        leave,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance report");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleCollapsed = () =>
      setCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
    window.addEventListener("storage", handleCollapsed);
    return () => window.removeEventListener("storage", handleCollapsed);
  }, []);

  // -------------------- HELPERS --------------------
  const renderStatus = (status, day) => {
    const today = new Date();
    const cellDate = new Date(year, month - 1, day);

    if (cellDate > today) return <span style={{ color: "#adb5bd" }}>—</span>;
    if (status === "P")
      return (
        <span
          style={{
            color: "#28a745",
            fontWeight: "700",
            fontSize: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            backgroundColor: "#d4edda",
            borderRadius: "4px",
          }}
        >
          ✓
        </span>
      );
    if (status === "L")
      return (
        <span
          style={{
            color: "#ffc107",
            fontWeight: "700",
            fontSize: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            backgroundColor: "#fff3cd",
            borderRadius: "4px",
          }}
        >
          ●
        </span>
      );
    return (
      <span
        style={{
          color: "#dc3545",
          fontWeight: "700",
          fontSize: "16px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          backgroundColor: "#f8d7da",
          borderRadius: "4px",
        }}
      >
        ✕
      </span>
    );
  };

  const getPresentDays = (attendance) =>
    attendance
      ? Object.entries(attendance).filter(
          ([day, s]) => s === "P" && new Date(year, month - 1, day) <= new Date()
        ).length
      : 0;

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `${API_URL.replace(/\/$/, "")}/${photo.replace(/^\//, "")}`;
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 2000 + 1 },
    (_, i) => 2000 + i
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // -------------------- JSX --------------------
  return (
    <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f5f7fa" }}>
      <Sidebar />

      <div
        className="flex-grow-1 overflow-auto"
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 60 : 220,
          padding: isMobile ? "16px" : "24px 32px",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1d29", marginBottom: "4px" }}>
            Attendance Report
          </h2>
          <p style={{ fontSize: "14px", color: "#6c757d", margin: 0 }}>
            Monitor and manage employee attendance across all departments
          </p>
        </div>

        {/* FILTER SECTION */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px 24px",
            borderRadius: "12px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr auto",
            gap: "16px",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#495057", display: "block", marginBottom: "8px" }}>
              Month
            </label>
            <select
              className="form-select form-select-sm"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e3e8",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <option value="">Select Month</option>
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#495057", display: "block", marginBottom: "8px" }}>
              Year
            </label>
            <select
              className="form-select form-select-sm"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e3e8",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div style={{ visibility: isMobile ? "visible" : "visible" }}>
            <button
              className="btn w-100"
              onClick={fetchReport}
              disabled={loading}
              style={{
                padding: "10px 24px",
                backgroundColor: loading ? "#ccc" : "#0d6efd",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
            >
              {loading ? "Loading..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Employees", value: summary.totalEmployees, icon: "👥", color: "#0d6efd" },
            { label: "Present", value: summary.present, icon: "✓", color: "#28a745" },
            { label: "Absent", value: summary.absent, icon: "✕", color: "#dc3545" },
            { label: "Leave", value: summary.leave, icon: "●", color: "#ffc107" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#6c757d", fontWeight: "500", margin: 0, marginBottom: "8px" }}>
                    {stat.label}
                  </p>
                  <h3 style={{ fontSize: "28px", fontWeight: "700", color: stat.color, margin: 0 }}>
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ⚠️ {error}
          </div>
        )}
         {/* ATTENDANCE LEGEND */}
<div
  style={{
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "12px",
    padding: "12px 16px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    fontSize: "13px",
    fontWeight: "600",
    color: "#495057",
    flexWrap: "wrap",
  }}
>
  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span
      style={{
        width: "16px",
        height: "16px",
        backgroundColor: "#d4edda",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#28a745",
        fontWeight: "700",
      }}
    >
      ✓
    </span>
    Present
  </span>

  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span
      style={{
        width: "16px",
        height: "16px",
        backgroundColor: "#f8d7da",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#dc3545",
        fontWeight: "700",
      }}
    >
      ✕
    </span>
    Absent
  </span>

  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span
      style={{
        width: "16px",
        height: "16px",
        backgroundColor: "#fff3cd",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffc107",
        fontWeight: "700",
      }}
    >
      ●
    </span>
    Leave
  </span>
</div>

        {/* TABLE */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 400px)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 12px",
                      fontWeight: "700",
                      color: "#495057",
                      minWidth: "280px",
                      position: "sticky",
                      left: 0,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Employee
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "12px 6px",
                        fontWeight: "700",
                        color: "#495057",
                        minWidth: "45px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "13px" }}>{i + 1}</div>
                      <div style={{ fontSize: "10px", color: "#adb5bd", fontWeight: "500", marginTop: "2px" }}>
                        {dayNames[i]}
                      </div>
                    </th>
                  ))}
                  <th
                    style={{
                      padding: "16px 12px",
                      fontWeight: "700",
                      color: "#495057",
                      minWidth: "80px",
                      textAlign: "center",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={daysInMonth + 2}
                      style={{
                        padding: "48px 16px",
                        textAlign: "center",
                        color: "#adb5bd",
                        fontSize: "14px",
                      }}
                    >
                      {loading ? "Loading attendance data..." : "Select month and year to view attendance report"}
                    </td>
                  </tr>
                ) : (
                  reportData.map((emp, i) => {
                    const photoUrl = getPhotoUrl(emp.photo);
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid #e9ecef",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td
                          style={{
                            padding: "14px 12px",
                            textAlign: "left",
                            position: "sticky",
                            left: 0,
                            backgroundColor: "white",
                            fontWeight: "500",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={emp.name}
                                width={36}
                                height={36}
                                style={{
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2px solid #e9ecef",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: "50%",
                                  backgroundColor: "#0d6efd",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                }}
                              >
                                {emp.name?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: "700", color: "#1a1d29", fontSize: "14px" }}>
                                {emp.name}
                              </div>
                              <div style={{ fontSize: "12px", color: "#adb5bd", marginTop: "2px" }}>
                                {emp.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {Array.from({ length: daysInMonth }, (_, d) => (
                          <td key={d} style={{ padding: "12px 6px", textAlign: "center" }}>
                            {renderStatus(emp.attendance?.[d + 1], d + 1)}
                          </td>
                        ))}

                        <td
                          style={{
                            padding: "14px 12px",
                            fontWeight: "700",
                            color: "#28a745",
                            textAlign: "center",
                            fontSize: "14px",
                          }}
                        >
                          {getPresentDays(emp.attendance)}/{daysInMonth}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}