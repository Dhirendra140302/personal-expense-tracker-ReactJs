import { Pie, Bar, Line } from "react-chartjs-2";
import { useContext, useMemo } from "react";
import { GlobalContext } from "../context/GlobalContext.jsx";
import "chart.js/auto";

const Analytics = () => {
  const { transactions, budgets } = useContext(GlobalContext);

  // Pie: expenses by category
  const categories = {};
  transactions.forEach((t) => {
    const amt = Number(t.amount);
    if (amt < 0) {
      const key = t.category || "Uncategorized";
      categories[key] = (categories[key] || 0) + Math.abs(amt);
    }
  });
  const pieLabels = Object.keys(categories);
  const pieValues = Object.values(categories);
  const palette = ["#4CAF50", "#F44336", "#2196F3", "#FF9800", "#9C27B0", "#00BCD4", "#795548", "#607D8B", "#8BC34A", "#E91E63"];
  const pieColors = pieLabels.map((_, i) => palette[i % palette.length]);

  // Bar: monthly income vs expense
  const monthly = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const amt = Number(t.amount);
      const m = (t.date || "No Date").slice(0, 7) || "No Date";
      const isIncome = amt > 0;
      const val = Math.abs(amt);
      map[m] = map[m] || { income: 0, expense: 0 };
      if (isIncome) map[m].income += val;
      else map[m].expense += val;
    });
    const months = Object.keys(map).filter((m) => m !== "No Date").sort(); // ascending
    return {
      labels: months,
      income: months.map((m) => map[m].income),
      expense: months.map((m) => map[m].expense),
    };
  }, [transactions]);

  // Line: cumulative balance over time
  const balanceTrend = useMemo(() => {
    const withDate = transactions
      .filter((t) => t.date)
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const labels = withDate.map((t) => t.date);
    const values = withDate.reduce((acc, t) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prevTotal + Number(t.amount));
      return acc;
    }, []);
    return { labels, values };
  }, [transactions]);

  return (
    <>
      <div style={{ height: 260 }}>
        <Pie
          data={{
            labels: pieLabels,
            datasets: [{ data: pieValues, backgroundColor: pieColors, borderColor: "#ffffff", borderWidth: 2 }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // prevent reflow from chart animations
            plugins: { legend: { position: "top" }, title: { display: true, text: "Expenses by Category" } },
          }}
        />
      </div>

      <div style={{ height: 260, marginTop: 16 }}>
        <Bar
          data={{
            labels: monthly.labels,
            datasets: [
              { label: "Income", data: monthly.income, backgroundColor: "rgba(76,175,80,0.7)" },
              { label: "Expense", data: monthly.expense, backgroundColor: "rgba(244,67,54,0.7)" },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // prevent reflow from chart animations
            plugins: { legend: { position: "top" }, title: { display: true, text: "Monthly Income vs Expense" } },
          }}
        />
      </div>

      <div style={{ height: 260, marginTop: 16 }}>
        <Line
          data={{
            labels: balanceTrend.labels,
            datasets: [{ label: "Cumulative Balance", data: balanceTrend.values, borderColor: "#2575fc", backgroundColor: "rgba(37,117,252,0.2)", tension: 0.25 }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // prevent reflow from chart animations
            plugins: { legend: { position: "top" }, title: { display: true, text: "Balance Trend Over Time" } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>

      {/* Budget progress */}
      {Object.keys(budgets || {}).length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4 className="section-title">Budget Progress</h4>
          {Object.entries(budgets).map(([cat, budget]) => {
            const spent = categories[cat] || 0;
            const pct = Math.min(100, budget ? Math.round((spent / budget) * 100) : 0);
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <strong>{cat}</strong>
                  <span>
                    {spent}/{budget} (₹)
                  </span>
                </div>
                <div style={{ height: 10, background: "#eee", borderRadius: 999 }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                      borderRadius: 999,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Analytics;
