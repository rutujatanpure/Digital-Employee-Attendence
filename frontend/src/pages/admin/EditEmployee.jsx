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

  // ✅ useCallback to fix ESLint warning
  const loadEmployee = useCallback(async () => {
    try {
      const res = await API.get(`/employees/${id}`);
      setEmp(res.data);
    } catch (err) {
      console.error("Error loading employee:", err);
    }
  }, [id]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const handleUpdate = async () => {
    try {
      await API.put(`/employees/${id}`, emp);
      navigate("/admin/employees"); // redirect after update
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/employees"); // redirect on cancel
  };

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for sidebar collapse state
  useEffect(() => {
    const handleCollapsed = () => {
      const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
      setCollapsed(isCollapsed);
    };
    window.addEventListener("storage", handleCollapsed);
    return () => window.removeEventListener("storage", handleCollapsed);
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="flex-grow-1 overflow-auto p-3 p-md-4"
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div
          className="card shadow-sm mx-auto"
          style={{ maxWidth: "600px", backgroundColor: "#f8f9fa" }}
        >
          <div className="card-body">
            <h5 className="card-title mb-3">Edit Employee</h5>

            {/* Employee ID */}
            <input
              className="form-control mb-2"
              placeholder="Employee ID"
              value={emp.employeeId}
              disabled
            />

            {/* Name */}
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={emp.name}
              onChange={(e) => setEmp({ ...emp, name: e.target.value })}
            />

            {/* Photo */}
            <div className="mb-2">
              <label className="form-label">Photo</label>
              {emp.photo && (
                <div className="mb-1">
                  <img
                    src={`http://localhost:5000/uploads/employees/${emp.photo}`}
                    alt={emp.name}
                    width="80"
                    height="80"
                    className="rounded"
                  />
                </div>
              )}
              <input
                className="form-control"
                placeholder="Photo URL"
                value={emp.photo}
                onChange={(e) => setEmp({ ...emp, photo: e.target.value })}
              />
            </div>

            {/* DOB */}
            <input
              className="form-control mb-2"
              type="date"
              placeholder="DOB"
              value={emp.dob}
              onChange={(e) => setEmp({ ...emp, dob: e.target.value })}
            />

            {/* Mobile */}
            <input
              className="form-control mb-2"
              placeholder="Mobile"
              value={emp.mobile}
              onChange={(e) => setEmp({ ...emp, mobile: e.target.value })}
            />

            {/* Email */}
            <input
              className="form-control mb-2"
              placeholder="Email"
              type="email"
              value={emp.email}
              onChange={(e) => setEmp({ ...emp, email: e.target.value })}
            />

            {/* Role */}
            <input
              className="form-control mb-2"
              placeholder="Role"
              value={emp.role}
              onChange={(e) => setEmp({ ...emp, role: e.target.value })}
            />

            {/* Barcode */}
            <div className="mb-2">
              <label className="form-label">Barcode</label>
              {emp.barcode && (
                <div className="mb-1">
                  <img
                    src={`http://localhost:5000/${emp.barcode}`}
                    alt="Barcode"
                    width="120"
                    height="50"
                  />
                </div>
              )}
              <input
                className="form-control"
                placeholder="Barcode URL"
                value={emp.barcode}
                onChange={(e) => setEmp({ ...emp, barcode: e.target.value })}
              />
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-success flex-grow-1"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="btn btn-secondary flex-grow-1"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
