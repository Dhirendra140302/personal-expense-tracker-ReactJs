const Header = ({ toggleTheme, isDark }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <h2>Expense Tracker</h2>
    <button
      onClick={toggleTheme}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        background: isDark ? "linear-gradient(135deg, #333, #555)" : "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "#fff",
      }}
      aria-label="Toggle dark mode"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  </div>
);
export default Header;
