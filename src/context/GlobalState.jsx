import React, { useReducer, useEffect } from "react";
import { GlobalContext } from "./GlobalContext";

// initialState and reducer
const initialState = {
  transactions:
    (JSON.parse(localStorage.getItem("transactions")) || []).map((t) => ({
      ...t,
      amount: Number.isFinite(Number(t.amount)) ? Number(t.amount) : 0,
    })),
  budgets: JSON.parse(localStorage.getItem("budgets")) || {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: (action.payload || []).map((t) => ({
          ...t,
          amount: Number.isFinite(Number(t.amount)) ? Number(t.amount) : 0,
        })),
      };

    case "SET_BUDGET":
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.category]: action.payload.amount,
        },
      };

    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(state.budgets));
  }, [state.budgets]);

  const addTransaction = (transaction) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const updateTransaction = (transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  };

  const setTransactions = (list) => {
    dispatch({ type: "SET_TRANSACTIONS", payload: list });
  };

  const setBudget = (category, amount) => {
    dispatch({ type: "SET_BUDGET", payload: { category, amount } });
  };

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        budgets: state.budgets,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        setTransactions,
        setBudget,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
