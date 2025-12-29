import { useState } from "react";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import API from "../../services/api";

export default function AdminAttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

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

  // Generate years dynamically from 2001 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 }, (_, i) => 2001 + i);

  return (
    <>
      {/* Header */}
      <Header title="Admin Dashboard" />

      {/* Layout */}
      <div className="d-flex" style={{ height: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="p-4 w-100 overflow-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Attendance Report</h5>
            </div>

            <div className="card-body">
              {/* Filters */}
              <div className="row g-3 mb-3">
                {/* Month Select */}
                {/* Month Select */}
<div className="col-md-3">
  <select
    id="month"
    name="month"
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

{/* Year Select */}
<div className="col-md-3">
  <select
    id="year"
    name="year"
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


                {/* Generate Button */}
                <div className="col-md-3">
                  <button className="btn btn-primary w-100" onClick={fetchReport}>
                    Generate Report
                  </button>
                </div>
              </div>

              {error && <p className="text-danger">{error}</p>}

              {/* Report Table */}
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Employee ID</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No records found
                      </td>
                    </tr>
                  )}

                  {attendance.map((a, i) => (
                    <tr key={i}>
                      <td>{new Date(a.date).toLocaleDateString()}</td>
                      <td>{a.employeeId}</td>
                      <td>
                        {a.inTime ? new Date(a.inTime).toLocaleTimeString() : "-"}
                      </td>
                      <td>
                        {a.outTime ? new Date(a.outTime).toLocaleTimeString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
