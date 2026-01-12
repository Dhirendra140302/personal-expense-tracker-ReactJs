import { useContext, useMemo, useState } from "react";
import { GlobalContext } from "../context/GlobalContext.jsx";

const Budget = () => {
  const { transactions, budgets, setBudget } = useContext(GlobalContext);
  const [catInput, setCatInput] = useState("");
  const [amtInput, setAmtInput] = useState("");

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category || "Uncategorized"));
    return Array.from(set);
  }, [transactions]);

  const onAddBudget = (e) => {
    e.preventDefault();
    const cat = catInput || "Uncategorized";
    const amt = Math.max(0, Math.round(Number(amtInput) * 100) / 100);
    if (!Number.isFinite(amt)) return;
    setBudget(cat, amt);
    setCatInput("");
    setAmtInput("");
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Budgets</h3>
      <form onSubmit={onAddBudget} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
        <select value={catInput} onChange={(e) => setCatInput(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="Uncategorized">Uncategorized</option>
        </select>
        <input type="number" placeholder="Budget (₹)" value={amtInput} onChange={(e) => setAmtInput(e.target.value)} />
        <button type="submit">Set</button>
      </form>

      {/* Existing budgets */}
      {Object.keys(budgets || {}).length > 0 && (
        <ul className="list" style={{ marginTop: 8 }}>
          {Object.entries(budgets).map(([cat, amt]) => (
            <li key={cat} className="plus" style={{ borderColor: "#6a11cb" }}>
              <span style={{ marginRight: "auto" }}>{cat}</span>
              <span>₹{amt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Budget;