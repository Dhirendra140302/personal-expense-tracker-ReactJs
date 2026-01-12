import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext.jsx";

const categoryColors = {
  Food: "#F44336",
  Transport: "#2196F3",
  Rent: "#9C27B0",
  Shopping: "#FF9800",
  Other: "#607D8B",
  Uncategorized: "#795548",
};

const Transaction = ({ transaction }) => {
  const { deleteTransaction, updateTransaction } = useContext(GlobalContext);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(transaction.text);
  const [amount, setAmount] = useState(transaction.amount);

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const saveEdit = () => {
    const amt = Number(amount);
    if (Number.isNaN(amt) || amt === 0) return;

    updateTransaction({
      ...transaction,
      text,
      amount: Math.round(amt * 100) / 100,
    });
    setEditing(false);
  };

  const cat = transaction.category || "Uncategorized";
  const badgeStyle = {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: "999px",
    fontSize: 12,
    color: "#fff",
    background: categoryColors[cat] || categoryColors.Uncategorized,
    marginLeft: 8,
  };

  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {editing ? (
        <>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={saveEdit}>✔</button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>{transaction.text}</span>
            <span style={badgeStyle}>{cat}</span>
            {transaction.date && (
              <small style={{ color: "#666", marginLeft: 8 }}>
                {transaction.date}
              </small>
            )}
          </div>
          <span>{formatter.format(transaction.amount)}</span>
          <button onClick={() => setEditing(true)}>✎</button>
          <button onClick={() => deleteTransaction(transaction.id)}>x</button>
        </>
      )}
    </li>
  );
};

export default Transaction;
