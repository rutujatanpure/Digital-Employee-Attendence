import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [emp, setEmp] = useState({
    name: "",
    dob: "",
    mobile: "",
    email: "",
    role: "",
    photo: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", emp.name);
    formData.append("dob", emp.dob);
    formData.append("mobile", emp.mobile);
    formData.append("email", emp.email);
    formData.append("role", emp.role);
    if (emp.photo) formData.append("photo", emp.photo);

    try {
      await API.post("/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Redirect to employee list after successful add
      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={emp.name}
            onChange={(e) => setEmp({ ...emp, name: e.target.value })}
            required
          />
        </div>

        {/* Role */}
        <div className="col-md-6">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-control"
            placeholder="Employee Role"
            value={emp.role}
            onChange={(e) => setEmp({ ...emp, role: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email Address"
            value={emp.email}
            onChange={(e) => setEmp({ ...emp, email: e.target.value })}
            required
          />
        </div>

        {/* Mobile */}
        <div className="col-md-6">
          <label className="form-label">Mobile</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Mobile Number"
            value={emp.mobile}
            onChange={(e) => setEmp({ ...emp, mobile: e.target.value })}
            required
          />
        </div>

        {/* DOB */}
        <div className="col-md-6">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={emp.dob}
            onChange={(e) => setEmp({ ...emp, dob: e.target.value })}
          />
        </div>

        {/* Photo Upload */}
        <div className="col-md-6">
          <label className="form-label">Photo</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setEmp({ ...emp, photo: e.target.files[0] })}
            accept="image/*"
            required
          />
        </div>
      </div>

      <button type="submit" className="btn btn-success mt-4 w-100">
        Add Employee
      </button>
    </form>
  );
}
