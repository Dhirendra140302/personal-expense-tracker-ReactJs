import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext.jsx";
import Transaction from "./Transaction.jsx";
import Search from "./Search.jsx";
import DateFilter from "./DateFilter.jsx";

const TransactionList = () => {
  const { transactions } = useContext(GlobalContext);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = transactions.filter((t) => {
    const matchText = t.text.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter ? (t.date || "").startsWith(dateFilter) : true;
    return matchText && matchDate;
  });

  const sorted = [...filtered].sort((a, b) => {
    const ad = a.date || "";
    const bd = b.date || "";
    switch (sortBy) {
      case "oldest":
        return ad.localeCompare(bd);
      case "amount_high":
        return (b.amount || 0) - (a.amount || 0);
      case "amount_low":
        return (a.amount || 0) - (b.amount || 0);
      case "a_to_z":
        return a.text.localeCompare(b.text);
      case "z_to_a":
        return b.text.localeCompare(a.text);
      case "newest":
      default:
        return bd.localeCompare(ad);
    }
  });

  // Group by month (YYYY-MM)
  const groups = sorted.reduce((acc, t) => {
    const key = (t.date || "No Date").slice(0, 7) || "No Date";
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});
  const monthKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <h3>History</h3>

      <Search setSearch={setSearch} />
      <DateFilter setDateFilter={setDateFilter} />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="amount_high">Amount: High to Low</option>
        <option value="amount_low">Amount: Low to High</option>
        <option value="a_to_z">Text: A → Z</option>
        <option value="z_to_a">Text: Z → A</option>
      </select>

      {monthKeys.map((m) => (
        <div key={m} style={{ marginTop: 10 }}>
          <h4 className="section-title">{m === "No Date" ? "No Date" : m}</h4>
          <ul className="list">
            {groups[m].map((t) => (
              <Transaction key={t.id} transaction={t} />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default TransactionList;
