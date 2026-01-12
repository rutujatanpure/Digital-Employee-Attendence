import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaIdCard, FaSearch } from "react-icons/fa";
import EmployeeIdCardPopup from "./EmployeeIdCardPopup";

const BASE_URL = "http://localhost:5000";

export default function EmployeeTable() {
  const [emps, setEmps] = useState([]);
  const [filteredEmps, setFilteredEmps] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/employees");
      setEmps(res.data);
      setFilteredEmps(res.data);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = emps.filter((e) => {
      const dob = e.dob ? formatDate(e.dob).toLowerCase() : "";
      return (
        e.employeeId?.toLowerCase().includes(q) ||
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.mobile?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q) ||
        dob.includes(q)
      );
    });
    setFilteredEmps(filtered);
  }, [search, emps]);

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      toast.success("Employee deleted successfully");
      load();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const handleEdit = (id) => navigate(`/admin/edit/${id}`);

  const handleShowIdCard = async (employeeId) => {
    try {
      const res = await API.get(`/public/employees/${employeeId}`);
      setSelectedEmployee(res.data);
      setShowPopup(true);
    } catch {
      toast.error("Failed to load ID Card");
    }
  };

  const formatDate = (dob) => {
    if (!dob) return "-";
    const d = new Date(dob);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER SECTION */}
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1.5rem 0", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
        <div className="container-fluid px-4">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>
              Employees List
            </h1>

            {/* SEARCH BOX */}
            <div style={{ position: "relative", maxWidth: "400px" }}>
              <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.9rem" }} />
              <input
                type="text"
                placeholder="Search by ID, name, role, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-fluid px-4 py-4">
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner-border" role="status" style={{ color: "#667eea", marginBottom: "1rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ color: "#666" }}>Loading employees...</p>
          </div>
        ) : (
          <div style={{
            background: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            overflow: "hidden"
          }}>
            {/* TABLE HEADER INFO */}
            <div style={{
              padding: "1rem 1.5rem",
              background: "#f8f9fa",
              borderBottom: "1px solid #e9ecef",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#666", fontSize: "0.9rem", fontWeight: "500" }}>
                {filteredEmps.length} employee{filteredEmps.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* TABLE WITH SCROLL */}
            <div style={{
              maxHeight: "calc(100vh - 280px)",
              overflowX: "auto",
              overflowY: "auto"
            }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1200px"
              }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Employee ID</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Mobile</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Role</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>DOB</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Photo</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Barcode</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmps.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ padding: "3rem", textAlign: "center", color: "#999" }}>
                        <p style={{ fontSize: "1rem", margin: "0.5rem 0" }}>No employees found</p>
                        <p style={{ fontSize: "0.85rem", margin: 0 }}>Try adjusting your search criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredEmps.map((e, idx) => (
                      <tr
                        key={e.employeeId}
                        style={{
                          borderBottom: "1px solid #e9ecef",
                          transition: "all 0.2s ease",
                          background: idx % 2 === 0 ? "#fff" : "#f8f9fa"
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background = "#f0f4ff";
                          event.currentTarget.style.boxShadow = "inset 0 0 10px rgba(102, 126, 234, 0.05)";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f8f9fa";
                          event.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <td style={{ padding: "1rem", fontSize: "0.9rem", color: "#667eea", fontWeight: "600" }}>
                          {e.employeeId}
                        </td>

                        <td style={{ padding: "1rem", fontSize: "0.9rem", fontWeight: "500", color: "#212529" }}>
                          {e.name}
                        </td>

                        <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#666", maxWidth: "200px", wordBreak: "break-word" }}>
                          {e.email || "-"}
                        </td>

                        <td style={{ padding: "1rem", fontSize: "0.9rem", color: "#666", textAlign: "center" }}>
                          {e.mobile || "-"}
                        </td>

                        <td style={{ padding: "1rem", fontSize: "0.9rem", color: "#666", textAlign: "center", textTransform: "capitalize" }}>
                          {e.role || "-"}
                        </td>

                        <td style={{ padding: "1rem", fontSize: "0.9rem", color: "#666", textAlign: "center" }}>
                          {formatDate(e.dob)}
                        </td>

                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          {e.photo ? (
                            <img
                              src={`${BASE_URL}/${e.photo}`}
                              alt={e.name}
                              width="40"
                              height="40"
                              style={{ borderRadius: "50%", border: "2px solid #e9ecef", objectFit: "cover" }}
                            />
                          ) : (
                            <span style={{ color: "#ccc", fontSize: "0.9rem" }}>-</span>
                          )}
                        </td>

                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          {e.barcode ? (
                            <img
                              src={`${BASE_URL}/${e.barcode}`}
                              alt="barcode"
                              width="70"
                              height="30"
                              style={{ borderRadius: "0.25rem" }}
                            />
                          ) : (
                            <span style={{ color: "#ccc", fontSize: "0.9rem" }}>-</span>
                          )}
                        </td>

                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                            <button
                              onClick={() => handleShowIdCard(e.employeeId)}
                              style={{
                                background: "#e7f1ff",
                                border: "none",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                color: "#667eea",
                                fontSize: "0.9rem",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#667eea";
                                e.target.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "#e7f1ff";
                                e.target.style.color = "#667eea";
                              }}
                              title="View ID Card"
                            >
                              <FaIdCard />
                            </button>

                            <button
                              onClick={() => handleEdit(e.employeeId)}
                              style={{
                                background: "#fff3cd",
                                border: "none",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                color: "#ff9800",
                                fontSize: "0.9rem",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#ff9800";
                                e.target.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "#fff3cd";
                                e.target.style.color = "#ff9800";
                              }}
                              title="Edit Employee"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() => remove(e.employeeId)}
                              style={{
                                background: "#ffe7e7",
                                border: "none",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                color: "#dc3545",
                                fontSize: "0.9rem",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#dc3545";
                                e.target.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "#ffe7e7";
                                e.target.style.color = "#dc3545";
                              }}
                              title="Delete Employee"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showPopup && selectedEmployee && (
        <EmployeeIdCardPopup
          emp={selectedEmployee}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}