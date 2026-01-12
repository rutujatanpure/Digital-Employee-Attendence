import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import loginImage from "../../assets/images/empd.png";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    
    if (!userId || !password) {
      setError("Please enter User ID and Password");
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
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem 1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        {/* MAIN CARD */}
        <div style={{
          background: "#fff",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          animation: "slideUp 0.6s ease-out"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", minHeight: "600px" }}>

            {/* IMAGE SECTION */}
            <div style={{
              background: "#f8f9fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 2rem",
              order: 1
            }}>
              <img
                src={loginImage}
                alt="Employee ID System"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  objectFit: "contain"
                }}
              />
            </div>

            {/* FORM SECTION */}
            <div style={{
              padding: "3rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              order: 2
            }}>
              {/* HEADER */}
              <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#212529",
                  margin: "0 0 0.5rem 0"
                }}>
                  Login 
                </h1>
                <p style={{
                  fontSize: "0.95rem",
                  color: "#666",
                  margin: 0
                }}>
                  Sign in to your account to continue
                </p>
              </div>

              {/* USER ID INPUT */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#212529",
                  marginBottom: "0.75rem"
                }}>
                  <FaUser style={{ marginRight: "0.5rem", color: "#667eea" }} />
                  User ID or Email
                </label>
                <input
                  type="text"
                  placeholder="Enter employee ID or admin email"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: error && !userId ? "2px solid #dc3545" : "1px solid #dee2e6",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error && !userId ? "#dc3545" : "#dee2e6";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <p style={{ fontSize: "0.8rem", color: "#999", margin: "0.5rem 0 0 0" }}>
                  💡 Use your 4-letter ID for employee login, or email for admin
                </p>
              </div>

              {/* PASSWORD INPUT */}
              <div style={{ marginBottom: "2rem" }}>
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      paddingRight: "2.5rem",
                      border: error && !password ? "2px solid #dc3545" : "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => {
                      if (!error) {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error && !password ? "#dc3545" : "#dee2e6";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#667eea",
                      fontSize: "1rem",
                      padding: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div style={{
                  background: "#f8d7da",
                  border: "1px solid #f5c6cb",
                  color: "#721c24",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  animation: "slideIn 0.3s ease-out"
                }}>
                  {error}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.875rem 1.5rem",
                  background: loading ? "#ccc" : "#667eea",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
                  outline: "none"
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = "#5568d3";
                    e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = "#667eea";
                    e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.2)";
                  }
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* FOOTER TEXT */}
              <p style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#999",
                marginTop: "1.5rem"
              }}>
                🔒 Your credentials are secure
              </p>
            </div>

          </div>
        </div>

        {/* COPYRIGHT */}
        <p style={{
          textAlign: "center",
          color: "#999",
          fontSize: "0.85rem",
          marginTop: "2rem"
        }}>
          © {new Date().getFullYear()} Digital Employee ID System. All rights reserved.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          @supports (display: grid) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
              min-height: auto !important;
            }
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}