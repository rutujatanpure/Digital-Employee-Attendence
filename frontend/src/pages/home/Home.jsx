import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Home.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empId, setEmpId] = useState("");
  const navigate = useNavigate();

  // ADMIN LOGIN
  const adminLogin = async () => {
    try {
      const res = await API.post("/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch {
      alert("Invalid Admin Credentials");
    }
  };

  // EMPLOYEE LOGIN
  const employeeLogin = () => {
    if (!empId) return alert("Employee ID is required");
    navigate(`/employee/${empId}`);
  };

  return (
    <div className="home-bg">
      <div className="container">
        <div className="row justify-content-center align-items-center">

          {/* EMPLOYEE CARD */}
          <div className="col-md-5 mb-4">
            <div className="card login-card shadow">
              <div className="card-body p-4">
                <h4 className="text-center fw-bold mb-3">
                  Employee Login
                </h4>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Employee ID
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter your Employee ID"
                    onChange={(e) => setEmpId(e.target.value)}
                  />
                  <small className="text-muted">
                    * Required: Fill Employee ID to continue
                  </small>
                </div>

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={employeeLogin}
                >
                  Login as Employee
                </button>
              </div>
            </div>
          </div>

          {/* ADMIN CARD */}
          <div className="col-md-5 mb-4">
            <div className="card login-card shadow">
              <div className="card-body p-4">
                <h4 className="text-center fw-bold mb-3">
                  Admin Login
                </h4>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter admin email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <small className="text-muted">
                    * Required: Valid admin email
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <small className="text-muted">
                    * Required: Admin password
                  </small>
                </div>

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={adminLogin}
                >
                  Login as Admin
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER TEXT */}
        <p className="text-center text-muted mt-4 small">
          Digital Employee ID System • Secure • Paperless • Fast
        </p>
      </div>
    </div>
  );
}
