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
    password: "", 
    confirmPassword: "", 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (emp.password || emp.confirmPassword) {
      if (emp.password !== emp.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", emp.name);
    formData.append("dob", emp.dob);
    formData.append("mobile", emp.mobile);
    formData.append("email", emp.email);
    formData.append("role", emp.role);
    if (emp.photo) formData.append("photo", emp.photo);

    // Append password only if entered
    if (emp.password) formData.append("password", emp.password);

    try {
      const res = await API.post("/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show temporary password if backend returned it
      if (res.data.password) {
        alert(`Employee added! Temporary password: ${res.data.password}`);
      } else {
        alert("Employee added successfully!");
      }

      navigate("/admin/employees"); // Redirect to Employee List
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
          <label htmlFor="employee-name" className="form-label">
            Name
          </label>
          <input
            id="employee-name"
            name="name"
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={emp.name}
            onChange={(e) => setEmp({ ...emp, name: e.target.value })}
            required
            autoComplete="name"
          />
        </div>

        {/* Role */}
        <div className="col-md-6">
          <label htmlFor="employee-role" className="form-label">
            Role
          </label>
          <input
            id="employee-role"
            name="role"
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
          <label htmlFor="employee-email" className="form-label">
            Email
          </label>
          <input
            id="employee-email"
            name="email"
            type="email"
            className="form-control"
            placeholder="Email Address"
            value={emp.email}
            onChange={(e) => setEmp({ ...emp, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        {/* Mobile */}
        <div className="col-md-6">
          <label htmlFor="employee-mobile" className="form-label">
            Mobile
          </label>
          <input
            id="employee-mobile"
            name="mobile"
            type="tel"
            className="form-control"
            placeholder="Mobile Number"
            value={emp.mobile}
            onChange={(e) => setEmp({ ...emp, mobile: e.target.value })}
            pattern="[0-9]{10}"
            required
            autoComplete="tel"
          />
        </div>

        {/* Date of Birth */}
        <div className="col-md-6">
          <label htmlFor="employee-dob" className="form-label">
            Date of Birth
          </label>
          <input
            id="employee-dob"
            name="dob"
            type="date"
            className="form-control"
            value={emp.dob}
            onChange={(e) => setEmp({ ...emp, dob: e.target.value })}
            autoComplete="bday"
          />
        </div>

        {/* Photo Upload */}
        <div className="col-md-6">
          <label htmlFor="employee-photo" className="form-label">
            Photo
          </label>
          <input
            id="employee-photo"
            name="photo"
            type="file"
            className="form-control"
            onChange={(e) => setEmp({ ...emp, photo: e.target.files[0] })}
            accept="image/*"
          />
        </div>

        {/* Password */}
        <div className="col-md-6">
          <label htmlFor="employee-password" className="form-label">
            Password
          </label>
          <input
            id="employee-password"
            name="password"
            type="password"
            className="form-control"
            placeholder="Enter password or leave blank for auto"
            value={emp.password}
            onChange={(e) => setEmp({ ...emp, password: e.target.value })}
          />
        </div>

        {/* Confirm Password */}
        <div className="col-md-6">
          <label htmlFor="employee-confirm-password" className="form-label">
            Confirm Password
          </label>
          <input
            id="employee-confirm-password"
            name="confirmPassword"
            type="password"
            className="form-control"
            placeholder="Confirm password"
            value={emp.confirmPassword}
            onChange={(e) => setEmp({ ...emp, confirmPassword: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-success mt-4 w-100">
       Submit
      </button>
    </form>
  );
}
