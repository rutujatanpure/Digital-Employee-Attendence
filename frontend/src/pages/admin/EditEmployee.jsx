import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      navigate("/admin/employees"); // redirect to employee list after update
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  return (
    <div className="container mt-4">
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

          <button className="btn btn-success mt-3 w-100" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
