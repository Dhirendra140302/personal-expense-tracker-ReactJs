import { useContext, useRef } from "react";
import { GlobalContext } from "../context/GlobalContext.jsx";

function DataManagement() {
  const { transactions, setTransactions } = useContext(GlobalContext);
  const fileRef = useRef(null);

  const download = (filename, content, type = "application/json") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    download("transactions.json", JSON.stringify(transactions, null, 2));
  };

  const exportCSV = () => {
    const headers = ["id", "text", "amount", "category", "date"];
    const rows = transactions.map((t) =>
      headers.map((h) => JSON.stringify(t[h] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    download("transactions.csv", csv, "text/csv");
  };

  const importFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let list = [];
    try {
      if (file.name.endsWith(".json")) {
        list = JSON.parse(text);
      } else if (file.name.endsWith(".csv")) {
        const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
        const headers = headerLine.split(",").map((h) => h.replace(/^"|"$/g, ""));
        list = lines.map((line) => {
          const cols = line.split(",").map((c) => c.replace(/^"|"$/g, ""));
          const obj = {};
          headers.forEach((h, i) => (obj[h] = cols[i]));
          obj.amount = Number(obj.amount);
          obj.id = Number(obj.id) || Date.now() + Math.random();
          return obj;
        });
      }
      setTransactions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Import failed", err);
    } finally {
      e.target.value = "";
    }
  };

  const seedDemo = () => {
    const now = new Date();
    const ym = (mOffset) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() + mOffset);
      return d.toISOString().slice(0, 10);
    };
    const sample = [
      { id: Date.now() + 1, text: "Salary", amount: 45000, category: "Other", date: ym(-2) },
      { id: Date.now() + 2, text: "Rent", amount: -12000, category: "Rent", date: ym(-2) },
      { id: Date.now() + 3, text: "Groceries", amount: -2500, category: "Food", date: ym(-1) },
      { id: Date.now() + 4, text: "Fuel", amount: -800, category: "Transport", date: ym(-1) },
      { id: Date.now() + 5, text: "Freelance", amount: 6000, category: "Other", date: ym(0) },
      { id: Date.now() + 6, text: "Shopping", amount: -3500, category: "Shopping", date: ym(0) },
    ];
    setTransactions(sample);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Data</h3>
      <div className="data-actions">
        <button onClick={exportJSON}>Export JSON</button>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={() => fileRef.current?.click()}>Import JSON/CSV</button>
        <button onClick={seedDemo}>Seed Demo Data</button>
      </div>
      <input ref={fileRef} type="file" accept=".json,.csv" style={{ display: "none" }} onChange={importFile} />
    </div>
  );
};

export default DataManagement;