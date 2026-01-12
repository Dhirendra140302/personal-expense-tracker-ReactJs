import { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const { addTransaction } = useContext(GlobalContext);

  const onSubmit = (e) => {
    e.preventDefault();

    const amt = Number(amount);
    if (!text.trim() || Number.isNaN(amt) || amt === 0 || !category || !date) {
      return;
    }
    const rounded = Math.round(amt * 100) / 100;

    addTransaction({
      id: Date.now(),
      text,
      amount: rounded,
      category,
      date,
    });

    setText("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  const isValid =
    text.trim() &&
    !Number.isNaN(Number(amount)) &&
    Number(amount) !== 0 &&
    category &&
    date;

  return (
    <>
      <h3>Add Transaction</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="+ income / - expense"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Rent">Rent</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit" disabled={!isValid}>Add</button>
      </form>
    </>
  );
};

export default AddTransaction;
