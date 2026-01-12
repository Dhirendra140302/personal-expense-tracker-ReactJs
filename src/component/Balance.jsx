import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  const total = transactions.reduce((acc, t) => {
    const amount = Number(t.amount);
    return acc + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <h4>Your Balance</h4>
      <h1>{formatter.format(total)}</h1>
    </>
  );
}
export default Balance;
