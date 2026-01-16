import { idCardThemes } from "./idCardThemes";

export default function ThemePreview({ themeKey }) {
  const theme = idCardThemes[themeKey];

  const dummyEmployee = {
    name: "Sarah Johnson",
    role: "Senior Manager",
    employeeId: "EMP001",
    photo: null,
    barcode: null,
  };

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "280/340",
        borderRadius: "10px",
        backgroundColor: theme.background,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        border: "2px solid #e8e8e8",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* TOP ACCENT */}
      <div
        style={{
          height: "5px",
          background: theme.accent,
          width: "100%",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          height: "50px",
          background: theme.header,
          color: "#fff",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          letterSpacing: "0.8px",
        }}
      >
        EMPLOYEE ID CARD
      </div>

      {/* PHOTO */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 12px 6px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "8px",
            background: "#e8e8e8",
            border: "3px solid #fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      {/* INFO */}
      <div style={{ padding: "8px 12px", textAlign: "center", flex: 1 }}>
        <h5
          style={{
            margin: "0 0 3px 0",
            fontWeight: "700",
            fontSize: "12px",
            color: "#0d0d0d",
          }}
        >
          {dummyEmployee.name}
        </h5>
        <p
          style={{
            margin: "0",
            fontSize: "10px",
            color: theme.accent,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          {dummyEmployee.role}
        </p>
      </div>

      {/* BARCODE */}
      <div
        style={{
          padding: "10px 12px",
          textAlign: "center",
          background: "rgba(0, 0, 0, 0.02)",
        }}
      >
        <div
          style={{
            width: "85px",
            height: "25px",
            background: "#d0d0d0",
            borderRadius: "2px",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}