import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import EmployeeIdOnlyCard from "../../components/employee/EmployeeIdOnlyCard";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { FaClock, FaCheckCircle, FaTimesCircle, FaQrcode } from "react-icons/fa";

export default function EmployeeIDCard() {
  const { id } = useParams();

  const [emp, setEmp] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [activeTheme, setActiveTheme] = useState("theme_1"); 


  useEffect(() => {
    setLoading(true);

    API.get(`/public/employees/${id}`)
      .then((res) => {
        setEmp(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Invalid Employee ID");
        setLoading(false);
      });

    API.get(`/attendance/today/${id}`)
      .then((res) => setAttendance(res.data))
      .catch(() => setAttendance(null));
  }, [id]);
  useEffect(() => {
  API.get("/idcard-theme/active")
    .then((res) => {
      if (res.data?.themeKey) {
        setActiveTheme(res.data.themeKey);
      }
    })
    .catch(() => {
      setActiveTheme("theme_1");
    });
}, []);


  const handleAttendanceScan = async () => {
    if (!emp) return;

    try {
      setScanning(true);
      const res = await API.post("/attendance", {
        employeeId: emp.employeeId,
      });

      setAttendance(res.data.attendance);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error marking attendance");
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner-border" style={{ color: "#667eea", marginBottom: "1rem" }}></div>
            <p style={{ color: "#666", fontSize: "1rem" }}>Loading employee data...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  if (!emp) {
    return (
      <EmployeeLayout>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", padding: "1rem" }}>
          <div style={{
            background: "#fff",
            borderRadius: "0.75rem",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            maxWidth: "400px",
            width: "100%"
          }}>
            <FaTimesCircle style={{ fontSize: "3rem", color: "#dc3545", marginBottom: "1rem" }} />
            <h2 style={{ color: "#dc3545", fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Invalid Employee ID
            </h2>
            <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>
              {message}
            </p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  const getMessageType = (msg) => {
    if (msg.toLowerCase().includes("checked in")) return "success";
    if (msg.toLowerCase().includes("checked out")) return "success";
    if (msg.toLowerCase().includes("error")) return "error";
    return "info";
  };

  const messageType = message ? getMessageType(message) : null;
  const messageColors = {
    success: { bg: "#d4edda", border: "#c3e6cb", color: "#155724", icon: <FaCheckCircle /> },
    error: { bg: "#f8d7da", border: "#f5c6cb", color: "#721c24", icon: <FaTimesCircle /> },
    info: { bg: "#d1ecf1", border: "#bee5eb", color: "#0c5460", icon: <FaClock /> }
  };

  return (
    <EmployeeLayout>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "2rem 1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "500px", width: "100%" }}>
          {/* ID CARD SECTION */}
          
<div style={{ marginBottom: "2rem" }}>
  <div style={{ display: "flex", justifyContent: "center" }}>
    <EmployeeIdOnlyCard emp={emp} themeKey={activeTheme} />  
  </div>
</div>


          {/* ATTENDANCE SECTION */}
          <div style={{
            background: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "2rem",
            animation: "slideUp 0.6s ease-out 0.1s backwards"
          }}>
            {/* HEADER */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                color: "#fff",
                fontSize: "1.5rem"
              }}>
                <FaQrcode />
              </div>
              <h2 style={{ color: "#212529", fontSize: "1.5rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
                Mark Attendance
              </h2>
              <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
                Click the button below to scan your ID
              </p>
            </div>

            {/* SCAN BUTTON */}
            <button
              onClick={handleAttendanceScan}
              disabled={scanning}
              style={{
                width: "100%",
                padding: "1rem",
                background: scanning ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: scanning ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem"
              }}
              onMouseEnter={(e) => {
                if (!scanning) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!scanning) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                }
              }}
            >
              <FaQrcode />
              {scanning ? "Scanning..." : "Scan / Mark Attendance"}
            </button>

            {/* ATTENDANCE TIMES */}
            {attendance && (
              <div style={{
                background: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                marginBottom: "1.5rem"
              }}>
                <h6 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem", margin: 0 }}>
                  Today's Attendance
                </h6>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                  {/* IN TIME */}
                  <div style={{
                    background: "#fff",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #27ae60",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#27ae60",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}>
                      <FaCheckCircle style={{ fontSize: "0.9rem" }} />
                      Check In
                    </div>
                    <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#212529", margin: 0 }}>
                      {attendance.inTime
                        ? new Date(attendance.inTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })
                        : "-"}
                    </p>
                  </div>

                  {/* OUT TIME */}
                  <div style={{
                    background: "#fff",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: `2px solid ${attendance.outTime ? "#e74c3c" : "#ddd"}`,
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "0.8rem",
                      color: attendance.outTime ? "#e74c3c" : "#999",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}>
                      <FaTimesCircle style={{ fontSize: "0.9rem" }} />
                      Check Out
                    </div>
                    <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#212529", margin: 0 }}>
                      {attendance.outTime
                        ? new Date(attendance.outTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MESSAGE */}
            {message && (
              <div style={{
                background: messageColors[messageType].bg,
                border: `2px solid ${messageColors[messageType].border}`,
                color: messageColors[messageType].color,
                padding: "1rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                animation: "slideIn 0.4s ease-out"
              }}>
                {messageColors[messageType].icon}
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
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
    </EmployeeLayout>
  );
}