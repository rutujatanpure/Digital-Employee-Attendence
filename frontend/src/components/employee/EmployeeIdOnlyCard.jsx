import companyLogo from "../../assets/images/logo.png";

export default function EmployeeIdOnlyCard({ emp }) {
  if (!emp) return null;

  return (
    <div
      className="shadow"
      style={{
        width: "260px",
        height: "420px",
        borderRadius: "16px",
        border: "1px solid #d0d7e2",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* 🔵 LEFT SIDE BORDER */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "6px",
          background: "linear-gradient(180deg, #0d6efd, #0a58ca)",
        }}
      />

      {/* 🔵 RIGHT SIDE BORDER */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "6px",
          background: "linear-gradient(180deg, #0d6efd, #0a58ca)",
        }}
      />

      {/* 🔵 BOTTOM BORDER */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "6px",
          background: "linear-gradient(90deg, #0d6efd, #0a58ca)",
        }}
      />

      {/* 🔵 TOP BLUE BELT */}
      <div
        style={{
          height: "65px",
          background: "linear-gradient(90deg, #0d6efd, #0a58ca)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px 0 20px",
          gap: "12px",
        }}
      >
        {/* COMPANY LOGO */}
        <img
          src={companyLogo}
          alt="Nova Tech Solution Logo"
          style={{
            height: "42px",
            width: "42px",
            objectFit: "contain",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "5px",
          }}
        />

        {/* COMPANY NAME */}
        <span
          style={{
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "400",
            letterSpacing: "0.6px",
            whiteSpace: "nowrap",
          }}
        >
          Nova Tech Solution
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div
        style={{
          padding: "18px",
          textAlign: "center",
          flex: 1,
          backgroundColor: "#f1f4f9",
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
              border: "3px solid #ffffff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          />
        )}

        {/* EMPLOYEE NAME */}
        <h5
          style={{
            margin: "6px 0 4px",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          {emp.name}
        </h5>

        {/* EMPLOYEE ROLE */}
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "14px",
            color: "#4b5563",
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
              marginTop: "10px",
            }}
          />
        )}
      </div>
    </div>
  );
}
