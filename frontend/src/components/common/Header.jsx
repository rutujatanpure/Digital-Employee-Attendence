export default function Header({ title }) {
  return (
    <nav
      className="navbar px-4"
      style={{
        backgroundColor: "#6c757d",  // 🔹 grey background
        color: "#fff",                // text white
        height: "56px"
      }}
    >
      <span className="navbar-brand fw-bold mb-0">{title}</span>
    </nav>
  );
}
