import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import API from "../../services/api";
import ThemePreview from "./ThemePreview";
import themes from "./themes";
import { toast } from "react-toastify";

export default function IdCardThemePage() {
  const [activeTheme, setActiveTheme] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/idcard-theme/active")
      .then((res) => {
        if (res.data?.themeKey) setActiveTheme(res.data.themeKey);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const applyTheme = async (themeKey) => {
    try {
      await API.post("/idcard-theme/apply", { themeKey });
      setActiveTheme(themeKey);
      setPageMessage("Theme applied successfully ✅");
      setTimeout(() => setPageMessage(""), 4000);
      toast.success("Theme saved & applied");
    } catch {
      setPageMessage("Failed to apply theme ❌");
      setTimeout(() => setPageMessage(""), 3000);
      toast.error("Failed to apply theme");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          padding: "48px",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "48px" }}>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "32px",
              fontWeight: "600",
              color: "#0d0d0d",
              letterSpacing: "-0.5px",
            }}
          >
            ID Card Themes
          </h1>
          <p
            style={{
              margin: "0",
              fontSize: "15px",
              color: "#5e5e5e",
              fontWeight: "400",
            }}
          >
            Choose and customize your employee ID card design from our professional collection
          </p>
        </div>

        {/* Success Message */}
        {pageMessage && (
          <div
            style={{
              background: pageMessage.includes("successfully")
                ? "#d4edda"
                : "#f8d7da",
              color: pageMessage.includes("successfully")
                ? "#155724"
                : "#721c24",
              padding: "14px 16px",
              borderRadius: "6px",
              marginBottom: "32px",
              fontWeight: "500",
              fontSize: "14px",
              border: `1px solid ${
                pageMessage.includes("successfully")
                  ? "#c3e6cb"
                  : "#f5c6cb"
              }`,
              animation: "slideIn 0.3s ease",
            }}
          >
            {pageMessage}
          </div>
        )}

        {/* Themes Grid */}
        {!loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "28px",
            }}
          >
            {themes.map((t) => (
              <div
                key={t.key}
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border:
                    activeTheme === t.key
                      ? "3px solid #0078d4"
                      : "1px solid #e8e8e8",
                  transition: "all 0.3s ease",
                  boxShadow:
                    activeTheme === t.key
                      ? "0 12px 32px rgba(0, 120, 212, 0.2)"
                      : "0 4px 12px rgba(0, 0, 0, 0.08)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  transform:
                    activeTheme === t.key ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {activeTheme === t.key && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      background: "#0078d4",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "700",
                      zIndex: "10",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      boxShadow: "0 4px 12px rgba(0, 120, 212, 0.3)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ✓ ACTIVE
                  </div>
                )}

                <div
                  style={{
                    padding: "24px",
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <ThemePreview themeKey={t.key} />

                  <h3
                    style={{
                      margin: "20px 0 0 0",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#0d0d0d",
                      textAlign: "center",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {t.name}
                  </h3>

                  <button
                    onClick={() => applyTheme(t.key)}
                    disabled={activeTheme === t.key}
                    style={{
                      marginTop: "18px",
                      padding: "11px 18px",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: activeTheme === t.key ? "default" : "pointer",
                      transition: "all 0.2s ease",
                      background: activeTheme === t.key ? "#f0f0f0" : "#0078d4",
                      color: activeTheme === t.key ? "#7a7a7a" : "#fff",
                      boxShadow:
                        activeTheme === t.key
                          ? "none"
                          : "0 4px 12px rgba(0, 120, 212, 0.25)",
                      letterSpacing: "0.3px",
                    }}
                    onMouseEnter={(e) => {
                      if (activeTheme !== t.key) {
                        e.target.style.background = "#0063b1";
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 16px rgba(0, 120, 212, 0.35)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTheme !== t.key) {
                        e.target.style.background = "#0078d4";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(0, 120, 212, 0.25)";
                      }
                    }}
                  >
                    {activeTheme === t.key ? "Applied ✓" : "Save & Apply"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}