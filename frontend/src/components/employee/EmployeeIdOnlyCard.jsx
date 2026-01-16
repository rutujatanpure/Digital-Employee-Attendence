import { useState, useEffect } from "react";
import companyLogo from "../../assets/images/logo.png";
import API from "../../services/api";
import { idCardThemes } from "../systemAdmin/idCardThemes";

export default function EmployeeIdOnlyCard({ emp }) {
  const [imageError, setImageError] = useState(false);
  const [activeTheme, setActiveTheme] = useState("theme_1");

  // Fetch active theme from backend on load
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

  if (!emp) return null;

  // Pick theme
  const theme = idCardThemes[activeTheme] || idCardThemes.theme_1;

  return (
    <div
      style={{
        width: "280px",
        height: "440px",
        borderRadius: "8px",
        overflow: "hidden",
        background: theme.background,
        border: "3px solid #222",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: "75px",
          background: theme.header,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "12px 14px",
          gap: "10px",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={companyLogo}
          alt="Company logo"
          style={{
            height: "45px",
            width: "45px",
            borderRadius: "6px",
            objectFit: "contain",
            background: "rgba(255, 255, 255, 0.15)",
            padding: "5px",
            border: "1.5px solid rgba(255, 255, 255, 0.3)",
          }}
        />

        <div style={{ color: "#fff", textAlign: "left", flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.2px", lineHeight: "1.1" }}>
            Nova Tech
          </div>
          <div style={{ fontSize: "10px", opacity: 0.8, fontWeight: "600", letterSpacing: "0.6px" }}>
            SOLUTIONS
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div
        style={{
          flex: 1,
          padding: "18px 14px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
        }}
      >
        {/* EMPLOYEE PHOTO */}
        <div
          style={{
            position: "relative",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {emp.photo && !imageError ? (
            <img
              src={`http://localhost:5000/${emp.photo}`}
              alt={`${emp.name} profile`}
              onError={() => setImageError(true)}
              style={{
                width: "130px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "8px",
                border: `3px solid #fff`,
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "130px",
                height: "140px",
                borderRadius: "8px",
                background: "#d8d8d8",
                border: "3px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                color: "#888",
              }}
            >
              👤
            </div>
          )}
        </div>

        {/* EMPLOYEE NAME & ROLE */}
        <div style={{ width: "100%", lineHeight: "1.2" }}>
          <h3
            style={{
              margin: "0 0 4px 0",
              fontSize: "18px",
              fontWeight: "800",
              color: "#1a1a1a",
              letterSpacing: "-0.3px",
            }}
          >
            {emp.name}
          </h3>

          <p
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              color: theme.accent,
              fontWeight: "800",
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            {emp.role}
          </p>
        </div>
      </div>

      {/* BARCODE SECTION */}
      <div
        style={{
          padding: "12px 14px",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {emp.barcode ? (
          <img
            src={`http://localhost:5000/${emp.barcode}`}
            alt="Employee barcode"
            style={{
              width: "115px",
              height: "40px",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
        ) : (
          <div
            style={{
              width: "115px",
              height: "40px",
              background: "#d0d0d0",
              margin: "0 auto",
              borderRadius: "1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#888",
              fontWeight: "700",
              fontFamily: "monospace",
              letterSpacing: "1.5px",
            }}
          >
            ||||||||
          </div>
        )}

        <p
          style={{
            fontSize: "8px",
            color: "#888",
            margin: "4px 0 0 0",
            fontWeight: "600",
            letterSpacing: "0.3px",
          }}
        >
          
        </p>
      </div>
    </div>
  );
}