import Barcode from "./Barcode";
import html2canvas from "html2canvas";

export default function EmployeeCard({ emp, attendance, onScan, message }) {
  const handleDownload = () => {
    const card = document.getElementById("employee-card");
    if (!card) return;

    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${emp.employeeId}_IDCard.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      {/* Last Attendance - Compact */}
      {attendance && (
        <div
          className="mb-3 text-center"
          style={{
            fontSize: "12px",
            color: "#5e5e5e",
            fontWeight: "500",
          }}
        >
          <p style={{ margin: 0, letterSpacing: "0.3px" }}>
            <span style={{ color: "#107c10", fontWeight: "700" }}>
              In: {attendance.inTime
                ? new Date(attendance.inTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "-"}
            </span>
            {" | "}
            <span style={{ color: "#d83b01", fontWeight: "700" }}>
              Out: {attendance.outTime
                ? new Date(attendance.outTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "-"}
            </span>
          </p>
        </div>
      )}

      {/* ID Card */}
      <div
        id="employee-card"
        className="card text-center"
        style={{
          width: "340px",
          minHeight: "420px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          borderRadius: "10px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          border: "2px solid #e8e8e8",
          padding: "20px 18px",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0078d4, #0063b1)",
            color: "#fff",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontWeight: "700",
            fontSize: "12px",
            letterSpacing: "0.8px",
          }}
        >
          EMPLOYEE ID CARD
        </div>

        {/* Employee Photo */}
        <div style={{ marginBottom: "14px" }}>
          {emp.photo ? (
            <img
              src={`http://localhost:5000/${emp.photo}`}
              alt={emp.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                margin: "0 auto",
                border: "3px solid #0078d4",
                boxShadow: "0 4px 12px rgba(0, 120, 212, 0.15)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                background: "#e8e8e8",
                margin: "0 auto",
                border: "3px solid #d0d0d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                color: "#999",
              }}
            >
              👤
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div style={{ marginBottom: "16px" }}>
          <h4
            style={{
              margin: "0 0 4px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#0d0d0d",
            }}
          >
            {emp.name}
          </h4>
          <p
            style={{
              margin: "0 0 2px 0",
              fontSize: "12px",
              color: "#0078d4",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {emp.role}
          </p>
        </div>

        {/* Barcode */}
        <div style={{ marginBottom: "14px" }}>
          {emp.barcode ? (
            <img
              src={`http://localhost:5000/${emp.barcode}`}
              alt={`Barcode ${emp.employeeId}`}
              style={{
                width: "85%",
                height: "42px",
                margin: "0 auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                width: "85%",
                height: "42px",
                background: "#d0d0d0",
                margin: "0 auto",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "#888",
                fontWeight: "600",
                fontFamily: "monospace",
                letterSpacing: "1.5px",
              }}
            >
              ||||||||||||
            </div>
          )}
        </div>

        {/* Scan Attendance Button */}
        <button
          onClick={onScan}
          style={{
            padding: "10px 16px",
            fontSize: "13px",
            fontWeight: "700",
            border: "none",
            borderRadius: "6px",
            background: "#0078d4",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0, 120, 212, 0.2)",
            marginBottom: message ? "12px" : "0",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#0063b1";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(0, 120, 212, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#0078d4";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(0, 120, 212, 0.2)";
          }}
        >
          Scan Attendance
        </button>

        {/* Message */}
        {message && (
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: message.includes("❌") ? "#721c24" : "#155724",
              background: message.includes("❌") ? "#f8d7da" : "#d4edda",
              border: `1px solid ${message.includes("❌") ? "#f5c6cb" : "#c3e6cb"}`,
              padding: "8px 12px",
              borderRadius: "6px",
              marginTop: "4px",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}