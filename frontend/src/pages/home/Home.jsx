import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import loginImage from "../../assets/images/empd.png";
import "./Home.css";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userId || !password) {
      alert("Please enter User ID and Password");
      return;
    }

    setLoading(true);

    try {
      if (userId.includes("@")) {
        const res = await API.post("/admin/login", {
          email: userId.trim(),
          password,
        });

        localStorage.setItem("token", res.data.token);
        navigate("/admin/employees");
      } else {
        const employeeId = userId.trim().toUpperCase();

        const res = await API.post("/employees/login", {
          employeeId,
          password,
        });

        localStorage.setItem("employeeToken", res.data.token);
        navigate(`/employee/${employeeId}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="card login-wrapper shadow-lg">
              <div className="row g-0">

                {/* IMAGE */}
                <div className="col-12 col-md-6 order-1 order-md-2 d-flex align-items-center justify-content-center bg-light">
                  <img
                    src={loginImage}
                    alt="Login"
                    className="img-fluid login-image"
                  />
                </div>

                {/* LOGIN FORM */}
                <div className="col-12 col-md-6 order-2 order-md-1">
                  <div className="p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
                    <h4 className="fw-bold mb-4 text-center">Login</h4>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        User ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Your ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-muted mt-4 small">
          © {new Date().getFullYear()} Digital Employee ID System
        </p>
      </div>
    </div>
  );
}
