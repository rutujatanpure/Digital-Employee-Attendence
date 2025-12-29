export default function EmployeeIdOnlyCard({ emp }) {
  if (!emp) return null;

  return (
    <div
      className="shadow"
      style={{
        width: "260px",
        height: "420px",
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* GREEN STRAIGHT STRIP */}
      <div
        style={{
          height: "50px",
          background: "linear-gradient(90deg, #1e9e4a, #2ecc71)",
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          padding: "18px",
          textAlign: "center",
          flex: 1,
           backgroundColor: "#dbdfe3ff", 
        }}
      >
        {/* EMPLOYEE IMAGE */}
        {emp.photo && (
          <img
            src={`http://localhost:5000/${emp.photo}`}
            crossOrigin="anonymous"
            alt={emp.name}
            style={{
              width: "150px",
              height: "135px",
              objectFit: "cover",
              borderRadius: "14px",
              marginBottom: "12px",
              border: "3px solid #f1f1f1",
            }}
          />
        )}

        {/* NAME */}
        <h5
          style={{
            margin: "6px 0 4px",
            fontWeight: "600",
            color: "#222",
          }}
        >
          {emp.name}
        </h5>

        {/* ROLE */}
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "14px",
            color: "#666",
            fontWeight: "500",
          }}
        >
          {emp.role}
        </p>

        {/* BARCODE */}
        {emp.barcode && (
          <img
            src={`http://localhost:5000/${emp.barcode}`}
            crossOrigin="anonymous"
            alt="barcode"
            style={{
              width: "100%",
              height: "50px",
              objectFit: "contain",
              marginTop: "9px",
            }}
          />
        )}
      </div>
    </div>
  );
}
