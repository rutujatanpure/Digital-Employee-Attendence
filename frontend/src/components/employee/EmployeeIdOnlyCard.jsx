import { useState } from 'react';

import companyLogo from "../../assets/images/logo.png";

export default function EmployeeIdOnlyCard({ emp = { name: "John Doe", role: "Senior Developer", photo: null, barcode: null } }) {
  const [imageError, setImageError] = useState(false);

  if (!emp) return null;

  return (
    <div
      className="shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{
        width: "280px",
        minHeight: "440px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Accent borders */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          background: "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)",
        }}
      />

      {/* Top section with company branding */}
      <div
        style={{
          height: "70px",
          background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "12px",
        }}
      >
        <img
          src={companyLogo}
          alt="Company Logo"
          style={{
            height: "44px",
            width: "44px",
            objectFit: "contain",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "4px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        />

        <div style={{ flex: 1 }}>
          <span
            style={{
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "0.3px",
              display: "block",
              lineHeight: "1.2",
            }}
          >
            Nova Tech
          </span>
          <span
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "12px",
              fontWeight: "400",
              letterSpacing: "0.2px",
            }}
          >
            SOLUTIONS
          </span>
        </div>
      </div>

      {/* Content section */}
      <div
        style={{
          padding: "24px 18px",
          textAlign: "center",
          flex: 1,
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Employee photo */}
        {emp.photo && !imageError && (
          <div
            style={{
              marginBottom: "16px",
              position: "relative",
            }}
          >
            <img
              src={`http://localhost:5000/${emp.photo}`}
              crossOrigin="anonymous"
              alt={emp.name}
              onError={() => setImageError(true)}
              style={{
                width: "140px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "3px solid #ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        )}

        {/* Employee name */}
        <h3
          style={{
            margin: "8px 0 6px",
            fontSize: "18px",
            fontWeight: "700",
            color: "#0f172a",
            letterSpacing: "0.2px",
          }}
        >
          {emp.name}
        </h3>

        {/* Employee role */}
        <p
          style={{
            margin: "0 0 20px",
            fontSize: "13px",
            color: "#64748b",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            lineHeight: "1.4",
          }}
        >
          {emp.role}
        </p>

        {/* Barcode */}
        {emp.barcode && (
          <div
            style={{
              marginTop: "auto",
              width: "100%",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <img
              src={`http://localhost:5000/${emp.barcode}`}
              crossOrigin="anonymous"
              alt="Employee Barcode"
              style={{
                width: "120px",
                height: "40px",
                objectFit: "contain",
                margin: "0 auto",
                display: "block",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: "#94a3b8",
                marginTop: "6px",
                display: "block",
                letterSpacing: "0.5px",
              }}
            >
              ID SCAN
            </span>
          </div>
        )}
      </div>
    </div>
  );
}