import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaEnvelope, FaPhone, FaCalendar, FaImage } from "react-icons/fa";

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
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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

    if (emp.password || emp.confirmPassword) {
      if (emp.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      if (emp.password !== emp.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmp({ ...emp, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      setLoading(true);
      await API.post("/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Employee added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error adding employee";
      toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "2rem 0" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container" style={{ maxWidth: "900px" }}>
        {/* FORM CARD */}
        <div style={{
          background: "#fff",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          padding: "2.5rem"
        }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Name */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaUser style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Full Name <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter employee name"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: errors.name ? "2px solid #dc3545" : "1px solid #dee2e6",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                  value={emp.name}
                  onChange={(e) => setEmp({ ...emp, name: e.target.value })}
                  onFocus={(e) => !errors.name && (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? "#dc3545" : "#dee2e6";
                  }}
                />
                {errors.name && (
                  <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaUser style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Role <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Developer, Manager, Designer"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: errors.role ? "2px solid #dc3545" : "1px solid #dee2e6",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                  value={emp.role}
                  onChange={(e) => setEmp({ ...emp, role: e.target.value })}
                  onFocus={(e) => !errors.role && (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.role ? "#dc3545" : "#dee2e6";
                  }}
                />
                {errors.role && (
                  <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {errors.role}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaEnvelope style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Email <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="employee@example.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: errors.email ? "2px solid #dc3545" : "1px solid #dee2e6",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                  value={emp.email}
                  onChange={(e) => setEmp({ ...emp, email: e.target.value })}
                  onFocus={(e) => !errors.email && (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? "#dc3545" : "#dee2e6";
                  }}
                />
                {errors.email && (
                  <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaPhone style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Mobile <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <PhoneInput
                    country="in"
                    countryCodeEditable={false}
                    enableSearch={true}
                    value={emp.mobile}
                    onChange={(phone) => setEmp({ ...emp, mobile: `+${phone}` })}
                    containerClass="w-100"
                    inputStyle={{
                      width: "100%",
                      height: "45px",
                      padding: "0.75rem 0.75rem 0.75rem 50px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      border: errors.mobile ? "2px solid #dc3545" : "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      outline: "none",
                      transition: "all 0.3s ease"
                    }}
                    buttonStyle={{ border: "none", height: "45px", background: "transparent" }}
                    dropdownStyle={{ maxHeight: "200px" }}
                  />
                </div>
                {errors.mobile && (
                  <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {errors.mobile}
                  </div>
                )}
              </div>

              {/* DOB */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaCalendar style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Date of Birth <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: errors.dob ? "2px solid #dc3545" : "1px solid #dee2e6",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                  value={emp.dob}
                  onChange={(e) => setEmp({ ...emp, dob: e.target.value })}
                  onFocus={(e) => !errors.dob && (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.dob ? "#dc3545" : "#dee2e6";
                  }}
                />
                {errors.dob && (
                  <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {errors.dob}
                  </div>
                )}
              </div>

              {/* Photo */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaImage style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Profile Photo
                </label>
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start"
                }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: errors.photo ? "2px solid #dc3545" : "1px solid #dee2e6",
                        borderRadius: "0.5rem",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    />
                    {errors.photo && (
                      <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                        {errors.photo}
                      </div>
                    )}
                    <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem", margin: 0 }}>
                      JPG or PNG, max 2MB
                    </p>
                  </div>
                  {photoPreview && (
                    <div style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      border: "2px solid #dee2e6",
                      flexShrink: 0
                    }}>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaLock style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Leave empty for auto-generated password"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      paddingRight: "2.5rem",
                      border: errors.password ? "2px solid #dc3545" : "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    value={emp.password}
                    onChange={(e) => setEmp({ ...emp, password: e.target.value })}
                    onFocus={(e) => !errors.password && (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password ? "#dc3545" : "#dee2e6";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#667eea",
                      fontSize: "1rem",
                      padding: "0.5rem"
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="col-md-6">
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaLock style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      paddingRight: "2.5rem",
                      border: errors.confirmPassword ? "2px solid #dc3545" : "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                    value={emp.confirmPassword}
                    onChange={(e) => setEmp({ ...emp, confirmPassword: e.target.value })}
                    onFocus={(e) => !errors.confirmPassword && (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.confirmPassword ? "#dc3545" : "#dee2e6";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#667eea",
                      fontSize: "1rem",
                      padding: "0.5rem"
                    }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div style={{ color: "#dc3545", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid #e9ecef"
            }}>
              <button
                type="button"
                onClick={() => navigate("/admin/employees")}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #dee2e6",
                  background: "#fff",
                  color: "#666",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  outline: "none"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f8f9fa";
                  e.target.style.borderColor = "#bbb";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#fff";
                  e.target.style.borderColor = "#dee2e6";
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.75rem 2rem",
                  background: loading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)"
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? "Submitting..." : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}