import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import API from "../../services/api";
import "./AdminAttendance.css";

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/attendance")
      .then((res) => setAttendance(res.data))
      .catch(() => setError("Failed to load attendance"));
  }, []);

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
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Attendance Records</h5>
            </div>

            <div className="card-body">
              {error && <p className="text-danger">{error}</p>}

              {/* Wrap the table with a responsive container */}
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Year</th>
                      <th>Month</th>
                      <th>Day</th>
                      <th>Employee ID</th>
                      <th>In Time</th>
                      <th>Out Time</th>
                      <th>Saved Attendance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No attendance found
                        </td>
                      </tr>
                    )}

                    {attendance.map((a, i) => {
                      const d = new Date(a.date);

                      return (
                        <tr key={i}>
                          <td>{d.getFullYear()}</td>
                          <td>{d.getMonth() + 1}</td>
                          <td>{d.getDate()}</td>
                          <td>{a.employeeId}</td>

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

                          <td>
                            {a.outTime ? (
                              <span className="badge bg-success">
                                Attendance Saved Successfully
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                Pending
                              </span>
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
        </div>
      </div>
    </>
  );
}