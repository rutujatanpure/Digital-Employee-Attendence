import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import API from "../../services/api";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState({
    employeeId: "",
    name: "",
    photo: "",
    dob: "",
    mobile: "",
    email: "",
    role: "",
    barcode: ""
  });

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadEmployee = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/employees/${id}`);
      setEmp(res.data);
    } catch (err) {
      console.error("Error loading employee:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await API.put(`/employees/${id}`, emp);
      navigate("/admin/employees");
    } catch (err) {
      console.error("Error updating employee:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/employees");
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleCollapsed = () => {
      const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
      setCollapsed(isCollapsed);
    };
    window.addEventListener("storage", handleCollapsed);
    return () => window.removeEventListener("storage", handleCollapsed);
  }, []);

  if (loading) {
    return (
      <div className="d-flex" style={{ height: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden", backgroundColor: "#f5f7fa" }}>
      <Sidebar />

      <div
        className="flex-grow-1 overflow-auto"
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div style={{ padding: isMobile ? "1.5rem 1rem" : "2rem" }}>
          {/* Header Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#0d6efd",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}
              >
                👤
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700", color: "#1a1a1a" }}>
                  Edit Employee
                </h2>
                <p style={{ margin: "0.25rem 0 0 0", color: "#6b7280", fontSize: "0.95rem" }}>
                  Update employee information and credentials
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div
            className="card"
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "12px",
              backgroundColor: "white"
            }}
          >
            <div className="card-body p-4">
              {/* Basic Information Section */}
              <div className="mb-4">
                <h6 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
                  Basic Information
                </h6>

                {/* Employee ID */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Employee ID
                  </label>
                  <input
                    className="form-control"
                    placeholder="Employee ID"
                    value={emp.employeeId}
                    disabled
                    style={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      color: "#9ca3af",
                      cursor: "not-allowed"
                    }}
                  />
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Full Name
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter employee name"
                    value={emp.name}
                    onChange={(e) => setEmp({ ...emp, name: e.target.value })}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Date of Birth */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Date of Birth
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    value={emp.dob}
                    onChange={(e) => setEmp({ ...emp, dob: e.target.value })}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-4">
                <h6 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
                  Contact Information
                </h6>

                {/* Mobile */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Mobile Number
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter mobile number"
                    value={emp.mobile}
                    onChange={(e) => setEmp({ ...emp, mobile: e.target.value })}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Email Address
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter email address"
                    type="email"
                    value={emp.email}
                    onChange={(e) => setEmp({ ...emp, email: e.target.value })}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>

              {/* Work Information Section */}
              <div className="mb-4">
                <h6 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
                  Work Information
                </h6>

                {/* Role */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Job Role
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter job role"
                    value={emp.role}
                    onChange={(e) => setEmp({ ...emp, role: e.target.value })}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="mb-4">
                <h6 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
                  Media & Credentials
                </h6>

                {/* Photo */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Employee Photo
                  </label>
                  {emp.photo && (
                    <div
                      className="mb-2 p-2"
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        display: "inline-block",
                        border: "1px solid #e5e7eb"
                      }}
                    >
                      <img
                        src={`http://localhost:5000/uploads/employees/${emp.photo}`}
                        alt={emp.name}
                        width="80"
                        height="80"
                        style={{ borderRadius: "6px", objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <input
                    className="form-control"
                    placeholder="Photo URL or filename"
                    value={emp.photo}
                    onChange={(e) => setEmp({ ...emp, photo: e.target.value })}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Barcode */}
                <div className="mb-3">
                  <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
                    Barcode
                  </label>
                  {emp.barcode && (
                    <div
                      className="mb-2 p-2"
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        display: "inline-block",
                        border: "1px solid #e5e7eb"
                      }}
                    >
                      <img
                        src={`http://localhost:5000/${emp.barcode}`}
                        alt="Barcode"
                        width="120"
                        height="50"
                        style={{ borderRadius: "6px" }}
                      />
                    </div>
                  )}
                  <input
                    className="form-control"
                    placeholder="Barcode URL or filename"
                    value={emp.barcode}
                    onChange={(e) => setEmp({ ...emp, barcode: e.target.value })}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mt-4 pt-3" style={{ borderTop: "1px solid #e5e7eb" }}>
                <button
                  className="btn flex-grow-1"
                  onClick={handleUpdate}
                  disabled={updating}
                  style={{
                    backgroundColor: "#0d6efd",
                    color: "white",
                    border: "none",
                    padding: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    cursor: updating ? "not-allowed" : "pointer",
                    opacity: updating ? 0.7 : 1,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => !updating && (e.target.style.backgroundColor = "#0b5ed7")}
                  onMouseLeave={(e) => !updating && (e.target.style.backgroundColor = "#0d6efd")}
                >
                  {updating ? "Updating..." : "Update"}
                </button>
                <button
                  className="btn flex-grow-1"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    padding: "0.75rem",
                    fontWeight: "600",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#d1d5db")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}