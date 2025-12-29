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
      {/* Last Attendance */}
      {attendance && (
        <div className="mb-2 text-center">
          <p style={{ margin: 0, fontSize: "14px" }}>
            In Time:{" "}
            {attendance.inTime
              ? new Date(attendance.inTime).toLocaleTimeString()
              : "-"}{" "}
            | Out Time:{" "}
            {attendance.outTime
              ? new Date(attendance.outTime).toLocaleTimeString()
              : "-"}
          </p>
        </div>
      )}

      {/* ID Card */}
      <div
        id="employee-card"
        className="card text-center p-2"
        style={{
          width: "340px",
          height: "214px",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Employee Photo */}
        {emp.photo && (
  <img
    src={`http://localhost:5000/${emp.photo}`}
    alt={emp.name}
    style={{
      width: "80px",
      height: "80px",
      objectFit: "cover",
      borderRadius: "50%",
      margin: "10px auto 5px",
    }}
  />
)}

        {/* Name & Role */}
        <div>
          <h5 style={{ margin: 0 }}>{emp.name}</h5>
          <p style={{ margin: 0, fontSize: "14px" }}>{emp.role}</p>
          <p style={{ margin: 0, fontSize: "12px" }}>ID: {emp.employeeId}</p>
        </div>

        {/* Barcode */}
        {emp.barcode && (
  <img
    src={`http://localhost:5000/${emp.barcode}`}
    alt={`Barcode ${emp.employeeId}`}
    style={{ width: "80%", height: "40px", margin: "0 auto" }}
  />
)}

        {/* Scan Attendance Button */}
        <button
          className="btn btn-primary mt-2"
          onClick={onScan}
          style={{ fontSize: "14px" }}
        >
          Scan Attendance
        </button>

        {/* Message */}
        {message && (
          <p
            style={{
              fontSize: "13px",
              color: message.includes("❌") ? "red" : "green",
              marginTop: "5px",
            }}
          >
            {message}
          </p>
        )}
      </div>

     
    </div>
  );
}
