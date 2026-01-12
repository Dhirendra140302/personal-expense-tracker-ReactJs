import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const IncomeExpenses = () => {
  const { transactions } = useContext(GlobalContext);

  const income = transactions.reduce((acc, t) => {
    const amt = Number(t.amount);
    return acc + (Number.isFinite(amt) && amt > 0 ? amt : 0);
  }, 0);

  const expense = transactions.reduce((acc, t) => {
    const amt = Number(t.amount);
    return acc + (Number.isFinite(amt) && amt < 0 ? Math.abs(amt) : 0);
  }, 0);

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  return (
    <div className="inc-exp-container">
      <div>
        <h4>Income</h4>
        <p className="money plus">{formatter.format(income)}</p>
      </div>
      <div>
        <h4>Expense</h4>
        <p className="money minus">{formatter.format(expense)}</p>
      </div>
    </div>
  );
};

export default IncomeExpenses;
