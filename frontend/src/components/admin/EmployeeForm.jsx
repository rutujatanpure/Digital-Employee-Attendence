import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const generatePassword = (length = 8) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const validate = () => {
    const newErrors = {};

    if (!emp.name.trim()) newErrors.name = "Name is required";
    if (!emp.role.trim()) newErrors.role = "Role is required";

    if (!emp.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email))
      newErrors.email = "Invalid email format";

    if (!emp.mobile) newErrors.mobile = "Mobile number is required";
    else if (emp.mobile.replace(/\D/g, "").length < 10)
      newErrors.mobile = "Mobile number is too short";

    if (!emp.dob) newErrors.dob = "Date of Birth is required";
    else if (calculateAge(emp.dob) < 16)
      newErrors.dob = "Employee must be at least 16 years old";

    // Only validate if user enters password
    if (emp.password || emp.confirmPassword) {
      if (emp.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      if (emp.password !== emp.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    // Optional: validate file size (< 2MB) and type
    if (emp.photo) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(emp.photo.type))
        newErrors.photo = "Invalid file type. Only JPG/PNG allowed";
      if (emp.photo.size > 2 * 1024 * 1024)
        newErrors.photo = "File too large. Max 2MB allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const passwordToUse = emp.password || generatePassword(8);

    const formData = new FormData();
    formData.append("name", emp.name);
    formData.append("dob", emp.dob);
    formData.append("mobile", emp.mobile); 
    formData.append("email", emp.email);
    formData.append("role", emp.role);
    if (emp.photo) formData.append("photo", emp.photo);
    formData.append("password", passwordToUse);

    try {
      await API.post("/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Employee added successfully!");
      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error adding employee";
      alert(msg);
    }
  };

  return (
    <div className="card shadow p-4 w-100">
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Name */}
          <div className="col-md-6">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={emp.name}
              onChange={(e) => setEmp({ ...emp, name: e.target.value })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Role */}
          <div className="col-md-6">
            <label className="form-label">Role *</label>
            <input
              type="text"
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
              value={emp.role}
              onChange={(e) => setEmp({ ...emp, role: e.target.value })}
            />
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={emp.email}
              onChange={(e) => setEmp({ ...emp, email: e.target.value })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          {/* Mobile */}
      <div className="col-md-6">
        <label className="form-label">Mobile *</label>
            <PhoneInput
             country="in"
           countryCodeEditable={false}
          enableSearch={true}
        value={emp.mobile}
       onChange={(phone) =>
      setEmp({ ...emp, mobile: `+${phone}` })
    }
    containerClass="w-100"
    inputClass={errors.mobile ? "is-invalid" : ""}
    inputStyle={{
      width: "100%",
      height: "45px",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      boxSizing: "border-box",
    }}
    buttonStyle={{
      border: "1px solid #ced4da",
      height: "38px",
    }}
    dropdownStyle={{ maxHeight: "200px" }}
  />
  {errors.mobile && (
    <div className="invalid-feedback d-block">
      {errors.mobile}
    </div>
  )}
</div>

          {/* DOB */}
          <div className="col-md-6">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              value={emp.dob}
              onChange={(e) => setEmp({ ...emp, dob: e.target.value })}
            />
            {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
          </div>

          {/* Photo */}
          <div className="col-md-6">
            <label className="form-label">Photo</label>
            <input
              type="file"
              className={`form-control ${errors.photo ? "is-invalid" : ""}`}
              accept="image/*"
              onChange={(e) => setEmp({ ...emp, photo: e.target.files[0] })}
            />
            {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
          </div>

          {/* Password */}
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={emp.password}
                onChange={(e) =>
                  setEmp({ ...emp, password: e.target.value })
                }
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                value={emp.confirmPassword}
                onChange={(e) =>
                  setEmp({ ...emp, confirmPassword: e.target.value })
                }
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary btn-sm fw-bold" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
